"use client"

import { useNavigate } from "react-router-dom"

interface HeroContent {
  mainDescription: string
  slogan: string
  buttonText: string
  buttonLink: string
  heroImage?: {
    url: string
    alt: string
    filename: string
  }
}

interface HeroSectionProps {
  content: HeroContent | undefined
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()

  // Validar que content existe
  if (!content) {
    return (
      <section className="bg-[#f7f3ee] min-h-[480px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#bfa77a]">Contenido del hero no disponible</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f7f3ee] py-20 lg:py-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
        {/* Texto */}
        <div className="flex-1 text-left">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-[#2d2a26] mb-8 leading-tight">Essence<br />of Elegance</h1>
          <button
            className="bg-[#2d2a26] text-white font-serif text-lg px-8 py-3 rounded shadow hover:bg-[#bfa77a] transition-colors"
            onClick={() => navigate("/#products")}
          >
            Explore Fragrances
          </button>
        </div>
        {/* Imagen */}
        <div className="flex-1 flex justify-center">
          <img
            src={content.heroImage?.url || "/perfume-placeholder.png"}
            alt={content.heroImage?.alt || "Perfume bottle"}
            className="w-64 h-80 object-contain rounded-lg shadow-lg border border-[#e5dfd6] bg-white"
          />
        </div>
      </div>
    </section>
  )
}
