"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Education", path: "/education" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Updates", path: "/updates" },
  { name: "Contact", path: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [keySequence, setKeySequence] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [password, setPassword] = useState("")
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ""
  const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_CODE || ""

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = keySequence + event.key
      setKeySequence(newSequence)

      // Check if the sequence contains the admin code
      if (newSequence.includes(ADMIN_CODE)) {
        setShowPasswordDialog(true)
        setKeySequence("")
      }

      // Reset sequence after 1 second of no input
      setTimeout(() => setKeySequence(""), 1000)
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [keySequence])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAdminUnlocked(true)
      setShowPasswordDialog(false)
      localStorage.setItem("adminUnlocked", "true")
    } else {
      alert("Incorrect password")
    }
    setPassword("")
  }

  // Check localStorage on component mount
  useEffect(() => {
    const isUnlocked = localStorage.getItem("adminUnlocked") === "true"
    setAdminUnlocked(isUnlocked)

    // Listen for admin logout event
    const handleAdminLogout = () => {
      setAdminUnlocked(false)
    }

    window.addEventListener("adminLogout", handleAdminLogout)
    return () => window.removeEventListener("adminLogout", handleAdminLogout)
  }, [])

  const allNavItems = [
    ...navItems,
    ...(adminUnlocked ? [{ name: "Admin", path: "/admin" }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold gradient-text">Noah Andersen-Kiel</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:gap-6">
          {allNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                pathname === item.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary via-accent to-pink-500 transition-all duration-300 group-hover:w-full",
                  pathname === item.path ? "w-full" : "w-0",
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            {allNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Admin Authentication</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Enter Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

