import * as React from "react"
import Link from "next/link"
import { Shield, Globe, MessageSquare, Mail } from "lucide-react"

export function Footer() {
 return (
 <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
 
 <div className="md:col-span-1">
 <Link href="/" className="flex items-center gap-2 mb-4">
 <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
 <Shield className="h-5 w-5 text-foreground" />
 </div>
 <span className="font-bold text-xl tracking-tight text-foreground">
 CivicHero
 </span>
 </Link>
 <p className="text-sm text-muted-foreground max-w-xs">
 AI-powered civic reporting platform turning citizens into civic heroes.
 </p>
 </div>

 <div>
 <h4 className="font-semibold text-foreground mb-4">Product</h4>
 <ul className="space-y-2 text-sm text-muted-foreground">
 <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
 <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
 <li><Link href="/map" className="hover:text-foreground transition-colors">Live Map</Link></li>
 <li><Link href="/rewards" className="hover:text-foreground transition-colors">Rewards</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-semibold text-foreground mb-4">Legal</h4>
 <ul className="space-y-2 text-sm text-muted-foreground">
 <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
 <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
 <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-semibold text-foreground mb-4">Connect</h4>
 <div className="flex items-center gap-4">
 <a href="#" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
 <Globe className="h-5 w-5" />
 </a>
 <a href="#" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
 <MessageSquare className="h-5 w-5" />
 </a>
 <a href="#" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
 <Mail className="h-5 w-5" />
 </a>
 </div>
 </div>
 </div>
 
 <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
 <p>© {new Date().getFullYear()} CivicHero. All rights reserved.</p>
 <p>Built for the Hackathon</p>
 </div>
 </div>
 </footer>
 )
}
