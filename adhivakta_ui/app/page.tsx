"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, Shield, Scale, FileText, Users, Calendar } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, status } = useAuth()
  const router = useRouter()
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authType, setAuthType] = useState<"login" | "register">("login")

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  // If still loading or authenticated, show nothing (will redirect)
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Scale className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Scale,
      title: "Case Management",
      description:
        "Organize and track all your legal cases in one place with powerful filtering and search capabilities.",
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Securely store, organize, and share case documents with clients and team members.",
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Provide clients with secure access to their case information and documents.",
    },
    {
      icon: Calendar,
      title: "Calendar & Deadlines",
      description: "Never miss important court dates or filing deadlines with integrated calendar and reminders.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-level security and compliance with legal industry regulations to protect sensitive data.",
    },
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Assign and track tasks for team members to ensure nothing falls through the cracks.",
    },
  ]

  const testimonials = [
    {
      quote: "Adhivakta has transformed how our firm manages cases. The efficiency gains have been remarkable.",
      author: "Sarah Johnson",
      position: "Partner, Johnson & Associates",
    },
    {
      quote: "The client portal feature has significantly improved our client communication and satisfaction.",
      author: "Michael Chen",
      position: "Managing Partner, Chen Legal Group",
    },
    {
      quote: "Document management has never been easier. We've cut our paperwork time in half.",
      author: "Robert Williams",
      position: "Senior Attorney, Williams Law",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Scale className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold">Adhivakta</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setAuthType("login")
                setShowAuthForm(true)
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setAuthType("register")
                setShowAuthForm(true)
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAuthForm && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowAuthForm(false)}>
                      ✕
                    </Button>
                  </div>
                  <AuthForm defaultTab={authType} onSuccess={() => router.push("/dashboard")} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Modern Legal Case Management for the Digital Age
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Streamline your legal practice with our comprehensive case management solution. Manage cases,
                  documents, and client communications all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="font-medium"
                  onClick={() => {
                    setAuthType("register")
                    setShowAuthForm(true)
                  }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/scales-of-justice.png"
                alt="Legal Case Management"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features for Legal Professionals
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                Everything you need to manage your legal practice efficiently and effectively.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col items-start p-6 bg-background rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Designed for Legal Professionals</h2>
              <p className="text-muted-foreground md:text-xl">
                Our platform is built specifically for the unique needs of law firms and independent lawyers. From case
                management to document handling, we've got you covered.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Intuitive interface designed for legal workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Secure document storage and sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Client portal for transparent communication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Calendar integration for court dates and deadlines</span>
                </li>
              </ul>
              <div>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setAuthType("register")
                    setShowAuthForm(true)
                  }}
                >
                  Start Free Trial
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image src="/images/legal-workspace.png" alt="Legal Workspace" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Legal Professionals</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                See what our clients have to say about Adhivakta.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col p-6 bg-background rounded-lg shadow border"
              >
                <div className="flex-1">
                  <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Legal Practice?</h2>
            <p className="max-w-[600px] md:text-xl/relaxed">
              Join thousands of legal professionals who trust Adhivakta to manage their cases, documents, and client
              relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  setAuthType("register")
                  setShowAuthForm(true)
                }}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Scale className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Adhivakta</h1>
              </div>
              <p className="text-muted-foreground">
                Professional legal case management system for law firms and independent lawyers.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Adhivakta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

