import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Certificate } from "@/lib/types"

interface AddCertificateFormProps {
  onAddCertificate: (certificate: Certificate) => void
  editingCertificate: Certificate | null
}

export default function AddCertificateForm({ 
  onAddCertificate, 
  editingCertificate 
}: AddCertificateFormProps) {
  const [name, setName] = useState(editingCertificate?.name || "")
  const [issuer, setIssuer] = useState(editingCertificate?.issuer || "")
  const [date, setDate] = useState(editingCertificate?.date || "")
  const [url, setUrl] = useState(editingCertificate?.url || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format the date consistently
    const inputDate = new Date(date)
    const formattedDate = inputDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const certificate: Certificate = {
      name,
      issuer,
      date: formattedDate,
      url: url || undefined
    }

    onAddCertificate(certificate)
    
    // Reset form
    setName("")
    setIssuer("")
    setDate("")
    setUrl("")
  }

  return (
    <Card className="cyberpunk-glow">
      <CardHeader>
        <CardTitle>{editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}</CardTitle>
        <CardDescription>
          {editingCertificate 
            ? 'Edit your existing certificate'
            : 'Add a new certificate to your portfolio'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="certificate-name">Certificate Name</Label>
            <Input 
              id="certificate-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Google Data Analytics Professional Certificate" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="certificate-issuer">Issuing Organization</Label>
            <Input 
              id="certificate-issuer" 
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g., Coursera" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="certificate-date">Date Earned</Label>
            <Input 
              id="certificate-date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="certificate-url">Certificate URL (Optional)</Label>
            <Input 
              id="certificate-url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..." 
              type="url"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-none"
            >
              {editingCertificate ? 'Save Changes' : 'Add Certificate'}
            </Button>
            {editingCertificate && (
              <Button
                type="button"
                variant="outline"
                className="cyberpunk-border"
                onClick={() => {
                  setName("")
                  setIssuer("")
                  setDate("")
                  setUrl("")
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 