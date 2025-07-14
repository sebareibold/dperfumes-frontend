"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import {
  CheckCircle,
  Copy,
  Printer,
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Building2,
  MessageCircle,
} from "lucide-react"
import { apiService } from "../../services/api"

export default function OrderConfirmationPage() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const orderData = location.state?.order
  const wantsShipping = location.state?.wantsShipping
  const transferProof = location.state?.transferProof

  // Utilidades para acceder a los datos con fallback
  const numeroOrden = orderData?.numeroOrden || paramOrderNumber;
  const estado = orderData?.estado;
  const metodoPago = orderData?.metodoPago;
  const createdAt = orderData?.createdAt;
  const items = orderData?.items || [];
  const subtotal = orderData?.subtotal;
  const costoEnvio = orderData?.costoEnvio;
  const total = orderData?.total;
  const infoEnvio = orderData?.infoEnvio || {};

  // Accesos corregidos para infoEnvio
  const nombreCompleto = infoEnvio?.nombreCompleto || "N/A";
  const correo = infoEnvio?.correo || "N/A";
  const telefono = infoEnvio?.telefono || "N/A";
  const direccion = infoEnvio?.direccion || "N/A";
  const ciudad = infoEnvio?.ciudad || "N/A";

  // Función para cargar la orden desde la API si no está en el estado
  const loadOrderFromAPI = async (orderNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get(`/orders/by-number/${orderNumber}`);
      
      if (response.success && response.order) {
        // Actualizar el estado con los datos de la orden
        window.history.replaceState(
          { 
            ...location.state, 
            order: response.order 
          }, 
          '', 
          location.pathname
        );
        
        // Recargar la página para que use los nuevos datos
        window.location.reload();
      } else {
        setError("No se pudo encontrar la orden");
      }
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Error al cargar la orden. Verifica el número de orden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si no hay datos de la orden pero hay un número de orden en la URL, cargar desde la API
    if (!orderData && paramOrderNumber) {
      loadOrderFromAPI(paramOrderNumber);
    } else if (!orderData && !paramOrderNumber) {
      // Si no hay datos ni número de orden, redirigir al inicio
      navigate("/");
    }
  }, [orderData, paramOrderNumber, navigate]);

  const copyOrderNumber = () => {
    if (numeroOrden) {
      navigator.clipboard.writeText(numeroOrden)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrintInvoice = () => {
    // Crear ventana de factura
    const invoiceWindow = window.open("", "_blank", "width=800,height=600")
    if (!invoiceWindow) return

    const invoiceHTML = generateInvoiceHTML()
    invoiceWindow.document.write(invoiceHTML)
    invoiceWindow.document.close()

    // Esperar a que cargue y luego imprimir
    invoiceWindow.onload = () => {
      invoiceWindow.print()
      invoiceWindow.close()
    }
  }

  const generateInvoiceHTML = () => {
    const currentDate = new Date().toLocaleDateString("es-AR")
    const orderDate = new Date(createdAt || Date.now()).toLocaleDateString("es-AR")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura - Orden #${numeroOrden}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Open Sans', Arial, sans-serif;
            color: #111;
            background: #fff;
            max-width: 800px;
            margin: 0 auto;
            padding: 32px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
            border-bottom: 2px solid #111;
            padding-bottom: 18px;
            letter-spacing: 2px;
          }
          .company-name {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: 4px;
            color: #111;
            margin-bottom: 4px;
            text-shadow: 2px 2px 0 #fff, 4px 4px 0 #1111;
          }
          .company-info {
            font-size: 13px;
            color: #222;
            letter-spacing: 1px;
          }
          .invoice-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #111;
            text-align: center;
            margin: 36px 0 18px 0;
            letter-spacing: 2px;
            border-bottom: 2px dashed #111;
            padding-bottom: 12px;
            text-transform: uppercase;
          }
          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #111;
            margin-bottom: 8px;
            border-bottom: 1px solid #111;
            padding-bottom: 4px;
            letter-spacing: 1px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 18px;
            border-bottom: 1px solid #111;
            padding-bottom: 10px;
          }
          .client-shipping {
            display: flex;
            gap: 48px;
            margin-bottom: 18px;
          }
          .client-data, .shipping-data {
            flex: 1;
          }
          .client-data p, .shipping-data p {
            margin: 2px 0 0 0;
            font-size: 14px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px 0 #1112;
          }
          .items-table th, .items-table td {
            border: 1px solid #111;
            padding: 12px 14px;
            text-align: left;
            font-size: 14px;
          }
          .items-table th {
            background: #f7f7f7;
            color: #111;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            border-bottom: 2px solid #111;
          }
          .items-table td {
            font-family: 'Open Sans', Arial, sans-serif;
            border-bottom: 1px dashed #111;
          }
          .totals {
            text-align: right;
            margin-top: 18px;
          }
          .totals table {
            margin-left: auto;
            border-collapse: collapse;
            width: 60%;
          }
          .totals td {
            padding: 10px 14px;
            border-bottom: 1px solid #111;
            font-size: 15px;
          }
          .total-final {
            font-weight: 700;
            font-size: 1.1rem;
            color: #111;
            border-top: 2px solid #111 !important;
            padding-top: 8px !important;
            letter-spacing: 1px;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: #222;
            border-top: 1px solid #111;
            padding-top: 16px;
            letter-spacing: 1px;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
              box-shadow: none;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">DAISY PERFUMES</div>
          <div class="company-info">
            Av. Argentina 123, Neuquén Capital<br>
            Tel: (0299) 512-3456 | Email: info@daisyperfumes.com<br>
            CUIT: 30-12345678-9
          </div>
        </div>

        <div class="invoice-title">Factura de Venta</div>
        <!-- Línea separadora eliminada para un look más limpio -->

        <div class="invoice-details">
          <div>
            <strong>Número de Orden:</strong> #${numeroOrden}<br>
            <strong>Fecha de Emisión:</strong> ${currentDate}<br>
            <strong>Fecha de Pedido:</strong> ${orderDate}
          </div>
          <div style="text-align: right;">
            <strong>Estado:</strong> ${estado === "pagado" ? "PAGADO" : "PENDIENTE"}<br>
            <strong>Método de Pago:</strong> ${metodoPago === "efectivo" ? "Efectivo" : "Transferencia"}
          </div>
        </div>

        <div class="section-title">Datos del Cliente y Envío</div>
        <div class="client-shipping">
          <div class="client-data">
            <p><strong>Nombre:</strong> ${nombreCompleto}</p>
            <p><strong>Email:</strong> ${correo}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
          </div>
          <div class="shipping-data">
            <p><strong>Dirección:</strong> ${direccion}</p>
            <p><strong>Ciudad:</strong> ${ciudad}</p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Volumen</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${
              items
                ?.map(
                  (item: {
                    nombre: string;
                    volumen: { ml: string; precio: number };
                    tipo: string;
                    cantidad: number;
                    imagen?: string;
                  }) => `
              <tr>
                <td>${item.nombre}</td>
                <td>${item.volumen?.ml || ""}</td>
                <td>${item.tipo || ""}</td>
                <td>${item.cantidad}</td>
                <td>$${item.volumen?.precio?.toLocaleString("es-AR")}</td>
                <td>$${(item.volumen?.precio * item.cantidad)?.toLocaleString("es-AR")}</td>
              </tr>
            `,
                )
                .join("") || ""
            }
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>$${subtotal?.toLocaleString("es-AR")}</td>
            </tr>
            <tr>
              <td>${wantsShipping ? "Envío:" : "Punto de encuentro:"}</td>
              <td>${wantsShipping ? `$${costoEnvio?.toLocaleString("es-AR")}` : "Gratis"}</td>
            </tr>
            <tr class="total-final">
              <td><strong>TOTAL:</strong></td>
              <td><strong>$${total?.toLocaleString("es-AR")}</strong></td>
            </tr>
          </table>
        </div>

        <!-- Línea separadora eliminada para un look más limpio -->

        <div class="footer">
          <p><strong>¡Gracias por tu compra!</strong></p>
          <p>Esta factura fue generada automáticamente el ${currentDate}</p>
          <p>Para consultas sobre tu pedido, contactanos por WhatsApp: +54 299 512 3456</p>
        </div>
      </body>
      </html>
    `
  }

  const handleWhatsAppContact = () => {
    const message = `Hola! Acabo de realizar la orden #${numeroOrden}. Me gustaría confirmar los detalles y coordinar ${wantsShipping ? "el envío" : "el punto de encuentro"}.`
    const whatsappUrl = `https://wa.me/5492995123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soft-creme)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-light">Cargando información de la orden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soft-creme)" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="font-serif text-2xl font-light mb-4 text-black">
            Error al cargar la orden
          </h2>
          <p className="text-black font-light mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-block px-6 py-3 text-white font-medium text-sm uppercase tracking-wider rounded-xl shadow-warm-lg transition-all hover:scale-105"
            style={{ backgroundColor: "var(--clay)" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soft-creme)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto mb-4"></div>
          <p style={{ color: "var(--clay)" }}>Cargando información de la orden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--soft-creme)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-4" style={{ color: "var(--deep-clay)" }}>
            ¡Orden Confirmada!
          </h1>
          <p className="text-lg font-light" style={{ color: "var(--oak)" }}>
            Tu pedido ha sido recibido y está siendo procesado
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-warm overflow-hidden mb-8">
          <div className="p-8">
            {/* Order Number */}
            <div
              className="flex items-center justify-between mb-8 pb-6 border-b"
              style={{ borderColor: "var(--bone)" }}
            >
              <div>
                <h2 className="font-serif text-2xl font-light mb-2" style={{ color: "var(--deep-clay)" }}>
                  Número de Orden
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-mono font-bold" style={{ color: "var(--clay)" }}>
                    #{numeroOrden}
                  </span>
                  <button
                    onClick={copyOrderNumber}
                    className="flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "var(--bone)", color: "var(--clay)" }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: "var(--oak)" }}>
                  Fecha del pedido
                </p>
                <p className="text-lg" style={{ color: "var(--clay)" }}>
                  {new Date(createdAt || Date.now()).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 mr-2" style={{ color: "var(--clay)" }} />
                  <h3 className="font-serif text-xl font-light" style={{ color: "var(--deep-clay)" }}>
                    Método de Pago
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium mb-2" style={{ color: "var(--clay)" }}>
                    {metodoPago === "efectivo" ? "Pago en Efectivo" : "Transferencia Bancaria"}
                  </p>
                  {metodoPago === "efectivo" ? (
                    <div className="space-y-2 text-sm" style={{ color: "var(--oak)" }}>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Punto de encuentro:</p>
                          <p>Av. Argentina 123, Neuquén Capital</p>
                        </div>
                      </div>
                      <p className="text-xs bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                        <strong>Importante:</strong> Te contactaremos para coordinar el encuentro y confirmar la
                        disponibilidad de los productos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm" style={{ color: "var(--oak)" }}>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p className="font-medium mb-2">Datos para transferencia:</p>
                        <div className="space-y-1 font-mono text-xs">
                          <p>
                            <strong>CBU:</strong> 0110599520000012345678
                          </p>
                          <p>
                            <strong>Alias:</strong> DAISY.PERFUMES
                          </p>
                          <p>
                            <strong>Titular:</strong> Daisy Perfumes S.A.S.
                          </p>
                          <p>
                            <strong>CUIT:</strong> 30-12345678-9
                          </p>
                        </div>
                      </div>
                      {transferProof && (
                        <p className="text-green-600 text-xs bg-green-50 p-2 rounded">
                          ✓ Comprobante de transferencia recibido
                        </p>
                      )}
                      <p className="text-xs bg-amber-50 p-2 rounded border-l-4 border-amber-400">
                        <strong>Importante:</strong> Una vez confirmada la transferencia, el envío puede tardar entre 2
                        a 3 días hábiles.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  {wantsShipping ? (
                    <Truck className="h-5 w-5 mr-2" style={{ color: "var(--clay)" }} />
                  ) : (
                    <Building2 className="h-5 w-5 mr-2" style={{ color: "var(--clay)" }} />
                  )}
                  <h3 className="font-serif text-xl font-light" style={{ color: "var(--deep-clay)" }}>
                    {wantsShipping ? "Información de Envío" : "Retiro en Punto de Encuentro"}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm" style={{ color: "var(--oak)" }}>
                    <p>
                      <strong>Nombre:</strong> {nombreCompleto}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {telefono}
                    </p>
                    <p>
                      <strong>Email:</strong> {correo}
                    </p>
                    {wantsShipping ? (
                      <>
                        <p>
                          <strong>Dirección:</strong> {direccion}
                        </p>
                        <p>
                          <strong>Ciudad:</strong> {ciudad}
                        </p>
                        <p className="text-xs bg-blue-50 p-2 rounded border-l-4 border-blue-400 mt-2">
                          Los envíos tienen un costo adicional según tu ubicación y solo se realizan dentro de Neuquén.
                        </p>
                      </>
                    ) : (
                      <p className="text-xs bg-green-50 p-2 rounded border-l-4 border-green-400 mt-2">
                        Retiro gratuito en nuestro punto de encuentro. Te contactaremos para coordinar.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-light mb-4" style={{ color: "var(--deep-clay)" }}>
                Productos Ordenados
              </h3>
              <div className="space-y-4">
                {items?.map((item: {
                  nombre: string;
                  volumen: { ml: string; precio: number };
                  tipo: string;
                  cantidad: number;
                  imagen?: string;
                }, index: number) => (
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

            {/* Order Summary */}
            <div className="border-t pt-6" style={{ borderColor: "var(--bone)" }}>
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: "var(--oak)" }}>
                    <span>Subtotal:</span>
                    <span>${subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "var(--oak)" }}>
                    <span>{wantsShipping ? "Envío:" : "Punto de encuentro:"}</span>
                    <span>{wantsShipping ? `$${costoEnvio?.toLocaleString()}` : "Gratis"}</span>
                  </div>
                  <div
                    className="flex justify-between text-xl font-semibold pt-2 border-t"
                    style={{ color: "var(--deep-clay)", borderColor: "var(--bone)" }}
                  >
                    <span>Total:</span>
                    <span>${total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handlePrintInvoice}
            className="flex items-center justify-center px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 group bg-white hover:bg-[linear-gradient(90deg,#333_0%,#000_100%)] group hover:text-white"
            style={{
              borderColor: "var(--clay)",
              color: "var(--clay)"
            }}
          >
            <span className="transition-colors duration-300 flex items-center group-hover:text-white">
            <Printer className="h-5 w-5 mr-2 group-hover:text-white transition-colors duration-300" />
            Imprimir Factura
            </span>
          </button>

          <button
            onClick={handleWhatsAppContact}
            className="flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-green-800 text-green-800 bg-white hover:bg-green-800 hover:text-white hover:shadow-lg hover:scale-105 group"
            style={{
              boxShadow: "0 2px 8px 0 rgba(20,83,45,0.08)"
            }}
          >
            <MessageCircle className="h-5 w-5 mr-2 group-hover:text-white text-green-800 transition-colors duration-300" />
            Contactar por WhatsApp
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 border border-[#374151] text-base font-medium rounded-xl text-[#374151] bg-white transition-all duration-300 hover:shadow-lg hover:bg-[#374151] hover:text-white hover:scale-105 group"
            style={{ boxShadow: "0 2px 8px 0 rgba(55,65,81,0.08)" }}
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:text-white text-[#374151] transition-colors duration-300" />
            Volver al Inicio
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-warm">
            <h3 className="font-serif text-xl font-light mb-4" style={{ color: "var(--deep-clay)" }}>
              ¿Qué sigue ahora?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm" style={{ color: "var(--oak)" }}>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--soft-creme)" }}
                >
                  <span className="text-xl font-bold" style={{ color: "var(--clay)" }}>
                    1
                  </span>
                </div>
                <p className="font-medium mb-1">Confirmación</p>
                <p>Recibirás un email con los detalles de tu pedido</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--soft-creme)" }}
                >
                  <span className="text-xl font-bold" style={{ color: "var(--clay)" }}>
                    2
                  </span>
                </div>
                <p className="font-medium mb-1">Coordinación</p>
                <p>Te contactaremos para coordinar {wantsShipping ? "el envío" : "el punto de encuentro"}</p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--soft-creme)" }}
                >
                  <span className="text-xl font-bold" style={{ color: "var(--clay)" }}>
                    3
                  </span>
                </div>
                <p className="font-medium mb-1">Entrega</p>
                <p>{wantsShipping ? "Recibirás tu pedido en 2-3 días hábiles" : "Retira en el punto acordado"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
