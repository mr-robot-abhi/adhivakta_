import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-slow">
        <Scale className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        The page you are looking for is currently under construction or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/">Return to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

