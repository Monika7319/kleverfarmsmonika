"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageSquare } from "lucide-react"

export default function HelpCenter() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([0])

  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter((i) => i !== index))
    } else {
      setOpenFaqs([...openFaqs, index])
    }
  }

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information to complete your purchase.",
    },
    {
      question: "What are the delivery options and timeframes?",
      answer:
        "We offer standard delivery (2-3 business days) and express delivery (1 business day) options. Delivery timeframes may vary based on your location and product availability. You can select your preferred delivery option during checkout.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your order on our website or through our mobile app. Simply go to 'My Orders' in your account and select the order you want to track.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 7 days of delivery for most products. Items must be unused and in their original packaging. For perishable goods, please contact our customer service within 24 hours of delivery if you're not satisfied with the quality.",
    },
    {
      question: "How do I cancel my order?",
      answer:
        "You can cancel your order before it's shipped. Go to 'My Orders' in your account, select the order you want to cancel, and click on 'Cancel Order'. If your order has already been shipped, you'll need to return it once received.",
    },
    {
      question: "Are all products organic?",
      answer:
        "Not all products are organic, but we clearly label which products are certified organic. We work with farms that follow sustainable and ethical farming practices, and we provide detailed information about each farm's methods on their profile page.",
    },
    {
      question: "How do I become a seller on KleverFarms?",
      answer:
        "To become a seller, click on 'List Your Farm' on our homepage and complete the registration process. You'll need to provide information about your farm, products, and farming practices. Our team will review your application and get back to you within 3-5 business days.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, UPI payments, and cash on delivery (for orders under ₹10,000). All online payments are processed securely through our payment partners.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">KleverFarms</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Help Center</h1>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">How can we help you today?</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search for help topics..." className="pl-10" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Order Status
              </Button>
              <Button variant="outline" size="sm">
                Returns
              </Button>
              <Button variant="outline" size="sm">
                Payment Issues
              </Button>
              <Button variant="outline" size="sm">
                Delivery
              </Button>
              <Button variant="outline" size="sm">
                Product Quality
              </Button>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full p-4 text-left font-medium bg-gray-50 hover:bg-gray-100"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    {openFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaqs.includes(index) && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">Our customer support team is here to assist you.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 text-center hover:border-green-500 hover:shadow-md transition-all">
                <Phone className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-3">Available 9 AM - 6 PM</p>
                <p className="font-medium text-green-600">+1 (555) 123-4567</p>
              </div>

              <div className="border rounded-lg p-6 text-center hover:border-green-500 hover:shadow-md transition-all">
                <Mail className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-3">We'll respond within 24 hours</p>
                <p className="font-medium text-green-600">support@kleverfarms.com</p>
              </div>

              <div className="border rounded-lg p-6 text-center hover:border-green-500 hover:shadow-md transition-all">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-3">Chat with our support team</p>
                <Button className="bg-green-600 hover:bg-green-700">Start Chat</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} KleverFarms. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              Home
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white mx-2">
              About Us
            </Link>
            <Link href="/farms" className="text-gray-400 hover:text-white mx-2">
              Partner Farms
            </Link>
            <Link href="/help" className="text-gray-400 hover:text-white mx-2">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
