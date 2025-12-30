"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Mail, Phone, MapPin, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import LeadRequirementForm from "@/components/LeadRequirementForm"

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const Contact: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your server
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }, 3000)
  }

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "info@vedaai.com" },
    { icon: MapPin, label: "Address", value: "123 Luxury Complex, Mumbai, India" },
    { icon: Clock, label: "Hours", value: "Mon-Sun, 9 AM - 6 PM" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-semibold text-foreground">Contact & Requirements</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-6xl mx-auto py-8 space-y-12">
        <section>
          <LeadRequirementForm />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="inquiry">Property Inquiry</option>
                  <option value="booking">Booking</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {submitted ? "Message Sent!" : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:bg-card/80 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 h-48 bg-secondary rounded-lg border border-border flex items-center justify-center">
              <p className="text-muted-foreground">Map Location</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
