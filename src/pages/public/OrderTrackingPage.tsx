"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Search, MapPin, Truck, Info, XCircle, ArrowLeft, MessageSquare } from "lucide-react" // Mail is still imported but not used for the button
import { apiService } from "../../services/api"

interface OrderItem {
  productoId: string;
  nombre: string;
  volumen: { ml: string; precio: number };
  tipo: string;
  cantidad: number;
  imagen?: string;
}

interface InfoEnvio {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal?: string;
  notas?: string;
}

interface Order {
  _id: string;
  numeroOrden: string;
  items: OrderItem[];
  infoEnvio: InfoEnvio;
  metodoPago: "efectivo" | "transferencia";
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado: string;
  notas?: string;
  notasAdmin?: string;
  pagadoEn?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderTrackingPage() {
  const { orderNumber: urlOrderNumber } = useParams<{ orderNumber: string }>()
  const [orderNumber, setOrderNumber] = useState(urlOrderNumber || "")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [contactPhone, setContactPhone] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactPhone() {
      try {
        const response = await apiService.getSiteContent();
        if (response.success && response.content?.contact?.contactInfo) {
          const contactInfo = response.content.contact.contactInfo;
          // Buscar por 'Whatsapp'
          const phoneInfo = contactInfo.find((info: { title: string; details: string[] }) =>
            info.title.toLowerCase() === "whatsapp"
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

  // Cargar orden automáticamente si se accede desde URL con parámetro
  useEffect(() => {
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
      handleTrackOrder(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const handleTrackOrder = async (orderNumberParam?: string) => {
    const orderToTrack = orderNumberParam || orderNumber;
    
    if (!orderToTrack.trim()) {
      setError("Por favor, ingresa un número de pedido.")
      setOrder(null)
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      // Buscar por numeroOrden
      const response = await apiService.get(`/orders/by-number/${orderToTrack.trim()}`)
      if (response.success && response.order) {
        setOrder(response.order)
      } else {
        setError(response.error || "Pedido no encontrado. Verifica el número e intenta de nuevo.")
      }
    } catch (err) {
      console.error("Error al buscar pedido:", err)
      setError("Error al buscar el pedido. Intenta nuevamente más tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleTrackOrderClick = () => {
    handleTrackOrder();
  }

  // Determinar si las opciones de contacto deben mostrarse
  const showContactOptions = order && (order.estado === "pendiente_manual" || order.estado === "pagado")

  // Preparar mensajes pre-rellenados para los botones de contacto
  const orderRef = order?.numeroOrden || "(sin número)";
  const clientName = order?.infoEnvio.nombreCompleto || "Cliente";
  const orderDate = order ? new Date(order.createdAt).toLocaleDateString("es-AR") : "";
  const orderTotal = order?.total ? `$${order.total.toLocaleString()}` : "";
  const orderStatus = order?.estado === "pagado" ? "Pagado" : 
                     order?.estado === "pendiente_manual" ? "Pendiente" : 
                     order?.estado === "cancelado" ? "Cancelado" : 
                     order?.estado === "reembolsado" ? "Reembolsado" : order?.estado || "";
  
  // Mensaje prellenado para contactar a la tienda con información detallada del pedido
  const whatsappText = encodeURIComponent(
    `¡Hola! Quisiera consultar sobre mi pedido:\n\n` +
    `📦 Pedido: #${orderRef}\n` +
    `👤 Cliente: ${clientName}\n` +
    `📅 Fecha: ${orderDate}\n` +
    `💰 Total: ${orderTotal}\n` +
    `📊 Estado: ${orderStatus}\n\n` +
    `¿Podrían ayudarme con alguna consulta sobre este pedido?`
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--soft-creme)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-12">
          <h1
            className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light mb-2 sm:mb-4"
            style={{ color: "var(--deep-clay)" }}
          >
            Seguimiento de Pedido
          </h1>
          <p className="text-sm sm:text-lg font-light" style={{ color: "var(--oak)" }}>
            Ingresa tu número de pedido para ver su estado actual.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-warm shadow-lg shadow-2xl p-4 sm:p-8 mb-8 sm:mb-12 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Ej: JL-20240101-0001"
                className="w-full pl-4 pr-4 py-3 sm:py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-50"
                style={{
                  borderColor: "var(--bone)",
                  color: "var(--deep-clay)",
                }}
              />
            </div>
            <button
                              onClick={handleTrackOrderClick}
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl text-white text-xs sm:text-sm font-medium uppercase tracking-wider shadow-warm-lg transition-all hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #333 0%, #000 100%)" }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              )}
              Buscar Pedido
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start sm:items-center">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-warm shadow-lg shadow-2xl p-4 sm:p-8 border border-gray-200">
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 pb-4 border-b space-y-2 sm:space-y-0"
              style={{ borderColor: "var(--bone)" }}
            >
              <h2 className="font-serif text-lg sm:text-2xl font-light" style={{ color: "var(--deep-clay)" }}>
                Pedido #{order.numeroOrden}
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {order.estado === "pagado"
                  ? "Pagado"
                  : order.estado === "pendiente_manual"
                  ? "Pendiente"
                  : order.estado === "cancelado"
                  ? "Cancelado"
                  : order.estado === "reembolsado"
                  ? "Reembolsado"
                  : order.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Order Info */}
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2" style={{ color: "var(--clay)" }} />
                  <h3 className="font-serif text-base sm:text-xl font-light" style={{ color: "var(--deep-clay)" }}>
                    Información General
                  </h3>
                </div>
                <div
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm border border-gray-200"
                  style={{ color: "var(--oak)" }}
                >
                  <p>
                    <strong>Fecha del Pedido:</strong> {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong> {order.metodoPago === "efectivo" ? "Efectivo" : "Transferencia Bancaria"}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total.toLocaleString()}
                  </p>
                  {order.notasAdmin && (
                    <p className="text-xs bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                      <strong>Notas del Administrador:</strong> {order.notasAdmin}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  {order.costoEnvio > 0 ? (
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" style={{ color: "var(--clay)" }} />
                  ) : (
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" style={{ color: "var(--clay)" }} />
                  )}
                  <h3 className="font-serif text-base sm:text-xl font-light" style={{ color: "var(--deep-clay)" }}>
                    Información de Entrega
                  </h3>
                </div>
                <div
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm border border-gray-200"
                  style={{ color: "var(--oak)" }}
                >
                  <p>
                    <strong>Nombre:</strong> {order.infoEnvio.nombreCompleto}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.infoEnvio.correo}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {order.infoEnvio.telefono}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {order.infoEnvio.direccion}
                  </p>
                  <p>
                    <strong>Ciudad:</strong> {order.infoEnvio.ciudad}
                  </p>
                  {order.infoEnvio.notas && (
                    <p className="text-xs bg-green-50 p-2 rounded border-l-4 border-green-400">
                      <strong>Notas:</strong> {order.infoEnvio.notas}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Productos Ordenados */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-light mb-4" style={{ color: "var(--deep-clay)" }}>
                Productos Ordenados
              </h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-lg p-4 border border-black/10 shadow-sm">
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                      <img
                        src={item.imagen || "/placeholder.svg?height=64&width=64"}
                        alt={item.nombre}
                        className="w-full h-full object-cover rounded-lg border border-black/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{ color: "var(--clay)" }}>
                        {item.nombre}
                      </h4>
                      <div className="text-sm space-y-1" style={{ color: "var(--oak)" }}>
                        <p>Volumen: {item.volumen.ml} ml</p>
                        <p>Tipo: {item.tipo}</p>
                        <p>Cantidad: {item.cantidad}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: "var(--clay)" }}>
                        ${(item.volumen?.precio * item.cantidad).toLocaleString()}
                      </p>
                      <p className="text-sm" style={{ color: "var(--oak)" }}>
                        ${item.volumen?.precio.toLocaleString()} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Totales */}
            <div className="border-t pt-6" style={{ borderColor: "var(--bone)" }}>
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: "var(--oak)" }}>
                    <span>Subtotal:</span>
                    <span>${order.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "var(--oak)" }}>
                    <span>{order.costoEnvio > 0 ? "Envío:" : "Punto de encuentro:"}</span>
                    <span>{order.costoEnvio > 0 ? `$${order.costoEnvio?.toLocaleString()}` : "Gratis"}</span>
                  </div>
                  <div
                    className="flex justify-between text-xl font-semibold pt-2 border-t"
                    style={{ color: "var(--deep-clay)", borderColor: "var(--bone)" }}
                  >
                    <span>Total:</span>
                    <span>${order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options for "En seguimiento" orders */}
            {showContactOptions && (
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t" style={{ borderColor: "var(--bone)" }}>
                <h3
                  className="font-serif text-base sm:text-xl font-light mb-3 sm:mb-4 text-center"
                  style={{ color: "var(--deep-clay)" }}
                >
                  ¿Necesitas ayuda con tu pedido?
                </h3>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <a
                    href={contactPhone ? `https://wa.me/${contactPhone}?text=${whatsappText}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto px-4 sm:px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-xl text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center ${!contactPhone ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ background: "linear-gradient(90deg, #333 0%, #000 100%)" }}
                    aria-disabled={!contactPhone}
                    tabIndex={!contactPhone ? -1 : 0}
                  >
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {contactPhone ? 'Contactar por WhatsApp' : 'WhatsApp no disponible'}
                  </a>
                </div>
              </div>
            )}

            {/* Back to Home */}
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 sm:px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-xl text-white transition-all duration-300 hover:shadow-lg"
                style={{ background: "linear-gradient(90deg, #222 0%, #444 100%)" }}
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
