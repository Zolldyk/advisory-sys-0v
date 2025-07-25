"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User } from "@/lib/auth"
import { Users, MessageSquare, LogOut, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: string
  matric_number: string
  name: string
  email: string
  created_at: string
  registrations: Array<{
    courses: {
      code: string
      title: string
      credits: number
    }
  }>
}

interface Message {
  id: string
  content: string
  created_at: string
  sender: {
    id: string
    name: string
    matric_number?: string
    role: string
  }
  recipient: {
    id: string
    name: string
    role: string
  }
}

interface AdvisorDashboardProps {
  user: User
  students: Student[]
  messages: Message[]
}

export function AdvisorDashboard({ user, students, messages }: AdvisorDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [isSending, setIsSending] = useState(false)

  const totalStudents = students.length
  const totalMessages = messages.length

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedStudent) {
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/advisor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage.trim(),
          recipientId: selectedStudent,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        setSelectedStudent("")
        toast({
          title: "Message sent",
          description: "Your message has been sent to the student.",
        })
        router.refresh()
      } else {
        toast({
          title: "Failed to send message",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Group messages by student
  const messagesByStudent = messages.reduce(
    (acc, message) => {
      const studentId = message.sender.role === "student" ? message.sender.id : message.recipient.id
      if (!acc[studentId]) {
        acc[studentId] = []
      }
      acc[studentId].push(message)
      return acc
    },
    {} as Record<string, Message[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advisor Dashboard</h1>
              <p className="text-gray-600">Welcome advisor, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Under Advisement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">Total conversations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>View and manage student registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => {
                      const totalCredits = student.registrations.reduce((sum, reg) => sum + reg.courses.credits, 0)

                      return (
                        <div key={student.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{student.name}</h3>
                              <p className="text-sm text-gray-600">{student.matric_number}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                            <Badge variant="secondary">{totalCredits} credits</Badge>
                          </div>

                          {student.registrations.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Registered Courses:</p>
                              <div className="flex flex-wrap gap-2">
                                {student.registrations.map((reg, index) => (
                                  <Badge key={index} variant="outline">
                                    {reg.courses.code}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message History */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>Conversations with students</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    {Object.keys(messagesByStudent).length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(messagesByStudent).map(([studentId, studentMessages]) => {
                          const student = students.find((s) => s.id === studentId)
                          if (!student) return null

                          return (
                            <div key={studentId} className="border rounded-lg p-4">
                              <h4 className="font-medium mb-3">
                                {student.name} ({student.matric_number})
                              </h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {studentMessages.map((message) => {
                                  const isFromAdvisor = message.sender.id === user.id

                                  return (
                                    <div
                                      key={message.id}
                                      className={`flex ${isFromAdvisor ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                          isFromAdvisor ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                                        }`}
                                      >
                                        <p>{message.content}</p>
                                        <p
                                          className={`text-xs mt-1 ${isFromAdvisor ? "text-blue-100" : "text-gray-500"}`}
                                        >
                                          {new Date(message.created_at).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Send Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>Send a message to a student</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label htmlFor="student" className="block text-sm font-medium mb-2">
                        Select Student
                      </label>
                      <select
                        id="student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Choose a student...</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} ({student.matric_number})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSending || !newMessage.trim() || !selectedStudent}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
