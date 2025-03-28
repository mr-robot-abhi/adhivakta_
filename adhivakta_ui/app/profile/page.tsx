import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Mail, MapPin, Phone } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground mb-4">Senior Attorney</p>

            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">john.doe@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">New York, NY</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Johnson & Associates</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View and update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Doe" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="john.doe@example.com" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Legal Street, New York, NY 10001" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    readOnly
                    defaultValue="Attorney specializing in corporate law with over 10 years of experience. Graduated from Harvard Law School and previously worked at several prestigious law firms."
                  />
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firm">Law Firm</Label>
                    <Input id="firm" defaultValue="Johnson & Associates" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue="Senior Attorney" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bar-number">Bar Number</Label>
                    <Input id="bar-number" defaultValue="NY12345678" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practice-areas">Practice Areas</Label>
                    <Input id="practice-areas" defaultValue="Corporate Law, Mergers & Acquisitions" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" defaultValue="Harvard Law School, J.D., 2010" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    readOnly
                    defaultValue="- Senior Attorney, Johnson & Associates (2015-Present)
- Associate, Smith & Partners (2010-2015)"
                  />
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-rate">Hourly Rate</Label>
                  <Input id="billing-rate" defaultValue="$350.00" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-method">Billing Method</Label>
                  <Input id="billing-method" defaultValue="Hourly" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-info">Payment Information</Label>
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="w-10 h-6 bg-muted rounded mr-2"></div>
                    <span>•••• •••• •••• 4242</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-address">Billing Address</Label>
                  <Input id="billing-address" defaultValue="123 Legal Street, New York, NY 10001" readOnly />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Edit Profile</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Your recent activity and statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Active Cases</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Documents</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-3xl font-bold">38</p>
              <p className="text-sm text-muted-foreground">Clients</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Pending Hearings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

