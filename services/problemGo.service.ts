"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, addDoc, Timestamp, doc, getDoc, updateDoc, increment, runTransaction, arrayUnion } from "firebase/firestore"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { IssueReport } from "@/types/issue"
import { GeminiVerificationResult, VerificationRecord, VerificationStatus } from "@/types/problem-go"
import { awardXP } from "@/services/xp.service"
import { XP_VALUES } from "@/utils/xpConstants"

const API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(API_KEY)

const COMMUNITY_VERIFICATION_THRESHOLD = 5

export async function fetchUnresolvedIssues(): Promise<IssueReport[]> {
  try {
    const q = query(collection(db, "reports"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    const issues: IssueReport[] = [];
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      issues.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        // Safe defaults for community verification fields
        verificationCount: data.verificationCount ?? 0,
        verifiedBy: data.verifiedBy ?? [],
        communityVerified: data.communityVerified ?? false,
        problemGoVisible: data.problemGoVisible ?? true,
      } as IssueReport);
    });
    
    // Filter out issues that have been community verified (5/5)
    // This removes them from Problem GO only — they remain in all other views
    return issues.filter(issue => issue.communityVerified !== true);
  } catch (error) {
    console.error("Error fetching unresolved issues:", error);
    return [];
  }
}

export async function getIssueById(id: string): Promise<IssueReport | null> {
  try {
    const docRef = doc(db, "reports", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        // Safe defaults for community verification fields
        verificationCount: data.verificationCount ?? 0,
        verifiedBy: data.verifiedBy ?? [],
        communityVerified: data.communityVerified ?? false,
        problemGoVisible: data.problemGoVisible ?? true,
      } as IssueReport;
    }
    return null;
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    return null;
  }
}

const PROMPT = `
You are an expert civic maintenance auditor.
I am providing two images.
Image 1 (first): The originally reported civic issue.
Image 2 (second): A fresh photo taken by a citizen just now to verify the current state of that exact same location.

Compare the two images and determine the current state of the issue.
Return ONLY a valid JSON object matching exactly this structure, with no markdown formatting or backticks:
{
  "status": "String (Must be exactly one of: 'Still Exists', 'Partially Resolved', 'Fully Resolved', 'Fake Report')",
  "confidence": Number (Integer between 0 and 100),
  "explanation": "String (Brief 1-2 sentence explanation of your decision)"
}

Notes on status:
- 'Still Exists': The issue looks largely the same as the original report.
- 'Partially Resolved': Work has begun (e.g., cones placed, partial patching) but it's not finished.
- 'Fully Resolved': The issue is completely fixed (e.g., pothole filled, graffiti removed, trash cleared).
- 'Fake Report': The new image is completely unrelated, impossible to verify, or clearly fraudulent.
`

export async function verifyIssue(
  issueId: string,
  userId: string,
  originalImageUrl: string,
  newBase64Image: string
): Promise<{ result: GeminiVerificationResult, xpEarned: number }> {
  
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  if (!newBase64Image) throw new Error("No verification image provided.");

  // ── 1. Duplicate check using Firestore transaction ──
  // This atomically checks and updates the verification counter
  const issueRef = doc(db, "reports", issueId);
  
  await runTransaction(db, async (transaction) => {
    const issueSnap = await transaction.get(issueRef);
    if (!issueSnap.exists()) {
      throw new Error("Issue not found.");
    }

    const issueData = issueSnap.data();
    const verifiedBy: string[] = issueData.verifiedBy ?? [];

    // Check for duplicate verification
    if (verifiedBy.includes(userId)) {
      throw new Error("DUPLICATE_VERIFICATION");
    }

    const currentCount = issueData.verificationCount ?? 0;
    const newCount = currentCount + 1;

    // Prepare the update
    const updatePayload: Record<string, any> = {
      verificationCount: newCount,
      verifiedBy: arrayUnion(userId),
      updatedAt: Timestamp.now(),
    };

    // Check if threshold is reached
    if (newCount >= COMMUNITY_VERIFICATION_THRESHOLD) {
      updatePayload.communityVerified = true;
      updatePayload.problemGoVisible = false;
      updatePayload.status = "community_verified";
    }

    transaction.update(issueRef, updatePayload);
  });

  // ── 2. Process images and call Gemini AI ──
  console.log("Original image loaded");
  console.log("Verification image converted");

  let originalBase64 = "";
  let originalMimeType = "image/jpeg";
  
  if (originalImageUrl.startsWith("data:")) {
    const parts = originalImageUrl.split(",");
    originalMimeType = parts[0].split(":")[1].split(";")[0];
    originalBase64 = parts[1];
  } else {
    // Legacy support for older reports that used Firebase Storage
    const originalRes = await fetch(originalImageUrl);
    if (!originalRes.ok) throw new Error("Failed to fetch original image for comparison.");
    const originalArrayBuffer = await originalRes.arrayBuffer();
    originalBase64 = Buffer.from(originalArrayBuffer).toString("base64");
    originalMimeType = originalRes.headers.get("content-type") || "image/jpeg";
  }

  const parts = newBase64Image.split(",");
  const newMimeType = parts[0].split(":")[1].split(";")[0];
  const newBase64 = parts[1];

  const modelName = "gemini-2.5-flash";
  console.log("Starting verification");
  console.log("Original image size:", originalBase64.length);
  console.log("Verification image size:", newBase64.length);
  console.log("Using model:", modelName);

  const model = genAI.getGenerativeModel({ model: modelName });

  const imageParts = [
    { inlineData: { data: originalBase64, mimeType: originalMimeType } },
    { inlineData: { data: newBase64, mimeType: newMimeType } }
  ];

  let geminiResult: GeminiVerificationResult;
  try {
    const result = await model.generateContent([PROMPT, ...imageParts]);
    const responseText = (await result.response).text();
    console.log("Gemini raw response:", responseText);
    
    const cleanedText = responseText.replace(/```json\n?|```\n?/g, "").trim();
    try {
      geminiResult = JSON.parse(cleanedText) as GeminiVerificationResult;
    } catch (parseError) {
      geminiResult = {
        status: "Fake Report",
        confidence: 0,
        explanation: "Gemini returned an invalid response."
      };
    }
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    console.error("Model:", modelName);
    console.error("API Key Exists:", !!process.env.GEMINI_API_KEY);
    throw error;
  }

  // ── 3. Save Verification Record to Firestore ──
  const verificationRecord: VerificationRecord = {
    issueId,
    userId,
    image: newBase64Image, // Store Base64 directly
    status: geminiResult.status,
    confidence: geminiResult.confidence,
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "verifications"), verificationRecord);

  // ── 4. Award XP using centralized XP service ──
  let xpAwarded = 0;

  // Base verification XP
  const baseResult = await awardXP(
    userId,
    "VERIFICATION_COMPLETED",
    XP_VALUES.VERIFICATION_COMPLETED,
    "Community verification completed",
    issueId
  );
  xpAwarded += XP_VALUES.VERIFICATION_COMPLETED;

  // High-confidence bonus
  if (geminiResult.confidence >= 90) {
    await awardXP(
      userId,
      "HIGH_CONFIDENCE_BONUS",
      XP_VALUES.HIGH_CONFIDENCE_BONUS,
      "High-confidence verification bonus",
      issueId
    );
    xpAwarded += XP_VALUES.HIGH_CONFIDENCE_BONUS;
  }

  return { result: geminiResult, xpEarned: xpAwarded };
}
