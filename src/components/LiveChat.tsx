"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react"
import { useApp } from "@/context/AppContext"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: Date
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! How can we help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { properties } = useApp()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate support response
    setTimeout(() => {
      const supportResponses = [
        "That's a great question! Let me help you with that.",
        `We have ${properties.length} properties available. Would you like me to help you find the perfect one?`,
        "Our team is here to assist you. Is there anything specific you're looking for?",
        "Thank you for your interest! I'll connect you with our sales team shortly.",
        "Would you like to schedule a property visit? I can help you with that!",
      ]
      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)]

      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, supportMessage])
    }, 500)
  }

  return (
    <>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-4 w-80 sm:w-96 h-96 sm:h-[500px] bg-card border border-border rounded-2xl shadow-lg z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-semibold">Live Chat Support</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-primary/80 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary/80 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-4 bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Minimized State */}
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-4 bg-card border border-border rounded-xl shadow-lg p-4 cursor-pointer hover:bg-card/80 transition-colors z-40 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Chat Support</span>
            <Maximize2 className="w-4 h-4 ml-2 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className="floating-button bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </>
  )
}

export default LiveChat
