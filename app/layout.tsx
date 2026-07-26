import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { NavigationWrapper } from "@/components/layout/NavigationWrapper";

export const metadata = {
 title: "Civic Hero",
 description: "AI-Powered Hyperlocal Civic Problem Solver",
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en">
 <body>
 <AuthProvider>
 <NavigationWrapper />
 {children}
 <Toaster richColors position="top-right" />
 </AuthProvider>
 </body>
 </html>
 );
}
