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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
        <div className="relative z-10 text-center">
          <p className="text-lg text-[var(--accent-gold)]">Contenido del hero no disponible</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Círculos decorativos elegantes con gradientes */}
      {/* Esquina superior izquierda: círculo con gradiente */}
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] gradient-card rounded-full opacity-90 shadow-elegant-lg"></div>
      {/* Esquina inferior izquierda: círculo azul pequeño */}
      <div className="absolute top-50 left-10 w-[20px] h-[20px] gradient-accent rounded-full opacity-100"></div>
      {/* Centro derecha: círculo con gradiente */}
      <div className="absolute right-32 top-1/3 w-[150px] h-[150px] gradient-secondary rounded-full opacity-80 shadow-elegant"></div>
      {/* Esquina inferior derecha: círculo con gradiente */}
      <div className="absolute right-10 bottom-40 w-[50px] h-[50px] gradient-primary rounded-full opacity-100 shadow-elegant"></div>
      {/* Círculos pequeños extra con gradientes */}
      <div className="absolute left-1/4 top-1/4 w-[30px] h-[30px] gradient-accent rounded-full opacity-70"></div>
      <div className="absolute right-1/4 bottom-1/4 w-[25px] h-[25px] gradient-secondary rounded-full opacity-60"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-6">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 mb-10">
            {/* Badge con gradiente */}
            <div className="inline-flex items-center px-4 py-2 rounded-full gradient-navbar backdrop-blur-sm border border-[var(--primary-blue)]/30 shadow-lg">
              <Sparkles className="h-4 w-4 text-[var(--primary-blue)] mr-2 icon-elegant-accent" />
              <span className="font-medium text-[var(--primary-dark)] tracking-wide">{content.slogan}</span>
            </div>
            {/* Main heading con gradiente de texto */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl font-bold gradient-text leading-tight">
                {content.slogan}
              </h1>
              <p className="text-lg text-[var(--text-aux)] font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.mainDescription}
              </p>
            </div>
            {/* CTA Button con gradiente */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                className="btn-primary gradient-hover"
                onClick={() => navigate("/#products")}
              >
                <span>{content.buttonText}</span>
              </button>
            </div>
          </div>
          {/* Imágenes inclinadas con círculos decorativos y gradientes */}
          <div className="relative flex flex-row items-center justify-center min-h-[320px]">
            {/* Círculo decorativo grande detrás con gradiente */}
            <div className="absolute -top-10 -left-10 w-48 h-48 gradient-card rounded-full opacity-80 -z-10 shadow-elegant"></div>
            <div className="absolute top-24 left-32 w-16 h-16 gradient-accent rounded-full opacity-70 -z-10"></div>
            {/* Imagen 1 */}
            <img
              src={"/pe.jpg"}
              alt={content.heroImage?.alt || "Perfume elegante"}
              className="w-auto h-auto max-w-68 object-contain rounded-2xl shadow-elegant-lg rotate-[8deg] relative z-10 -mt-30 border-2 border-[var(--primary-blue)]/20"
            />
            {/* Imagen 2 (placeholder diferente) */}
            <img
              src="/pe.jpg"
              alt="Perfume 2"
              className="w-auto h-auto max-w-60 object-contain rounded-2xl shadow-elegant-lg rotate-[8deg] relative z-20 -ml-140 border-2 border-[var(--secondary-blue)]/20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
