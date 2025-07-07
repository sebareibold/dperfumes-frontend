"use client"

import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"

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

  if (!content) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[var(--background-main)]"></div>
        <div className="relative z-10 text-center">
          <p className="text-lg text-[var(--accent-gold)]">Contenido del hero no disponible</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background-main)]">
      {/* Círculos decorativos elegantes estilo referencia, máxima visibilidad */}
      {/* Esquina superior izquierda: círculo blanco grande */}
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-[var(--neutral-white)] rounded-full opacity-100"></div>
      {/* Esquina inferior izquierda: círculo azul grande */}
      <div className="absolute top-50 left-10 w-[20px] h-[20px] bg-[var(--primary-dark)] rounded-full opacity-100 "></div>
      {/* Centro derecha: círculo blanco mediano */}
      <div className="absolute right-32 top-1/3 w-[150px] h-[150px] bg-[var(--neutral-white)] rounded-full opacity-90"></div>
      {/* Esquina inferior derecha: círculo azul mediano */}
      <div className="absolute right-10 bottom-40 w-[50px] h-[50px] bg-[var(--primary-dark)] rounded-full opacity-100 "></div>
      {/* Círculos pequeños extra */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-6">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 mb-10">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--neutral-white)]/80 backdrop-blur-sm border border-[var(--primary-dark)] shadow-lg text-xs">
              <Sparkles className="h-3 w-3 text-[var(--primary-dark)] mr-2 icon-elegant" />
              <span className="font-medium text-[var(--primary-dark)] tracking-wide">{content.slogan}</span>
            </div>
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl font-bold text-[var(--primary-dark)] leading-tight">
                {content.slogan}
              </h1>
              <p className="text-lg text-[var(--text-aux)] font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.mainDescription}
              </p>
            </div>
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                className="border-2 border-[var(--primary-dark)] text-[var(--primary-dark)] bg-transparent px-8 py-3 rounded-[var(--radius-btn)] font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[var(--primary-dark)] hover:text-[var(--neutral-white)] shadow-none"
                onClick={() => navigate("/#products")}
              >
                <span>{content.buttonText}</span>
              </button>
            </div>
          </div>
          {/* Imágenes inclinadas con círculos decorativos */}
          <div className="relative flex flex-row items-center justify-center min-h-[320px]">
            {/* Círculo decorativo grande detrás */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[var(--neutral-white)] rounded-full opacity-80 -z-10"></div>
            <div className="absolute top-24 left-32 w-16 h-16 bg-[var(--accent-coral)] rounded-full opacity-70 -z-10"></div>
            {/* Imagen 1 */}
            <img
              src={"/pe.jpg"}
              alt={content.heroImage?.alt || "Perfume elegante"}
              className="w-auto h-auto max-w-68 object-contain rounded-2xl shadow-elegant rotate-[8deg] relative z-10 -mt-30"
            />
            {/* Imagen 2 (placeholder diferente) */}
            <img
              src="/pe.jpg"
              alt="Perfume 2"
              className="w-auto h-auto max-w-60 object-contain rounded-2xl shadow-elegant rotate-[8deg] relative z-20 -ml-140 "
            />
          </div>
        </div>
      </div>
    </section>
  )
}
