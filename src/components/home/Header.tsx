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
    { name: "Seguimiento", action: () => { setIsMenuOpen(false); navigate("/order-tracking") } },
    { name: "Contacto", action: () => { setIsMenuOpen(false); navigate("/#contact") } },
  ]

  return (
    <header className="z-50 transition-all duration-300 bg-transparent shadow-elegant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/icono_logo.png" 
                alt="Daisy Perfumes Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <img 
                src="/text_logo.png" 
                alt="Daisy Perfumes" 
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>
          {/* Navigation - Desktop */}
          <nav className="flex-1 justify-center hidden md:flex">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="font-sans text-sm font-normal uppercase tracking-widest text-black px-4 py-2 focus:outline-none bg-transparent relative overflow-hidden group transition-all duration-300"
                  >
                    <span className="relative z-10 transition-colors duration-300">
                      {item.name}
                    </span>
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-0 group-hover:w-full bg-black transition-all duration-300 ease-in-out"></span>
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
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium bg-black shadow-lg">
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
