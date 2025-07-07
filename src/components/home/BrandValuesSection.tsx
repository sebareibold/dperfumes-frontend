"use client"

import { Award, Sparkles } from "lucide-react"
import type React from "react"

interface ValueContent {
  icon: string
  title: string
  description: string
}

interface BrandValuesSectionProps {
  content:
    | {
        mainTitle: string
        description: string
        values: ValueContent[]
      }
    | undefined
}

// Icon mapping for brand values
const iconMap: { [key: string]: React.ElementType } = {
  Award: Award,
  Sparkles: Sparkles,
  // Add more icons as needed
}

export default function BrandValuesSection({ content }: BrandValuesSectionProps) {
  if (!content || !content.values) {
    return (
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-[var(--accent-gold)]">Contenido de valores de marca no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 opacity-10">
        <div className="w-32 h-32 rounded-full bg-[var(--primary-dark)] blur-3xl"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <div className="w-40 h-40 rounded-full bg-[#2d2a26] blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--neutral-white)] border border-[var(--accent-gold)] shadow-lg mb-6">
            <Award className="h-4 w-4 text-[var(--accent-gold)] mr-2" />
            <span className="text-sm font-medium text-[var(--primary-dark)] tracking-wide">Por qué elegir Daisy</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[var(--primary-dark)] mb-6 leading-tight">
            {content.mainTitle.split(" ")[0]}{" "}
            <span className="text-[var(--accent-gold)] italic">{content.mainTitle.split(" ").slice(1).join(" ")}</span>
          </h2>

          <p className="text-lg md:text-xl text-[#2d2a26]/70 font-light leading-relaxed max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.values.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Award
            return (
              <div
                key={value.title}
                className="group p-8 bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary-dark-alt)] rounded-3xl border border-[var(--accent-gold)]/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#bfa77a] to-[#2d2a26] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-4 text-[#2d2a26] group-hover:text-[#bfa77a] transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-[#2d2a26]/70 font-light leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
