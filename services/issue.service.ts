import { IssueReport } from "@/types/issue";
import { db } from "@/lib/firebase/config";
import { addDoc, collection, Timestamp, doc, updateDoc, increment } from "firebase/firestore";
import { awardXP } from "@/services/xp.service";
import { XP_VALUES } from "@/utils/xpConstants";

export const compressImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Max dimensions
        const MAX_DIMENSION = 800;
        
        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress with JPEG at 60% quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function submitIssueReport(report: IssueReport, image: File): Promise<void> {
  let imageUrl = "pending_upload";
  
  try {
    console.log("Starting image compression...");
    imageUrl = await compressImageToBase64(image);
    console.log("Image compressed and encoded to Base64 successfully.");
  } catch (error: any) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to process image. Please try another photo.");
  }
  
  const reportToSave: any = {
    ...report,
    imageUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  Object.keys(reportToSave).forEach(key => {
    if (reportToSave[key] === undefined) {
      delete reportToSave[key];
    }
  });

  try {
    console.log("Saving Firestore...");
    const docRef = await addDoc(collection(db, "reports"), reportToSave);
    console.log("Firestore saved");

    // Award XP for report creation and increment reportsSubmitted
    if (report.userId) {
      try {
        await awardXP(
          report.userId,
          "REPORT_CREATED",
          XP_VALUES.REPORT_CREATED,
          "Submitted a new issue report",
          docRef.id
        );
        // Increment reportsSubmitted counter
        const userRef = doc(db, "users", report.userId);
        await updateDoc(userRef, {
          reportsSubmitted: increment(1),
          updatedAt: Timestamp.now(),
        });
      } catch (xpError) {
        // Don't fail the report submission if XP award fails
        console.error("Error awarding XP for report:", xpError);
      }
    }
  } catch (error) {
    console.error("Error submitting report to Firestore:", error);
    throw error;
  }
  
  console.log("Submission complete");
}
