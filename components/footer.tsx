import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="gradient-text font-medium">Noah Andersen-Kiel</span>. Personal content and code are all rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Third-party logos, images, and trademarks are property of their respective owners and are used for demonstration purposes only.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/Arctic1879" target="_blank" rel="noopener noreferrer" className="group">
            <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/noah-andersen-kiel-034585221/" target="_blank" rel="noopener noreferrer" className="group">
            <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="mailto:aknoah0@gmail.com" className="group">
            <Mail className="h-5 w-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

