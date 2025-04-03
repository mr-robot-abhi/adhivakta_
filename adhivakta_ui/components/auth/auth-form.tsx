"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { useRouter } from "next/navigation"
import { LoginFormData, RegisterFormData } from "@/lib/types/auth"

interface AuthFormProps {
  defaultTab?: "login" | "register"
  onSuccess?: () => void
}

export function AuthForm({ defaultTab = "login", onSuccess }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  })

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "lawyer",
    terms: false,
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginData((prev: LoginFormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData((prev: RegisterFormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAccountTypeChange = (value: "lawyer" | "client") => {
    setRegisterData((prev: RegisterFormData) => ({ 
      ...prev, 
      accountType: value 
    }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      toast({ title: "Login successful", description: "Welcome back!" })
      onSuccess?.() || router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!registerData.terms) {
      toast({
        title: "Accept Terms",
        description: "You must accept the terms to register",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await register(
        registerData.email, 
        registerData.password,
        {
          name: `${registerData.firstName} ${registerData.lastName}`,
          role: registerData.accountType
        }
      )
      toast({ title: "Registration successful", description: "Account created!" })
      onSuccess?.() || setActiveTab("login")
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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const token = await result.user.getIdToken()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
  
      if (!response.ok) throw new Error(await response.text())
      
      const { token: jwtToken, user } = await response.json()
      localStorage.setItem('jwtToken', jwtToken)
      
      toast({ title: "Login successful", description: `Welcome ${user.name}!` })
      router.push(user.role === 'lawyer' ? '/dashboard' : '/client-dashboard')
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "Authentication error",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value: string) => setActiveTab(value as "login" | "register")} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <div className="space-y-4 mb-6">
        <Button
          variant="outline"
          className="w-full gap-2 h-11"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image 
            src="/google-icon.svg" 
            alt="Google" 
            width={20} 
            height={20} 
          />
          Continue with Google
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
      </div>

      <AnimatePresence mode="wait">
        <TabsContent value="login" asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-sm"
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={loginData.remember}
                  onCheckedChange={(checked) => 
                    setLoginData((prev: LoginFormData) => ({ ...prev, remember: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full gap-2 h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        <TabsContent value="register" asChild>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    required
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    required
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  id="email-register"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Password</Label>
                <Input
                  id="password-register"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-type">Account type</Label>
                <Select
                  value={registerData.accountType}
                  onValueChange={handleAccountTypeChange}
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  name="terms"
                  required
                  checked={registerData.terms}
                  onCheckedChange={(checked) => 
                    setRegisterData((prev: RegisterFormData) => ({ ...prev, terms: checked as boolean }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the terms
                </Label>
              </div>
              <Button type="submit" className="w-full gap-2 h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  )
}