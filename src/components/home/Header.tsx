"use client"

import { ShoppingBag, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"

export default function Header() {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const navItems = [
    { name: "Inicio", action: () => navigate("/") },
    { name: "Fragancias", action: () => navigate("/#products") },
    { name: "Contacto", action: () => navigate("/#contact") },
  ]

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl shadow-sm bg-[var(--neutral-white)]/90">
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-1 flex items-center justify-start">
            <span className="font-serif text-2xl font-bold tracking-wide text-[var(--primary-dark)] select-none">DAISY PERFUMES</span>
          </div>
          {/* Navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-10">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="font-sans text-base font-semibold text-[var(--primary-dark)] px-4 py-2 focus:outline-none bg-transparent relative overflow-hidden group transition-colors"
                  >
                    <span className="relative z-10 group-hover:text-[var(--primary-dark)] transition-colors duration-300">
                      {item.name}
                    </span>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-[var(--primary-dark)] rounded-full transition-all duration-300"></div>
                    <div className="absolute inset-0 group-hover:bg-[var(--primary-dark)]/10 transition-all duration-300 rounded-md -z-10"></div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-[var(--primary-dark)] icon-elegant" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium bg-[var(--accent-gold)] shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <Link to="/admin" className="focus:outline-none">
              <Settings className="h-6 w-6 text-[var(--primary-dark)] hover:text-[var(--accent-gold)] transition-colors icon-elegant" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
