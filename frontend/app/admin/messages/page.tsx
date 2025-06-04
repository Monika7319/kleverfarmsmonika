"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, MessageCircle } from "lucide-react"
import { toast } from "react-toastify"
import MessageModal from "@/components/admin/message-modal"

// Mock messages data
const mockMessages = [
  {
    id: "msg-1",
    customer: {
      id: "cust-1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    subject: "Question about organic certification",
    message:
      "Hello, I'm interested in your organic apples but I'd like to know more about your certification process. Can you provide details about your organic farming practices?",
    date: "2023-04-10T14:30:00Z",
    status: "unread",
    category: "product",
  },
  {
    id: "msg-2",
    customer: {
      id: "cust-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    subject: "Delivery issue with my order #ORD-1002",
    message:
      "Hi, I placed an order yesterday (Order #ORD-1002) but I haven't received any shipping confirmation yet. Could you please check the status of my order?",
    date: "2023-04-09T10:15:00Z",
    status: "unread",
    category: "order",
  },
  {
    id: "msg-3",
    customer: {
      id: "cust-3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
    },
    subject: "Interested in selling my products on your platform",
    message:
      "Hello, I own a small honey farm and I'm interested in selling my products through your platform. Could you please provide information about the onboarding process for new farmers?",
    date: "2023-04-08T16:45:00Z",
    status: "read",
    category: "farm",
    replies: [
      {
        id: "reply-1",
        sender: "admin",
        message:
          "Hi Robert, thank you for your interest in joining our platform! I've sent you an email with detailed information about our onboarding process for new farmers. Please check your inbox.",
        date: "2023-04-08T17:30:00Z",
      },
    ],
  },
  {
    id: "msg-4",
    customer: {
      id: "cust-4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
    },
    subject: "Feedback on your website",
    message:
      "I just wanted to say that I love your new website design! It's much easier to navigate and find the products I'm looking for. Great job!",
    date: "2023-04-07T09:20:00Z",
    status: "read",
    category: "feedback",
    replies: [
      {
        id: "reply-2",
        sender: "admin",
        message:
          "Thank you for your kind feedback, Emily! We're glad to hear that you're enjoying our new website design. We're constantly working to improve the user experience.",
        date: "2023-04-07T11:45:00Z",
      },
    ],
  },
  {
    id: "msg-5",
    customer: {
      id: "cust-5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
    },
    subject: "Bulk order inquiry",
    message:
      "Hello, I represent a local restaurant and we're interested in placing bulk orders for fresh produce on a weekly basis. Do you offer any special pricing or delivery options for business customers?",
    date: "2023-04-06T13:10:00Z",
    status: "unread",
    category: "business",
  },
]

export default function MessagesManagement() {
  const [messages, setMessages] = useState(mockMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  // Get unique categories for filter
  const categories = Array.from(new Set(messages.map((msg) => msg.category)))

  // Filter messages based on search and filters
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? message.status === statusFilter : true
    const matchesCategory = categoryFilter ? message.category === categoryFilter : true

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleViewMessage = (message: any) => {
    // If message is unread, mark it as read
    if (message.status === "unread") {
      setMessages(messages.map((msg) => (msg.id === message.id ? { ...msg, status: "read" } : msg)))
    }
    setSelectedMessage(message)
    setIsModalOpen(true)
  }

  const handleSendReply = (messageId: string, replyText: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      sender: "admin",
      message: replyText,
      date: new Date().toISOString(),
    }

    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              replies: msg.replies ? [...msg.replies, newReply] : [newReply],
            }
          : msg,
      ),
    )

    toast.success("Reply sent successfully")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setCategoryFilter("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Messages</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm || statusFilter || categoryFilter) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={message.status === "unread" ? "border-l-4 border-l-blue-500" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{message.subject}</h3>
                      {message.status === "unread" && <Badge className="ml-2 bg-blue-500">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">
                      From: {message.customer.name} ({message.customer.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {formatDate(message.date)} • Category:{" "}
                      {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleViewMessage(message)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" /> {message.replies ? "View Conversation" : "Reply"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSendReply={handleSendReply}
        />
      )}
    </div>
  )
}
