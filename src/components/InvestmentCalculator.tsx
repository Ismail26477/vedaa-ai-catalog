"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Percent, Home } from "lucide-react"

interface CalculatorInput {
  propertyPrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
  rentalIncome?: number
  annualExpenses?: number
}

const InvestmentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInput>({
    propertyPrice: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTerm: 20,
    rentalIncome: 3000,
    annualExpenses: 6000,
  })

  const results = useMemo(() => {
    const principal = inputs.propertyPrice - inputs.downPayment
    const monthlyRate = inputs.interestRate / 100 / 12
    const numberOfPayments = inputs.loanTerm * 12

    // Monthly EMI calculation
    const monthlyEMI =
      principal *
      ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1))

    const totalLoanCost = monthlyEMI * numberOfPayments
    const totalInterest = totalLoanCost - principal

    // Rental income analysis
    const monthlyRental = inputs.rentalIncome || 0
    const monthlyExpenses = (inputs.annualExpenses || 0) / 12
    const monthlyProfit = monthlyRental - monthlyExpenses - monthlyEMI

    const yearlyRental = monthlyRental * 12
    const yearlyExpenses = inputs.annualExpenses || 0
    const yearlyProfit = yearlyRental - yearlyExpenses - monthlyEMI * 12

    const roi = inputs.propertyPrice > 0 ? (yearlyProfit / inputs.propertyPrice) * 100 : 0

    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalLoanCost: Math.round(totalLoanCost),
      totalInterest: Math.round(totalInterest),
      monthlyProfit: Math.round(monthlyProfit),
      yearlyProfit: Math.round(yearlyProfit),
      roi: roi.toFixed(2),
      loanAmount: Math.round(principal),
    }
  }, [inputs])

  const handleInputChange = (key: keyof CalculatorInput, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Investment Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>

          {[
            { label: "Property Price", key: "propertyPrice", icon: Home },
            { label: "Down Payment", key: "downPayment", icon: DollarSign },
            { label: "Interest Rate (%)", key: "interestRate", icon: Percent },
            { label: "Loan Term (Years)", key: "loanTerm", icon: null },
            { label: "Monthly Rental Income", key: "rentalIncome", icon: DollarSign },
            { label: "Annual Expenses", key: "annualExpenses", icon: DollarSign },
          ].map(({ label, key, icon: Icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />}
                <input
                  type="number"
                  value={inputs[key as keyof CalculatorInput]}
                  onChange={(e) => handleInputChange(key as keyof CalculatorInput, Number(e.target.value))}
                  className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Loan Amount", value: `₹${(results.loanAmount / 100000).toFixed(1)}L` },
              { label: "Monthly EMI", value: `₹${(results.monthlyEMI / 1000).toFixed(1)}K` },
              { label: "Total Interest", value: `₹${(results.totalInterest / 100000).toFixed(1)}L` },
              { label: "Monthly Profit", value: `₹${(results.monthlyProfit / 1000).toFixed(1)}K` },
              { label: "Yearly Profit", value: `₹${(results.yearlyProfit / 100000).toFixed(1)}L` },
              { label: "ROI", value: `${results.roi}%` },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/50 rounded-lg p-3 border border-border/50"
              >
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-bold text-primary">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Monthly Summary</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Rental Income:</span>
                <span className="float-right font-semibold text-emerald-500">
                  ₹{((inputs.rentalIncome || 0) / 1000).toFixed(1)}K
                </span>
              </p>
              <p className="text-sm border-t border-border/50 pt-1 mt-1">
                <span className="text-muted-foreground">Expenses & EMI:</span>
                <span className="float-right font-semibold text-red-500">
                  -₹{(((inputs.annualExpenses || 0) / 12 + results.monthlyEMI) / 1000).toFixed(1)}K
                </span>
              </p>
              <p className="text-sm border-t border-primary/50 pt-1 mt-1 font-bold">
                <span>Net Profit:</span>
                <span className={`float-right ${results.monthlyProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  ₹{(results.monthlyProfit / 1000).toFixed(1)}K
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentCalculator
