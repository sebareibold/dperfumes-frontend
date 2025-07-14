"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

interface CartItem {
  id: string
  nombre: string
  volumen: {
    ml: string
    precio: number
  }
  tipo: "vidrio" | "plastico"
  imagen: string
  cantidad: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "cantidad">, cantidad?: number) => void
  removeFromCart: (id: string, volumen: { ml: string; precio: number }, tipo: string) => void
  updateQuantity: (id: string, cantidad: number, volumen: { ml: string; precio: number }, tipo: string) => void
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Omit<CartItem, "cantidad">, cantidad = 1) => {
    const itemKey = `${product.id}-${product.volumen.ml}-${product.volumen.precio}-${product.tipo}`
    const existingItem = items.find((item) => 
      `${item.id}-${item.volumen.ml}-${item.volumen.precio}-${item.tipo}` === itemKey
    )

    if (existingItem) {
      updateQuantity(product.id, existingItem.cantidad + cantidad, product.volumen, product.tipo)
    } else {
      setItems([...items, { ...product, cantidad }])
    }
  }

  const removeFromCart = (id: string, volumen: { ml: string; precio: number }, tipo: string) => {
    const itemKey = `${id}-${volumen.ml}-${volumen.precio}-${tipo}`
    setItems(items.filter((item) => 
      `${item.id}-${item.volumen.ml}-${item.volumen.precio}-${item.tipo}` !== itemKey
    ))
  }

  const updateQuantity = (id: string, cantidad: number, volumen: { ml: string; precio: number }, tipo: string) => {
    if (cantidad <= 0) {
      removeFromCart(id, volumen, tipo)
      return
    }

    const itemKey = `${id}-${volumen.ml}-${volumen.precio}-${tipo}`
    setItems(
      items.map((item) =>
        `${item.id}-${item.volumen.ml}-${item.volumen.precio}-${item.tipo}` === itemKey 
          ? { ...item, cantidad: cantidad } 
          : item,
      ),
    )
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.volumen.precio * item.cantidad), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0)
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

