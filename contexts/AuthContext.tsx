"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { UserService } from "@/services/UserService";
import { UserProfile } from "@/types/user";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch or wait for profile creation
        try {
          const token = await firebaseUser.getIdToken();
          Cookies.set("auth-token", token, { expires: 14 }); // 14 days
          
          let userProfile = await UserService.getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            // Give it a brief moment if it's currently being created by registration
            await new Promise(resolve => setTimeout(resolve, 1000));
            userProfile = await UserService.getUserProfile(firebaseUser.uid);
          }
          setProfile(userProfile);

          // Check daily login reward (once every 24 hours)
          if (userProfile) {
            try {
              const { checkDailyLogin } = await import("@/services/xp.service");
              const awarded = await checkDailyLogin(firebaseUser.uid);
              if (awarded) {
                const refreshedProfile = await UserService.getUserProfile(firebaseUser.uid);
                if (refreshedProfile) {
                  setProfile(refreshedProfile);
                }
              }
            } catch (err) {
              console.error("Error during daily login check:", err);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile in auth context:", error);
          setProfile(null);
        }
      } else {
        Cookies.remove("auth-token");
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
