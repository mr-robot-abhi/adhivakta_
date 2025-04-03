"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider
} from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    accountType: "lawyer",
    termsAccepted: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms required",
        description: "You must accept the terms to register",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      
      // Call backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: await userCredential.user.getIdToken(),
          name: `${formData.firstName} ${formData.lastName}`,
          role: formData.accountType,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.accountType === 'lawyer' ? formData.specialization : undefined
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { token: jwtToken } = await response.json()
      localStorage.setItem('jwtToken', jwtToken)
      
      toast({
        title: "Registration successful",
        description: "Account created successfully!",
      })
      
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Account creation failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    try {
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new OAuthProvider('apple.com')
      
      const result = await signInWithPopup(auth, authProvider)
      const token = await result.user.getIdToken()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: result.user.displayName || '',
          email: result.user.email || '',
          role: 'lawyer'
        }),
      })

      if (!response.ok) throw new Error(await response.text())
      
      const { token: jwtToken } = await response.json()
      localStorage.setItem('jwtToken', jwtToken)
      
      toast({
        title: "Registration successful",
        description: "Account created via " + provider,
      })
      
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: `${provider} sign-up failed`,
        description: error.message || "Authentication error",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input 
            id="first-name" 
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input 
            id="last-name" 
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="name@example.com" 
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          required
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-type">Account type</Label>
        <Select 
          value={formData.accountType}
          onValueChange={(value) => setFormData(prev => ({
            ...prev,
            accountType: value
          }))}
          disabled={isLoading}
        >
          <SelectTrigger id="account-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lawyer">Lawyer</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.accountType === 'lawyer' && (
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input 
            id="specialization" 
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          name="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => setFormData(prev => ({
            ...prev,
            termsAccepted: !!checked
          }))}
          required
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the terms
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
          onClick={() => handleSocialSignUp('google')}
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
          onClick={() => handleSocialSignUp('apple')}
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