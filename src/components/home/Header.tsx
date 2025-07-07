"use client"

import { ShoppingBag } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"

export default function Header() {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const navItems = [
    { name: "Home", action: () => navigate("/") },
    { name: "Fragrances", action: () => navigate("/#products") },
    { name: "About", action: () => navigate("/#about") },
    { name: "Journal", action: () => navigate("/#journal") },
    { name: "Contact", action: () => navigate("/#contact") },
  ]

  return (
    <header className="bg-[#f7f3ee] border-b border-[#e5dfd6] sticky top-0 z-50 shadow-none">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-1 flex items-center justify-start">
            <span className="font-serif text-2xl font-light tracking-wide text-[#2d2a26] select-none">SCENTARIS</span>
          </div>
          {/* Navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-10">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="font-serif text-base font-light text-[#2d2a26] hover:text-black transition-colors px-2 py-1 focus:outline-none bg-transparent border-none"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            <button className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2d2a26" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-[#2d2a26]" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium bg-[#bfa77a] shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
