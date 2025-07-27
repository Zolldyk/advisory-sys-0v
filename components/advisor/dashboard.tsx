"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Users, Send, LogOut, User, Clock, BookOpen } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface Student {
  id: string
  name: string
  email: string
  matric_number: string
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
    email: string
    role: string
    matric_number?: string
  }
  recipient: {
    id: string
    name: string
    email: string
    role: string
    matric_number?: string
  }
}

interface AdvisorDashboardProps {
  user: UserType
  students: Student[]
  messages: Message[]
}

export function AdvisorDashboard({ user, students, messages }: AdvisorDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  const sendMessage = async () => {
    if (!selectedStudent || !newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please select a student and enter a message",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/advisor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: selectedStudent,
          content: newMessage.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        })
        setNewMessage("")
        setSelectedStudent("")
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Group messages by student
  const getMessagesByStudent = () => {
    const grouped: { [key: string]: Message[] } = {}
    messages.forEach((message) => {
      const otherUser = message.sender.id === user.id ? message.recipient : message.sender
      if (otherUser.role === "student") {
        if (!grouped[otherUser.id]) {
          grouped[otherUser.id] = []
        }
        grouped[otherUser.id].push(message)
      }
    })
    return grouped
  }

  const messagesByStudent = getMessagesByStudent()
  const totalStudents = students.length
  const activeConversations = Object.keys(messagesByStudent).length
  const totalMessages = messages.length
  const unreadMessages = messages.filter((msg) => msg.sender.role === "student" && msg.recipient.id === user.id).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advisor Dashboard</h1>
              <p className="text-gray-600">Welcome Advisor, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Assigned</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Under your advisement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConversations}</div>
              <p className="text-xs text-muted-foreground">Students messaging you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">All conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Responses</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages}</div>
              <p className="text-xs text-muted-foreground">Awaiting your response</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="send">Send Message</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Student Messages</CardTitle>
                <CardDescription>View and respond to messages from your students</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {Object.keys(messagesByStudent).length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Students will be able to send you messages for academic guidance
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(messagesByStudent).map(([studentId, studentMessages]) => {
                        const student = students.find((s) => s.id === studentId)
                        const studentInfo =
                          studentMessages[0].sender.id === studentId
                            ? studentMessages[0].sender
                            : studentMessages[0].recipient

                        return (
                          <div key={studentId} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{studentInfo.name}</h4>
                                  <p className="text-sm text-gray-500">{studentInfo.matric_number}</p>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {studentMessages.length} message{studentMessages.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {studentMessages.map((message) => {
                                const isFromAdvisor = message.sender.id === user.id

                                return (
                                  <div
                                    key={message.id}
                                    className={`flex ${isFromAdvisor ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-xs px-4 py-2 rounded-lg ${
                                        isFromAdvisor ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                                      }`}
                                    >
                                      <p className="text-sm">{message.content}</p>
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
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>Students under your academic advisement</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {students.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No students assigned yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {students.map((student) => {
                        const totalCredits = student.registrations.reduce((sum, reg) => sum + reg.courses.credits, 0)
                        const hasMessages = messagesByStudent[student.id]?.length > 0

                        return (
                          <div key={student.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                  <User className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                  <p className="text-sm text-gray-600">{student.matric_number}</p>
                                  <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{totalCredits} credits</Badge>
                                {hasMessages && (
                                  <Badge variant="outline" className="ml-2">
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    Active chat
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {student.registrations.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-2 flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Enrolled Courses:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {student.registrations.map((reg, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {reg.courses.code} - {reg.courses.credits}cr
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-gray-500">
                                Student since: {new Date(student.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>Send Message to Student</CardTitle>
                <CardDescription>Send academic guidance or respond to student inquiries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student to message" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex items-center space-x-2">
                            <span>{student.name}</span>
                            <span className="text-gray-500">({student.matric_number})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Type your message here... (e.g., course recommendations, academic guidance, meeting reminders)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{newMessage.length}/500 characters</p>
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !selectedStudent || !newMessage.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>

                {selectedStudent && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> As an advisor, you can provide guidance on course selection, academic
                      planning, career advice, and answer any questions your students may have.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
