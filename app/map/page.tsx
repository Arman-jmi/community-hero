import { Metadata } from "next"
import { CommunityMap } from "@/components/maps/CommunityMap"

export const metadata: Metadata = {
 title: "Interactive Map | Civic Hero",
 description: "View and filter civic issues reported by the community on a live map.",
}

export default function MapPage() {
 return (
 <main className="w-full h-screen">
 <CommunityMap />
 </main>
 )
}
