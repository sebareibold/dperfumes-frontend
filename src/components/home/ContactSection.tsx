"use client"

import type React from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  X,
  Youtube,
  Linkedin,
  Github,
  Globe,
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
    <section id="contact" className="py-40 lg:py-32 flex justify-center items-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl border border-black/10 shadow-none flex flex-col md:flex-row items-center justify-center min-h-[420px] gap-6 px-4 md:px-0 mx-4 sm:mx-8 md:mx-auto">
        {/* Tarjeta de información de contacto */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full">
          <div className="bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 border border-black/10 rounded-2xl p-6 md:p-10 flex flex-col justify-between items-start w-full md:w-[90%] min-h-0 md:min-h-[650px] max-w-full md:max-w-[550px] mx-auto my-4 md:my-8 relative">
            <div className="relative z-10 w-full">
              <h3 className="font-serif text-2xl font-semibold text-white mb-4 uppercase tracking-widest">Información de Contacto</h3>
              <p className="text-white/80 text-sm mb-8">{content.description}</p>
              <div className="space-y-6 mb-8">
                {content.contactInfo.map((info) => {
                  const IconComponent = iconMap[info.icon] || Mail
                  return (
                    <div key={info.title} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-white/80 text-sm leading-tight">{detail}</p>
                        ))}
                        {info.description && <p className="text-xs text-white/50 mt-1">{info.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Redes sociales */}
              {content.socialMedia && content.socialMedia.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-white font-semibold text-base mb-3">Redes Sociales</h4>
                  <div className="flex flex-row gap-4">
                    {content.socialMedia.map((sm) => {
                      const IconComponent = iconMap[sm.icon] || Mail
                      return (
                        <a
                          key={sm.name}
                          href={sm.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/10 border border-white/20 p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
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
          className="bg-white p-4 md:p-10 flex flex-col justify-center gap-6 w-full md:w-1/2"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h3 className="font-serif text-2xl font-semibold text-black mb-2 uppercase tracking-widest">{content.formTitle}</h3>
          <p className="text-black/60 text-sm mb-4">{content.formDescription}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-xs font-medium mb-1 uppercase tracking-widest">Nombre Completo *</label>
              <input
                type="text"
                name="name"
                className="w-full border border-black/20 rounded-full bg-white text-black placeholder-black/30 focus:outline-none focus:border-black px-4 py-2 transition-all text-sm"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-black text-xs font-medium mb-1 uppercase tracking-widest">Email *</label>
              <input
                type="email"
                name="email"
                className="w-full border border-black/20 rounded-full bg-white text-black placeholder-black/30 focus:outline-none focus:border-black px-4 py-2 transition-all text-sm"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tucorreo@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-black text-xs font-medium mb-1 uppercase tracking-widest">Teléfono</label>
              <input
                type="tel"
                name="phone"
                className="w-full border border-black/20 rounded-full bg-white text-black placeholder-black/30 focus:outline-none focus:border-black px-4 py-2 transition-all text-sm"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-black text-xs font-medium mb-1 uppercase tracking-widest">Asunto *</label>
              <input
                type="text"
                name="subject"
                className="w-full border border-black/20 rounded-full bg-white text-black placeholder-black/30 focus:outline-none focus:border-black px-4 py-2 transition-all text-sm"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Motivo del mensaje"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-black text-xs font-medium mb-1 uppercase tracking-widest">Mensaje *</label>
            <textarea
              name="message"
              className="w-full border border-black/20 rounded-2xl bg-white text-black placeholder-black/30 focus:outline-none focus:border-black px-4 py-2 min-h-[100px] transition-all text-sm"
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
            className="mt-2 border-2 border-black text-black bg-white px-8 py-3 rounded-full font-sans text-xs uppercase tracking-widest font-normal transition-all duration-300 hover:bg-black hover:text-white focus:outline-none shadow-none hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </button>
          <p className="text-xs text-black/40 mt-2">{content.responseDisclaimer}</p>
        </form>
      </div>
    </section>
  )
}
