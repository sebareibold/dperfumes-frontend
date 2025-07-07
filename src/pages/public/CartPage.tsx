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
  const { items, updateQuantity, removeFromCart, getTotalPrice } =
    useCart();
  const navigate = useNavigate();
  const [contactPhone, setContactPhone] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactPhone() {
      try {
        const response = await apiService.getSiteContent();
        if (response.success && response.content?.contact?.contactInfo) {
          const contactInfo: ContactDetailContent[] = response.content.contact.contactInfo;
          const phoneInfo = contactInfo.find(
            (info) => info.title === "Teléfono"
          );
          if (phoneInfo && Array.isArray(phoneInfo.details) && phoneInfo.details[0]) {
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
      message += `${index + 1}. ${item.name}\n`;
      if (item.size) message += `   Volumen: ${item.size}\n`;
      if (item.color) message += `   Variante: ${item.color}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.price.toLocaleString()}\n\n`;
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--soft-creme)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1
            className="font-serif text-4xl lg:text-5xl font-light mb-6"
            style={{ color: "var(--deep-clay)" }}
          >
            Tu Carrito
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium"
            style={{ color: "var(--clay)" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-warm">
            <ShoppingBag
              className="h-16 w-16 mx-auto mb-6"
              style={{ color: "var(--oak)" }}
            />
            <h2
              className="font-serif text-2xl font-light mb-4"
              style={{ color: "var(--deep-clay)" }}
            >
              Tu carrito está vacío
            </h2>
            <p
              className="text-lg font-light mb-8"
              style={{ color: "var(--oak)" }}
            >
              Parece que aún no has agregado perfumes a tu carrito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="inline-block px-10 py-4 text-white font-medium text-sm uppercase tracking-wider rounded-xl shadow-warm-lg transition-all hover:scale-105"
                style={{ backgroundColor: "var(--clay)" }}
              >
                Explorar perfumes
              </Link>
              <button
                onClick={handleWhatsAppConsult}
                className="inline-flex items-center px-8 py-4 border-2 font-medium text-sm uppercase tracking-wider rounded-xl transition-all hover:scale-105"
                style={{
                  borderColor: "var(--clay)",
                  color: "var(--clay)",
                  backgroundColor: "transparent",
                }}
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
              <div className="bg-white rounded-2xl shadow-warm overflow-hidden">
                <div
                  className="p-6 border-b"
                  style={{ borderColor: "var(--bone)" }}
                >
                  <h2
                    className="font-serif text-2xl font-light"
                    style={{ color: "var(--deep-clay)" }}
                  >
                    Perfumes ({items.length})
                  </h2>
                </div>

                <ul className="divide-y">
                  {items.map((item) => (
                    <li
                      key={`${item.id}-${item.size}-${item.color || ""}`}
                      className="p-6"
                    >
                      <div className="flex items-center">
                        <div
                          className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border"
                          style={{ borderColor: "var(--bone)" }}
                        >
                          <img
                            src={
                              item.image ||
                              "/placeholder.svg?height=96&width=96"
                            }
                            alt={item.name}
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
                              <h3
                                className="font-serif text-lg font-medium"
                                style={{ color: "var(--deep-clay)" }}
                              >
                                {item.name}
                              </h3>
                              <div className="mt-1 flex items-center space-x-4 text-sm">
                                {item.size && (
                                  <span
                                    className="flex items-center"
                                    style={{ color: "var(--oak)" }}
                                  >
                                    <Droplet className="h-4 w-4 mr-1" />
                                    {item.size}
                                  </span>
                                )}
                                {item.color && item.color !== "Único" && (
                                  <span style={{ color: "var(--oak)" }}>
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className="font-semibold text-lg"
                                style={{ color: "var(--deep-clay)" }}
                              >
                                ${item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1),
                                    item.size,
                                    item.color
                                  )
                                }
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                style={{ color: "var(--clay)" }}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span
                                className="text-lg font-medium min-w-[2rem] text-center"
                                style={{ color: "var(--deep-clay)" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    item.size,
                                    item.color
                                  )
                                }
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                style={{ color: "var(--clay)" }}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.size, item.color)
                              }
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ color: "var(--oak)" }}
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
              <div className="bg-white rounded-2xl shadow-warm p-6 sticky top-6">
                <h2
                  className="font-serif text-2xl font-light mb-6"
                  style={{ color: "var(--deep-clay)" }}
                >
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--oak)" }}>Subtotal</span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--deep-clay)" }}
                    >
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--oak)" }}>Envío</span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--deep-clay)" }}
                    >
                      Calculado al finalizar
                    </span>
                  </div>
                  <div
                    className="border-t pt-4"
                    style={{ borderColor: "var(--bone)" }}
                  >
                    <div className="flex justify-between">
                      <span
                        className="text-lg font-medium"
                        style={{ color: "var(--deep-clay)" }}
                      >
                        Total estimado
                      </span>
                      <span
                        className="text-lg font-semibold"
                        style={{ color: "var(--deep-clay)" }}
                      >
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleVirtualOrder}
                    className="w-full py-4 px-6 rounded-xl text-white font-medium text-sm uppercase tracking-wider shadow-warm-lg transition-all hover:scale-105 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(to right, var(--clay), var(--dark-clay))",
                    }}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Finalizar Compra
                  </button>
                  <button
                    onClick={handleWhatsAppConsult}
                    className="w-full py-4 px-6 rounded-xl border-2 font-medium text-sm uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center"
                    style={{
                      borderColor: "var(--clay)",
                      color: "var(--clay)",
                      backgroundColor: "transparent",
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Consultar por WhatsApp
                  </button>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "var(--bone)" }}>
                  <p className="text-sm text-center" style={{ color: "var(--oak)" }}>
                    ¿Tienes dudas sobre algún perfume? ¡No dudes en consultarnos!
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
