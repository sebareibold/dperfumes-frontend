"use client"

import type React from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  X,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Sparkles,
  Star,
} from "lucide-react"
import { useState } from "react"
import { apiService } from "../../services/api"

interface ContactContent {
  mainTitle: string
  subtitle: string
  description: string
  formTitle: string
  formDescription: string
  responseMessage: string
  responseDisclaimer: string
  contactInfo: {
    icon: string
    title: string
    details: string[]
    description?: string
  }[]
  socialMedia: {
    icon: string
    name: string
    handle: string
    link: string
  }[]
}

interface ContactSectionProps {
  content: ContactContent | undefined
}

const iconMap: { [key: string]: React.ElementType } = {
  Mail: Mail,
  Phone: Phone,
  MapPin: MapPin,
  Clock: Clock,
  Instagram: Instagram,
  Facebook: Facebook,
  X: X,
  Youtube: Youtube,
  Linkedin: Linkedin,
  Github: Github,
  Globe: Globe,
}

export default function ContactSection({ content }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  if (!content) {
    return (
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-[var(--accent-gold)]">Contenido de contacto no disponible</p>
          </div>
        </div>
      </section>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Todos los campos marcados con * son obligatorios")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await apiService.sendContactForm(formData)

      if (response.success) {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setSuccessMessage(content.responseMessage)
      } else {
        throw new Error(response.error || "Error enviando el mensaje")
      }
    } catch (error) {
      console.error("Error sending contact form:", error)
      setError("Error enviando el mensaje. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSuccessMessage(""), 5000)
    }
  }

  return (
    <section className="py-20 lg:py-32 bg-transparent flex justify-center items-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-elegant overflow-hidden flex flex-col md:flex-row items-center justify-center min-h-[420px]">
        {/* Tarjeta de información de contacto tipo squircle */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full">
          <div className="bg-[var(--primary-dark)] rounded-[32px] p-10 flex flex-col justify-between items-start w-[90%] h-[95%] min-h-[650px] max-w-[550px] mx-auto my-8 relative">
            {/* Círculo decorativo */}
     
            <div className="relative z-10 w-full">
              <h3 className="text-xl font-bold text-white mb-4">Información de Contacto</h3>
              <p className="text-white/80 text-sm mb-8">{content.description}</p>
              <div className="space-y-6 mb-8">
                {content.contactInfo.map((info, idx) => {
                  const IconComponent = iconMap[info.icon] || Mail
                  return (
                    <div key={info.title} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-[10] h-10 flex items-center justify-center rounded-full bg-[var(--primary-dark-alt)]">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-white/80 text-sm leading-tight">{detail}</p>
                        ))}
                        {info.description && <p className="text-xs text-[var(--accent-gold)] mt-1">{info.description}</p>}
                      </div>
                    </div>
                  )
                })}
                       <div className="absolute bg-conic-30 -bottom-30 right-0 w-32 h-32 bg-[var(--primary-dark-alt)] opacity-40 rounded-full -mb-10 -mr-10"></div>
              </div>
              {/* Redes sociales */}
              {content.socialMedia && content.socialMedia.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-white font-semibold text-base mb-3">Redes Sociales</h4>
                  <div className="flex flex-row gap-4">
                    {content.socialMedia.map((sm, idx) => {
                      const IconComponent = iconMap[sm.icon] || Mail
                      return (
                        <a
                          key={sm.name}
                          href={sm.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[var(--primary-dark-alt)] p-2 rounded-full hover:bg-[var(--accent-gold)] transition-all duration-300 hover:scale-110"
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Formulario de contacto */}
        <form
          className="bg-white p-10 flex flex-col justify-center gap-6 w-full md:w-1/2"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h3 className="font-serif text-2xl font-bold text-[var(--primary-dark)] mb-2">{content.formTitle}</h3>
          <p className="text-[var(--text-aux)] text-sm mb-4">{content.formDescription}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--primary-dark)] text-sm font-medium mb-1">Nombre Completo *</label>
              <input
                type="text"
                name="name"
                className="w-full border-0 border-b-2 border-[var(--primary-dark)] bg-transparent text-[var(--primary-dark)] placeholder-[var(--text-aux-light)] focus:outline-none focus:border-[var(--accent-gold)] py-2 transition-all"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-[var(--primary-dark)] text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                className="w-full border-0 border-b-2 border-[var(--primary-dark)] bg-transparent text-[var(--primary-dark)] placeholder-[var(--text-aux-light)] focus:outline-none focus:border-[var(--accent-gold)] py-2 transition-all"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tucorreo@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-[var(--primary-dark)] text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                name="phone"
                className="w-full border-0 border-b-2 border-[var(--primary-dark)] bg-transparent text-[var(--primary-dark)] placeholder-[var(--text-aux-light)] focus:outline-none focus:border-[var(--accent-gold)] py-2 transition-all"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-[var(--primary-dark)] text-sm font-medium mb-1">Asunto *</label>
              <input
                type="text"
                name="subject"
                className="w-full border-0 border-b-2 border-[var(--primary-dark)] bg-transparent text-[var(--primary-dark)] placeholder-[var(--text-aux-light)] focus:outline-none focus:border-[var(--accent-gold)] py-2 transition-all"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Motivo del mensaje"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[var(--primary-dark)] text-sm font-medium mb-1">Mensaje *</label>
            <textarea
              name="message"
              className="w-full border-0 border-b-2 border-[var(--primary-dark)] bg-transparent text-[var(--primary-dark)] placeholder-[var(--text-aux-light)] focus:outline-none focus:border-[var(--accent-gold)] py-2 min-h-[100px] transition-all"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje..."
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm font-medium">{successMessage}</p>}
          <button
            type="submit"
            className="mt-2 border-2 border-[var(--primary-dark)] text-[var(--primary-dark)] bg-transparent px-8 py-3 rounded-[var(--radius-btn)] font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[var(--primary-dark)] hover:text-[var(--neutral-white)] shadow-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </button>
          <p className="text-xs text-[var(--text-aux)] mt-2">{content.responseDisclaimer}</p>
        </form>
      </div>
    </section>
  )
}
