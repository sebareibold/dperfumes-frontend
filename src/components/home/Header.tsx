"use client"

import { ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"

export default function Header() {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Inicio", action: () => { setIsMenuOpen(false); navigate("/") } },
    { name: "Fragancias", action: () => { setIsMenuOpen(false); navigate("/#products") } },
    { name: "Contacto", action: () => { setIsMenuOpen(false); navigate("/#contact") } },
  ]

  return (
    <header className="z-50 transition-all duration-300 bg-transparent shadow-elegant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-1 flex items-center justify-start">
            <span className="text-2xl font-black tracking-widest gradient-text select-none bg-transparent" style={{ fontFamily: 'Public Sans, sans-serif' }}>Daisy Perfumes</span>
          </div>
          {/* Navigation - Desktop */}
          <nav className="flex-1 justify-center hidden md:flex">
            <ul className="flex space-x-10">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="font-sans text-base font-semibold text-[var(--primary-dark)] px-6 py-3 focus:outline-none bg-transparent relative overflow-hidden group transition-all duration-500"
                  >
                    <span className="relative z-10 group-hover:text-[var(--primary-blue)] transition-colors duration-500">
                      {item.name}
                    </span>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--secondary-blue)] rounded-full transition-all duration-500 ease-out"></div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full group-hover:bg-gradient-to-r from-[var(--primary-blue)]/10 to-[var(--secondary-blue)]/10 transition-all duration-300">
                <ShoppingBag className="h-6 w-6 text-[var(--primary-dark)] group-hover:text-[var(--primary-blue)] icon-elegant transition-colors duration-300" />
              </div>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium badge-gradient shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {/* Burger menu - Mobile only */}
            <button className="md:hidden ml-2 p-2 rounded-full hover:bg-gradient-to-r from-[var(--primary-blue)]/10 to-[var(--secondary-blue)]/10 transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-7 w-7 text-[var(--primary-dark)]" />
              ) : (
                <Menu className="h-7 w-7 text-[var(--primary-dark)]" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-transparent border-t border-[var(--primary-blue)]/20 py-4 shadow-elegant">
            <nav>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={item.action}
                      className="font-sans text-base font-semibold text-[var(--primary-dark)] px-4 py-2 w-full text-left hover:bg-gradient-to-r from-[var(--primary-blue)]/10 to-[var(--secondary-blue)]/10 transition-all duration-300 rounded-md"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
