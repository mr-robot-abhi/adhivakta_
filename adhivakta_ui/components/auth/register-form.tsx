"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  OAuthProvider,
  AuthError 
} from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/ui/icons"

export function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("lawyer")
  const [phone, setPhone] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!termsAccepted) {
      setError("You must accept the terms and conditions")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Call backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: await userCredential.user.getIdToken(),
          name: `${firstName} ${lastName}`,
          role: accountType,
          email,
          phone,
          specialization: accountType === 'lawyer' ? specialization : undefined
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save user data')
      }

      router.push("/dashboard")
    } catch (err) {
      const error = err as AuthError | Error
      setError(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: await userCredential.user.getIdToken(),
          name: userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          role: 'lawyer'
        }),
      })

      if (!response.ok) throw new Error('Failed to save user data')
      router.push("/dashboard")
    } catch (err) {
      const error = err as AuthError | Error
      setError(error.message || "Failed to sign up with Google")
    }
  }

  const handleAppleSignUp = async () => {
    try {
      const provider = new OAuthProvider('apple.com')
      const userCredential = await signInWithPopup(auth, provider)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: await userCredential.user.getIdToken(),
          name: userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          role: 'lawyer'
        }),
      })

      if (!response.ok) throw new Error('Failed to save user data')
      router.push("/dashboard")
    } catch (err) {
      const error = err as AuthError | Error
      setError(error.message || "Failed to sign up with Apple")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input 
            id="first-name" 
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input 
            id="last-name" 
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-type">Account type</Label>
        <Select 
          value={accountType}
          onValueChange={(value) => setAccountType(value)}
        >
          <SelectTrigger id="account-type">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lawyer">Lawyer</SelectItem>
            <SelectItem value="paralegal">Paralegal</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {accountType === 'lawyer' && (
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input 
            id="specialization" 
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(!!checked)}
          required
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the terms of service and privacy policy
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : "Create account"}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAppleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.apple className="mr-2 h-4 w-4" />
          )}
          Apple
        </Button>
      </div>
    </form>
  )
}