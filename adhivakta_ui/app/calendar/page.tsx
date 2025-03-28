"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Smith vs. Johnson Hearing",
      date: new Date(2023, 5, 15),
      type: "legal",
      description: "Initial hearing before Judge Thompson",
    },
    {
      id: 2,
      title: "Client Meeting: Jane Doe",
      date: new Date(2023, 5, 18),
      type: "meeting",
      description: "Discuss case strategy and next steps",
    },
    {
      id: 3,
      title: "Filing Deadline: Motion to Dismiss",
      date: new Date(2023, 5, 22),
      type: "deadline",
      description: "Must file motion to dismiss by end of day",
    },
    {
      id: 4,
      title: "Deposition: Robert Johnson",
      date: new Date(2023, 5, 25),
      type: "legal",
      description: "Witness deposition at Smith & Partners office",
    },
    {
      id: 5,
      title: "Team Strategy Meeting",
      date: new Date(2023, 5, 28),
      type: "meeting",
      description: "Weekly team strategy meeting",
    },
  ]

  // Adjust events to current month/year
  const adjustedEvents = events.map((event) => {
    const newDate = new Date(event.date)
    newDate.setFullYear(currentMonth.getFullYear())
    newDate.setMonth(currentMonth.getMonth())
    return { ...event, date: newDate }
  })

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally add the event to your database
    setIsAddEventOpen(false)
    // Show success message or refresh calendar
  }

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names for header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return adjustedEvents.filter((event) => isSameDay(event.date, day))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new event on your calendar.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="Enter event title" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      defaultValue={selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input id="event-time" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <RadioGroup defaultValue="legal" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="legal" id="legal" />
                      <Label htmlFor="legal" className="cursor-pointer">
                        Legal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meeting" id="meeting" />
                      <Label htmlFor="meeting" className="cursor-pointer">
                        Meeting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deadline" id="deadline" />
                      <Label htmlFor="deadline" className="cursor-pointer">
                        Deadline
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea id="event-description" placeholder="Enter event details..." />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Event</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}

            {daysInMonth.map((day, i) => {
              const dayEvents = getEventsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
              const isTodayDate = isToday(day)

              return (
                <div
                  key={i}
                  className={`calendar-day ${!isCurrentMonth ? "opacity-40" : ""} ${
                    isTodayDate ? "calendar-day-current" : ""
                  } ${isSelected ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="calendar-day-header">{format(day, "d")}</div>
                  <div className="overflow-y-auto max-h-[80px]">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`calendar-event calendar-event-${event.type}`}
                        title={`${event.title}: ${event.description}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>{getEventsForDay(selectedDate).length} events scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getEventsForDay(selectedDate).length > 0 ? (
                getEventsForDay(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div
                      className={`w-2 h-full min-h-[2rem] rounded-full bg-${event.type === "legal" ? "primary" : event.type === "meeting" ? "blue-500" : "red-500"}`}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(event.date, "h:mm a")}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

