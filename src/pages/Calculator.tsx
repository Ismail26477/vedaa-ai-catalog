"use client"

import type React from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import InvestmentCalculator from "@/components/InvestmentCalculator"

const Calculator: React.FC = () => {
  const navigate = useNavigate()

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
          <h1 className="text-xl font-display font-semibold text-foreground">Investment Calculator</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        <InvestmentCalculator />
      </div>
    </div>
  )
}

export default Calculator
