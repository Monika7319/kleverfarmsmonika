"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageModalProps {
  message: any
  isOpen: boolean
  onClose: () => void
  onSendReply: (messageId: string, replyText: string) => void
}

export default function MessageModal({ message, isOpen, onClose, onSendReply }: MessageModalProps) {
  const [replyText, setReplyText] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(message.id, replyText)
      setReplyText("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{message.subject}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/abstract-geometric-shapes.png?height=40&width=40&query=${message.customer.name}`}
                alt={message.customer.name}
              />
              <AvatarFallback>{message.customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-semibold">{message.customer.name}</h3>
                <Badge className="ml-2 bg-gray-200 text-gray-800">{message.category}</Badge>
              </div>
              <p className="text-sm text-gray-500">{message.customer.email}</p>
              <p className="text-sm text-gray-500">{formatDate(message.date)}</p>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">{message.message}</p>
              </div>
            </div>
          </div>

          {message.replies && message.replies.length > 0 && (
            <div className="space-y-4 pl-14">
              {message.replies.map((reply: any) => (
                <div key={reply.id} className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/stylized-admin-panel.png" alt="Admin" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold">Admin</h3>
                      <Badge className="ml-2 bg-green-200 text-green-800">Staff</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(reply.date)}</p>
                    <div className="mt-2 p-4 bg-green-50 rounded-md">
                      <p className="text-gray-700">{reply.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3">Reply</h3>
            <Textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              className="mb-4"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendReply} disabled={!replyText.trim()} className="bg-green-600 hover:bg-green-700">
            Send Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
