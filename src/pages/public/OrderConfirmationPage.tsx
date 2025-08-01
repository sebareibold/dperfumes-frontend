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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import InvoiceDocument from '../../components/utils/InvoiceDocument';
import type { InvoiceItem } from '../../components/utils/InvoiceDocument';

export default function OrderConfirmationPage() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const [contactPhone, setContactPhone] = useState<string | null>(null);

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

  // Cargar información de contacto
  useEffect(() => {
    async function fetchContactPhone() {
      try {
        const response = await apiService.getSiteContent();
        if (response.success && response.content?.contact?.contactInfo) {
          const contactInfo = response.content.contact.contactInfo;
          // Buscar por 'Whatsapp'
          const whatsappInfo = contactInfo.find((info: { title: string; details: string[] }) =>
            info.title.toLowerCase() === "whatsapp"
          );
          if (whatsappInfo && Array.isArray(whatsappInfo.details) && whatsappInfo.details[0]) {
            // Clean up the phone number for WhatsApp (remove spaces, dashes, etc)
            const raw = whatsappInfo.details[0];
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

  const copyOrderNumber = () => {
    if (numeroOrden) {
      navigator.clipboard.writeText(numeroOrden)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadInvoicePDF = async () => {
    setShowInvoice(true);
    setTimeout(async () => {
      const input = invoiceRef.current;
      if (!input) return;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura-DaisyPerfumes-Orden-${numeroOrden}.pdf`);
      setShowInvoice(false);
    }, 100);
  };

  const handleWhatsAppContact = () => {
    if (!contactPhone) {
      alert("WhatsApp no disponible en este momento. Por favor, contacta por otros medios.");
      return;
    }
    const message = `Hola! Acabo de realizar la orden #${numeroOrden}. Me gustaría confirmar los detalles y coordinar ${wantsShipping ? "el envío" : "el punto de encuentro"}.`
    const whatsappUrl = `https://wa.me/${contactPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // Datos para la factura
  const company = {
    logoUrl: '/icono_logo.png',
    name: 'Daisy Perfumes Artesanales',
    address: "Av. Siempreviva 742, Neuquén Capital",
    email: "info@daisyperfumes.com",
    phone: "(0299) 400-1234",
    cuit: "30-98765432-1",
  };
  const client = {
    name: nombreCompleto,
    address: direccion,
    email: correo,
    phone: telefono,
    city: ciudad,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceItems: InvoiceItem[] = items.map((item: any) => ({
    description: item.titulo || item.descripcion || item.nombre || 'Producto',
    quantity: item.cantidad || item.quantity || 1,
    unitPrice: item.precio || item.price || (item.volumen?.precio ?? 0),
    total: ((item.precio || item.price || (item.volumen?.precio ?? 0)) * (item.cantidad || item.quantity || 1)),
    volumenMl: item.volumen?.ml ? Number(item.volumen.ml) : undefined,
  }));
  const invoice = {
    number: numeroOrden,
    date: createdAt ? new Date(createdAt).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR'),
    dueDate: undefined,
    items: invoiceItems,
    subtotal: subtotal || 0,
    shippingCost: costoEnvio,
    total: total || 0,
    paymentTerms: metodoPago === 'efectivo' ? 'Pago en efectivo al recibir.' : 'Transferencia bancaria.',
    paymentMethod: metodoPago,
    status: estado,
    notes: orderData?.notas || '',
    wantsShipping: wantsShipping,
  };

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

        {/* Botón para ver la factura en pantalla */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowInvoice((v) => !v)}
            className="px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
            style={{ borderColor: "#111", color: "#111", backgroundColor: "white" }}
          >
            {showInvoice ? 'Ocultar Factura' : 'Ver Factura'}
          </button>
        </div>

        {/* Factura visual (solo si showInvoice) */}
        {showInvoice && (
          <div ref={invoiceRef} className="mb-8 bg-white p-6 rounded-xl shadow" style={{ overflowX: 'auto' }}>
            <InvoiceDocument company={company} client={client} invoice={invoice} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleDownloadInvoicePDF}
            className="flex items-center justify-center px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 group bg-white hover:bg-[linear-gradient(90deg,#333_0%,#000_100%)] group hover:text-white"
            style={{ borderColor: "var(--bone)", color: "var(--clay)" }}
          >
            <span className="transition-colors duration-300 flex items-center group-hover:text-white">
            <Printer className="h-5 w-5 mr-2 group-hover:text-white transition-colors duration-300" />
            Descargar Factura (PDF)
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
      
      {/* Factura oculta para PDF */}
      {showInvoice && (
        <div style={{ position: "absolute", left: -9999, top: 0 }}>
          <div ref={invoiceRef}>
            <InvoiceDocument
              company={{
                logoUrl: '/logo.png',
                name: 'Daisy Perfumes',
                address: 'Neuquén Capital',
                email: 'daisyperfumes@gmail.com',
                phone: '(0299) 512-3456',
              }}
              client={{
                name: nombreCompleto,
                address: ciudad,
                email: correo,
                phone: telefono,
              }}
              invoice={{
                number: numeroOrden,
                date: new Date(createdAt || Date.now()).toLocaleDateString('es-AR'),
                status: estado,
                paymentMethod: metodoPago,
                items: (items as Array<{ nombre: string; volumen?: { ml?: string; precio?: number }; tipo?: string; cantidad: number; imagen?: string }> | undefined)?.map((item) => ({
                  description: `${item.nombre} ${item.volumen?.ml ? `- ${item.volumen.ml}` : ''} ${item.tipo ? `- ${item.tipo}` : ''}`.trim(),
                  quantity: item.cantidad,
                  unitPrice: item.volumen?.precio || 0,
                  total: (item.volumen?.precio || 0) * item.cantidad,
                })) as InvoiceItem[],
                subtotal: subtotal || 0,
                tax: 0, // Si tienes desglose de impuestos, cámbialo aquí
                total: total || 0,
                paymentTerms: wantsShipping ? `Envío a domicilio ($${costoEnvio?.toLocaleString('es-AR')})` : 'Retiro en punto de encuentro',
                accentColor: '#1976d2',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
