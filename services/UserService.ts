import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { UserProfile } from "@/types/user";
import { COLLECTIONS } from "@/lib/firebase/collections";

export class UserService {
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Auto-initialize missing required fields for authority accounts created manually
      if (data.role === "authority") {
        let needsUpdate = false;
        const requiredDefaults = {
          xp: 0,
          totalXP: data.xp ?? 0,
          level: 1,
          trustScore: 100,
          reportsSubmitted: 0,
          reportsVerified: 0,
          fakeReports: 0,
          badges: [],
          lastDailyReward: null,
          reportsApproved: 0,
          successfulVerifications: 0,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now()
        };

        const updatedData = { ...data };
        
        for (const [key, value] of Object.entries(requiredDefaults)) {
          if (updatedData[key] === undefined) {
            updatedData[key] = value;
            needsUpdate = true;
          }
        }

        // Also ensure uid is set
        if (!updatedData.uid) {
          updatedData.uid = uid;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await setDoc(docRef, updatedData, { merge: true });
        }
        
        return updatedData as UserProfile;
      }

      return data as UserProfile;
    }
    return null;
  }

  static async initializeNewUser(uid: string, email: string, name: string, avatar: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const newUser: UserProfile = {
        uid,
        email,
        name,
        avatar,
        role: "citizen",
        xp: 0,
        totalXP: 0,
        level: 1,
        trustScore: 100,
        reportsSubmitted: 0,
        reportsVerified: 0,
        fakeReports: 0,
        badges: [],
        lastDailyReward: null,
        reportsApproved: 0,
        successfulVerifications: 0,
        createdAt: Timestamp.now() as any,
        updatedAt: Timestamp.now() as any
      };
      await setDoc(docRef, newUser);
    }
  }
}
