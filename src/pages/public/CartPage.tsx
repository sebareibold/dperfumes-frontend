"use client";

import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Droplet,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import { apiService } from "../../services/api";

// Define the type for contact info (copied from HomePage.tsx)
interface ContactDetailContent {
  icon: string;
  title: string;
  details: string[];
  description?: string;
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [contactPhone, setContactPhone] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactPhone() {
      try {
        const response = await apiService.getSiteContent();
        if (response.success && response.content?.contact?.contactInfo) {
          const contactInfo: ContactDetailContent[] =
            response.content.contact.contactInfo;
          const phoneInfo = contactInfo.find(
            (info) => info.title.toLowerCase() === "whatsapp"
          );
          if (
            phoneInfo &&
            Array.isArray(phoneInfo.details) &&
            phoneInfo.details[0]
          ) {
            // Clean up the phone number for WhatsApp (remove spaces, dashes, etc)
            const raw = phoneInfo.details[0];
            const cleaned = raw.replace(/[^\d+]/g, "");
            setContactPhone(cleaned);
          }
        }
      } catch {
        setContactPhone(null);
      }
    }
    fetchContactPhone();
  }, []);

  function handleVirtualOrder() {
    if (items.length === 0) return;
    navigate("/checkout");
  }

  const handleWhatsAppConsult = () => {
    const whatsappNumber = contactPhone;
    if (items.length === 0) {
      // Consulta general sin productos
      const message =
        "Hola! Me gustaría consultar sobre los perfumes disponibles en Daisy Perfumes.";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
      return;
    }

    // Crear mensaje con productos del carrito
    let message = "Hola! Me gustaría consultar sobre estos perfumes:\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre}\n`;
      message += `   Volumen: ${item.volumen.ml}ml\n`;
      message += `   Tipo: ${item.tipo}\n`;
      message += `   Cantidad: ${item.cantidad}\n`;
      message += `   Precio: $${item.volumen.precio.toLocaleString()}\n\n`;
    });

    message += `Total estimado: $${getTotalPrice().toLocaleString()}\n\n`;
    message += "¿Tienen stock disponible de estos perfumes?";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const subtotal = getTotalPrice();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-6 text-black">
            Tu Carrito
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium transition-all hover:opacity-70 text-black"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-black/10">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-black" />
            <h2 className="font-serif text-2xl font-light mb-4 text-black">
              Tu carrito está vacío
            </h2>
            <p className="text-lg font-light mb-8 text-gray-700">
              Parece que aún no has agregado perfumes a tu carrito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="inline-block px-10 py-4 text-black font-medium text-sm uppercase tracking-wider rounded-xl shadow-md border border-black bg-white transition-all hover:bg-black hover:text-white"
              >
                Explorar perfumes
              </Link>
              <button
                onClick={handleWhatsAppConsult}
                className="inline-flex items-center px-8 py-4 border-2 font-medium text-sm uppercase tracking-wider rounded-xl transition-all hover:scale-105 bg-white border-green-600 text-green-700 hover:bg-green-600 hover:text-white shadow-md"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Consultar por WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 mb-12 lg:mb-0">
              <div className="bg-white rounded-2xl shadow-md border border-black/10 overflow-hidden">
                <div className="p-6 border-b border-black/10">
                  <h2 className="font-serif text-2xl font-light text-black">
                    Perfumes ({items.length})
                  </h2>
                </div>

                <ul className="divide-y divide-black/10">
                  {items.map((item) => (
                    <li
                      key={`${item.id}-${item.volumen.ml}-${item.volumen.precio}-${item.tipo}`}
                      className="p-6 transition-all hover:bg-gray-50 hover:shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-sm bg-white">
                          <img
                            src={
                              item.imagen ||
                              "/placeholder.svg?height=96&width=96"
                            }
                            alt={item.nombre}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=96&width=96";
                            }}
                          />
                        </div>

                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <h3 className="font-serif text-lg font-medium text-black">
                                {item.nombre}
                              </h3>
                              <div className="mt-1 flex items-center space-x-4 text-sm">
                                <span className="flex items-center text-gray-700">
                                  <Droplet className="h-4 w-4 mr-1" />
                                  {item.volumen.ml}ml
                                </span>
                                <span className="text-gray-700">
                                  {item.tipo}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg text-black">
                                ${item.volumen.precio.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.cantidad - 1),
                                    item.volumen,
                                    item.tipo
                                  )
                                }
                                className="p-2 rounded-lg bg-white border border-black/10 hover:bg-black hover:text-white transition-all shadow-sm text-black"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-lg font-medium min-w-[2rem] text-center text-black">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.min(item.cantidad + 1, item.stock),
                                    item.volumen,
                                    item.tipo
                                  )
                                }
                                className="p-2 rounded-lg bg-white border border-black/10 hover:bg-black hover:text-white transition-all shadow-sm text-black"
                                disabled={item.cantidad >= item.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.volumen, item.tipo)
                              }
                              className="p-2 rounded-lg bg-white border border-black/10 hover:bg-red-600 hover:text-white transition-all shadow-sm text-black"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-lg border border-black/10 p-6 sticky top-6">
                <h2 className="font-serif text-2xl font-light mb-6 text-black">
                  Resumen del Pedido
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-black">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Envío</span>
                    <span className="font-medium text-black">
                      Calculado al finalizar
                    </span>
                  </div>
                  <div className="border-t pt-4 border-black/10">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-black">
                        Total estimado
                      </span>
                      <span className="text-lg font-semibold text-black">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleVirtualOrder}
                    className="w-full py-4 px-6 rounded-xl border-2 border-black text-black bg-white font-semibold text-base uppercase tracking-wider shadow-lg transition-all duration-300 hover:bg-black hover:scale-103 hover:text-white hover:shadow-xl flex items-center justify-center group"
                  >
                    <CreditCard className="h-6 w-6 mr-2 group-hover:text-white text-black transition-colors duration-300" />
                    Realizar pedido
                  </button>
                  <button
                    onClick={handleWhatsAppConsult}
                    className="w-full py-4 px-6 rounded-xl border-2 font-medium text-sm uppercase tracking-wider transition-all hover:scale-103 bg-white border-green-600 text-green-700 hover:bg-green-600 hover:text-white shadow-lg flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Consultar por WhatsApp
                  </button>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-gray-50 shadow-md">
                  <p className="text-sm text-center text-gray-700">
                    ¿Tienes dudas sobre algún perfume? ¡No dudes en
                    consultarnos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
