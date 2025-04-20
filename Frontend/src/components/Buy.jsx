"use client"

import { useState } from "react"
import { Check, CreditCard, Wallet, Smartphone, Building } from "lucide-react"

export default function Buy() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    month: "1",
    year: new Date().getFullYear(),
    cvc: ""
  })
  const [upiDetails, setUpiDetails] = useState({ id: "" })
  const [netbankingDetails, setNetbankingDetails] = useState({ bank: "sbi" })
  const [walletDetails, setWalletDetails] = useState({ email: "" })

  const plans = {
    monthly: [
      {
        id: "basic",
        name: "Basic",
        description: "Essential features for individuals",
        price: "$9",
        features: ["5 projects", "Basic analytics", "24-hour support"],
      },
      {
        id: "pro",
        name: "Professional",
        description: "Everything you need for a growing business",
        price: "$19",
        features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "Advanced features for large organizations",
        price: "$49",
        features: [
          "Unlimited projects",
          "Advanced analytics",
          "24/7 dedicated support",
          "Custom domains",
          "SSO Authentication",
        ],
      },
    ],
    yearly: [
      {
        id: "basic",
        name: "Basic",
        description: "Essential features for individuals",
        price: "$90",
        features: ["5 projects", "Basic analytics", "24-hour support"],
      },
      {
        id: "pro",
        name: "Professional",
        description: "Everything you need for a growing business",
        price: "$190",
        features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "Advanced features for large organizations",
        price: "$490",
        features: [
          "Unlimited projects",
          "Advanced analytics",
          "24/7 dedicated support",
          "Custom domains",
          "SSO Authentication",
        ],
      },
    ],
  }

  const banks = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra Bank" }
  ]

  // Helper function to conditionally join class names
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }

  const handleCardInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.id]: e.target.value })
  }

  const handleUpiInputChange = (e) => {
    setUpiDetails({ ...upiDetails, [e.target.id]: e.target.value })
  }

  const handleNetbankingChange = (e) => {
    setNetbankingDetails({ ...netbankingDetails, [e.target.id]: e.target.value })
  }

  const handleWalletInputChange = (e) => {
    setWalletDetails({ ...walletDetails, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Here you would handle the form submission with the selected plan and payment details
    const paymentData = {
      plan: selectedPlan,
      billingCycle,
      paymentMethod,
      paymentDetails: 
        paymentMethod === "card" ? cardDetails :
        paymentMethod === "upi" ? upiDetails :
        paymentMethod === "netbanking" ? netbankingDetails :
        walletDetails
    }
    
    console.log("Payment data:", paymentData)
    alert("Processing payment for " + plans[billingCycle].find(p => p.id === selectedPlan).name + " plan")
  }

  return (
    <div className="container mx-auto mt-10 px-4 py-12">
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs and get started today.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-l-lg",
                billingCycle === "monthly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-r-lg",
                billingCycle === "yearly" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly (Save 15%)
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans[billingCycle].map((plan) => (
            <div 
              key={plan.id} 
              className={cn(
                "relative rounded-lg border p-6 transition-all duration-200 hover:shadow-md",
                selectedPlan === plan.id ? "border-blue-600 shadow-lg" : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.id === "pro" && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rotate-45">
                  <div className="bg-blue-600 text-white text-xs py-1 px-10 font-medium">Popular</div>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-baseline text-2xl font-bold">
                  {plan.price}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <div
                  className={cn(
                    "w-full h-12 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                    selectedPlan === plan.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 space-y-6">
          <h2 className="text-xl font-bold text-center">Payment Method</h2>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <input 
                type="radio" 
                name="paymentMethod" 
                id="card" 
                value="card" 
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="sr-only peer" 
              />
              <label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 peer-checked:border-blue-600 hover:bg-gray-50 cursor-pointer"
              >
                <CreditCard className="mb-2 h-6 w-6" />
                <span className="text-sm">Card</span>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                name="paymentMethod" 
                id="upi" 
                value="upi" 
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
                className="sr-only peer" 
              />
              <label
                htmlFor="upi"
                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 peer-checked:border-blue-600 hover:bg-gray-50 cursor-pointer"
              >
                <Smartphone className="mb-2 h-6 w-6" />
                <span className="text-sm">UPI</span>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                name="paymentMethod" 
                id="netbanking" 
                value="netbanking" 
                checked={paymentMethod === "netbanking"}
                onChange={() => setPaymentMethod("netbanking")}
                className="sr-only peer" 
              />
              <label
                htmlFor="netbanking"
                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 peer-checked:border-blue-600 hover:bg-gray-50 cursor-pointer"
              >
                <Building className="mb-2 h-6 w-6" />
                <span className="text-sm">Netbanking</span>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                name="paymentMethod" 
                id="wallet" 
                value="wallet" 
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                className="sr-only peer" 
              />
              <label
                htmlFor="wallet"
                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 peer-checked:border-blue-600 hover:bg-gray-50 cursor-pointer"
              >
                <Wallet className="mb-2 h-6 w-6" />
                <span className="text-sm">Wallet</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 overflow-hidden">
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Name on card</label>
                  <input
                    id="name"
                    value={cardDetails.name}
                    onChange={handleCardInputChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="number" className="text-sm font-medium">Card number</label>
                  <input
                    id="number"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="month" className="text-sm font-medium">Month</label>
                    <select
                      id="month"
                      value={cardDetails.month}
                      onChange={handleCardInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="year" className="text-sm font-medium">Year</label>
                    <select
                      id="year"
                      value={cardDetails.year}
                      onChange={handleCardInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="cvc" className="text-sm font-medium">CVC</label>
                    <input
                      id="cvc"
                      value={cardDetails.cvc}
                      onChange={handleCardInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="id" className="text-sm font-medium">UPI ID</label>
                  <input
                    id="id"
                    value={upiDetails.id}
                    onChange={handleUpiInputChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="username@upi"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enter your UPI ID to make a quick and secure payment.
                </p>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="bank" className="text-sm font-medium">Select Bank</label>
                  <select
                    id="bank"
                    value={netbankingDetails.bank}
                    onChange={handleNetbankingChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  >
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500">
                  You will be redirected to your bank's website to complete the payment.
                </p>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={walletDetails.email}
                    onChange={handleWalletInputChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  You will be redirected to complete the payment after clicking continue.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Complete Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}