"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Users, BookOpen, Send, User } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface Message {
  id: string
  content: string
  created_at: string
  sender: {
    id: string
    name: string
    email: string
    role: string
  }
  recipient: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Student {
  id: string
  name: string
  email: string
  matric_number: string
}

interface AdvisorDashboardProps {
  user: UserType
}

export function AdvisorDashboard({ user }: AdvisorDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
    fetchStudents()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/advisor/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
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
        fetchMessages()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Advisor {user.name}</h1>
            <p className="mt-2 text-gray-600">Manage your student advisement activities</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(messagesByStudent).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Message Section */}
          <Card>
            <CardHeader>
              <CardTitle>Send Message to Student</CardTitle>
              <CardDescription>Send a message to any student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.matric_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={sendMessage} disabled={isLoading} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Your latest conversations with students</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No messages yet</p>
                ) : (
                  <div className="space-y-4">
                    {messages.slice(0, 10).map((message) => {
                      const isFromMe = message.sender.id === user.id
                      const otherUser = isFromMe ? message.recipient : message.sender

                      return (
                        <div key={message.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">
                                {isFromMe ? `To: ${otherUser.name}` : `From: ${otherUser.name}`}
                              </span>
                              <Badge variant={isFromMe ? "default" : "secondary"}>
                                {isFromMe ? "Sent" : "Received"}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Student Conversations */}
        {Object.keys(messagesByStudent).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Student Conversations</CardTitle>
              <CardDescription>Message history organized by student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(messagesByStudent).map(([studentId, studentMessages]) => {
                  const student =
                    studentMessages[0].sender.id === studentId
                      ? studentMessages[0].sender
                      : studentMessages[0].recipient

                  return (
                    <div key={studentId} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Conversation with {student.name}</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {studentMessages.slice(0, 5).map((message) => (
                          <div
                            key={message.id}
                            className={`p-2 rounded text-sm ${
                              message.sender.id === user.id ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
                            }`}
                          >
                            <p>{message.content}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
