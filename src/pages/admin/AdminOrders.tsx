"use client"
import { useState, useEffect } from "react"
import {
  ClipboardCheck,
  ShoppingBag,
  Eye,
  Calendar,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Trash2,
  ImageIcon,
  CreditCard,
  Banknote,
  Building2,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router-dom"
import { apiService } from "../../services/api"
import toast from "react-hot-toast"

interface Order {
  _id: string
  numeroOrden: string
  items: Array<{
    productoId: string
    nombre: string
    volumen: { ml: string; precio: number }
    tipo: string
    cantidad: number
    imagen?: string
  }>
  infoEnvio: {
    nombreCompleto: string
    correo: string
    telefono: string
    direccion: string
    ciudad: string
    codigoPostal?: string
    notas?: string
  }
  metodoPago: "efectivo" | "transferencia"
  subtotal: number
  costoEnvio: number
  total: number
  estado:
    | "pendiente_manual"
    | "pendiente_comprobante_transferencia"
    | "pendiente_confirmacion_transferencia"
    | "pagado"
    | "cancelado"
    | "reembolsado"
    | "confirmado"
  notas?: string
  notasAdmin?: string
  createdAt: string
  updatedAt: string
  pagadoEn?: string
  urlComprobanteTransferencia?: string
}

// Define la estructura para los nuevos stats con desglose por método de pago
interface OrderStats {
  total: number
  revenue: number
  byStatusAndPaymentMethod: {
    // Estados en español (nuevos)
    pendiente_manual: { cash: number; transfer: number }
    pendiente_comprobante_transferencia: { cash: number; transfer: number }
    pendiente_confirmacion_transferencia: { cash: number; transfer: number }
    pagado: { cash: number; transfer: number }
    cancelado: { cash: number; transfer: number }
    reembolsado: { cash: number; transfer: number }
    confirmado: { cash: number; transfer: number }
    // Estados en inglés (legacy - para compatibilidad)
    pending_manual?: { cash: number; transfer: number }
    pending_transfer_proof?: { cash: number; transfer: number }
    pending_transfer_confirmation?: { cash: number; transfer: number }
    paid?: { cash: number; transfer: number }
    cancelled?: { cash: number; transfer: number }
    refunded?: { cash: number; transfer: number }
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrdersCount, setTotalOrdersCount] = useState(0)
  const [updating, setUpdating] = useState(false)
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)

  // Initialize orderStats with the new structure including payment method breakdown
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    revenue: 0,
    byStatusAndPaymentMethod: {
      pendiente_manual: { cash: 0, transfer: 0 },
      pendiente_comprobante_transferencia: { cash: 0, transfer: 0 },
      pendiente_confirmacion_transferencia: { cash: 0, transfer: 0 },
      pagado: { cash: 0, transfer: 0 },
      cancelado: { cash: 0, transfer: 0 },
      reembolsado: { cash: 0, transfer: 0 },
      confirmado: { cash: 0, transfer: 0 },
    },
  })

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (isMounted) {
        console.log(`🔄 useEffect triggered - Page: ${currentPage}, Status: ${statusFilter}`)
        try {
          await retryLoadOrders()
        } catch (error) {
          console.error("❌ Failed to load orders after retries:", error)
        }
      }
    }

    loadData()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [currentPage, statusFilter])

  const loadOrders = async () => {
    try {
      console.log(`🔄 Cargando órdenes - Página: ${currentPage}, Filtro: ${statusFilter}`)
      setLoading(true)

      // Clear any existing data to show loading state properly
      setOrders([])
      setTotalOrdersCount(0)
      setTotalPages(1)

      const [ordersResponse, summaryResponse] = await Promise.all([
        apiService.getAllOrders(currentPage, 20, statusFilter === "all" ? undefined : statusFilter),
        apiService.getOrdersSummary(),
      ])

      console.log("📦 Respuesta de órdenes:", {
        orders: ordersResponse?.orders?.length || 0,
        totalOrders: ordersResponse?.totalOrders || 0,
        currentPage,
        statusFilter,
      })

      console.log("📊 Respuesta de resumen:", {
        totalOrders: summaryResponse?.summary?.totalOrders || 0,
        revenue: summaryResponse?.summary?.totalRevenue || 0,
      })

      // Validate responses
      if (!ordersResponse || !summaryResponse) {
        throw new Error("Respuesta inválida del servidor")
      }

      // Set orders data
      const ordersData = (ordersResponse.orders || []).map((order: Order) => ({
        ...order,
      }));
      const totalCount = ordersResponse.totalOrders || 0
      const calculatedPages = Math.ceil(totalCount / 20)

      setOrders(ordersData)
      setTotalOrdersCount(totalCount)
      setTotalPages(calculatedPages)

      // Process summary data with payment method breakdown
      if (summaryResponse.summary) {
        setOrderStats({
          total: summaryResponse.summary.totalOrders || 0,
          revenue: summaryResponse.summary.totalRevenue || 0,
          byStatusAndPaymentMethod: summaryResponse.summary.summaryByStatusAndPaymentMethod || {
            pendiente_manual: { cash: 0, transfer: 0 },
            pendiente_comprobante_transferencia: { cash: 0, transfer: 0 },
            pendiente_confirmacion_transferencia: { cash: 0, transfer: 0 },
            pagado: { cash: 0, transfer: 0 },
            cancelado: { cash: 0, transfer: 0 },
            reembolsado: { cash: 0, transfer: 0 },
            confirmado: { cash: 0, transfer: 0 },
          },
        })
      }

      console.log(`✅ Órdenes cargadas exitosamente: ${ordersData.length} órdenes`)
    } catch (error: unknown) {
      // Type 'error' as unknown
      console.error("❌ Error loading orders:", error)

      // Show user-friendly error
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast.error(`Error al cargar las órdenes: ${errorMessage}`)

      // Reset to safe state
      setOrders([])
      setTotalOrdersCount(0)
      setTotalPages(1)
      setOrderStats({
        total: 0,
        revenue: 0,
        byStatusAndPaymentMethod: {
          pendiente_manual: { cash: 0, transfer: 0 },
          pendiente_comprobante_transferencia: { cash: 0, transfer: 0 },
          pendiente_confirmacion_transferencia: { cash: 0, transfer: 0 },
          pagado: { cash: 0, transfer: 0 },
          cancelado: { cash: 0, transfer: 0 },
          reembolsado: { cash: 0, transfer: 0 },
          confirmado: { cash: 0, transfer: 0 },
        },
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para reintentar la carga con delay
  const retryLoadOrders = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await loadOrders()
        return // Success, exit retry loop
      } catch (error) {
        console.warn(`⚠️ Intento ${i + 1} fallido, reintentando en ${delay}ms...`)
        if (i === retries - 1) {
          throw error // Last attempt failed
        }
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
  }

  const updateOrderStatus = async (
    orderId: string,
    newStatus:
      | "pendiente_manual"
      | "pendiente_comprobante_transferencia"
      | "pendiente_confirmacion_transferencia"
      | "pagado"
      | "cancelado"
      | "reembolsado"
      | "confirmado",
    adminNotes = "",
  ) => {
    // Explicitly type newStatus
    try {
      setUpdating(true)
      console.log(`🔄 Actualizando estado de orden ${orderId} a ${newStatus}`)

      await apiService.updateOrderStatus(orderId, newStatus, adminNotes)

      // Clear cache and reload orders
      apiService.clearOrdersCache()
      await loadOrders()

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, estado: newStatus, notasAdmin: adminNotes })
      }

      console.log(`✅ Estado de orden actualizado exitosamente`)
      // Solo mostrar toast si no es una carga automática
      if (!loading) {
        toast.success(`Estado actualizado a "${newStatus}" correctamente`)
      }
    } catch (error: unknown) {
      // Type 'error' as unknown
      console.error("❌ Error updating order status:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast.error(`Error al actualizar estado: ${errorMessage}`)
    } finally {
      setUpdating(false)
    }
  }

  const deleteOrder = async (orderId: string) => {
    setDeletingOrderId(orderId);
    let confirmed = false;
    try {
      confirmed = window.confirm(`¿Estás seguro de que quieres eliminar la orden #${orderId}? Esta acción es irreversible.`);
      if (confirmed) {
        await apiService.deleteOrder(orderId);
        apiService.clearOrdersCache();
        await loadOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setShowDetails(false);
          setSelectedOrder(null);
        }
        toast.success(`Orden #${orderId} eliminada exitosamente`);
      }
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al eliminar la orden: ${errorMessage}`);
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Enhanced getStatusBadge with clearer, more understandable names
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string; text: string; icon: React.ElementType }> = {
      pendiente_manual: {
        class: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        text: "Pendiente (Efectivo)",
        icon: Clock,
      },
      pendiente_comprobante_transferencia: {
        class: "bg-orange-500/20 text-orange-300 border-orange-500/40",
        text: "Pendiente (Falta Comprobante)",
        icon: ImageIcon,
      },
      pendiente_confirmacion_transferencia: {
        class: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        text: "Pendiente (Verificar Comprobante)",
        icon: CreditCard,
      },
      pagado: {
        class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        text: "Pagado",
        icon: CheckCircle,
      },
      cancelado: {
        class: "bg-red-500/20 text-red-300 border-red-500/40",
        text: "Cancelado",
        icon: XCircle,
      },
      reembolsado: {
        class: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        text: "Reembolsado",
        icon: RefreshCw,
      },
      confirmado: {
        class: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        text: "Confirmado",
        icon: ClipboardCheck,
      },
    }

    const config = statusConfig[status] || statusConfig.pendiente_manual
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.class}`}>
        <Icon className="h-3 w-3 mr-1.5" />
        {config.text}
      </span>
    )
  }

  // Enhanced payment method badge with icons
  const getPaymentMethodBadge = (method: string) => {
    if (method === "efectivo") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-600/40">
          <Banknote className="h-3 w-3 mr-1" />
          Efectivo
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-600/40">
          <Building2 className="h-3 w-3 mr-1" />
          Transferencia
        </span>
      )
    }
  }

  // Function to get row background color based on payment method
  const getRowBackgroundClass = (paymentMethod: string) => {
    if (paymentMethod === "efectivo") {
      return "bg-gradient-to-r from-green-900/10 via-green-800/5 to-transparent border-l-2 border-green-600/30"
    } else {
      return "bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-transparent border-l-2 border-blue-600/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.infoEnvio.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.infoEnvio.correo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = dateFilter === "" || new Date(order.createdAt).toISOString().split("T")[0] === dateFilter

    return matchesSearch && matchesDate
  })

  // Función helper para manejar compatibilidad entre estados antiguos y nuevos
  const getOrderStats = (orderStats: OrderStats) => {
    const stats = orderStats.byStatusAndPaymentMethod;
    
    return {
      pendiente_manual: {
        cash: stats.pendiente_manual?.cash || stats.pending_manual?.cash || 0,
        transfer: stats.pendiente_manual?.transfer || stats.pending_manual?.transfer || 0,
      },
      pendiente_comprobante_transferencia: {
        cash: stats.pendiente_comprobante_transferencia?.cash || stats.pending_transfer_proof?.cash || 0,
        transfer: stats.pendiente_comprobante_transferencia?.transfer || stats.pending_transfer_proof?.transfer || 0,
      },
      pendiente_confirmacion_transferencia: {
        cash: stats.pendiente_confirmacion_transferencia?.cash || stats.pending_transfer_confirmation?.cash || 0,
        transfer: stats.pendiente_confirmacion_transferencia?.transfer || stats.pending_transfer_confirmation?.transfer || 0,
      },
      pagado: {
        cash: stats.pagado?.cash || stats.paid?.cash || 0,
        transfer: stats.pagado?.transfer || stats.paid?.transfer || 0,
      },
      cancelado: {
        cash: stats.cancelado?.cash || stats.cancelled?.cash || 0,
        transfer: stats.cancelado?.transfer || stats.cancelled?.transfer || 0,
      },
      reembolsado: {
        cash: stats.reembolsado?.cash || stats.refunded?.cash || 0,
        transfer: stats.reembolsado?.transfer || stats.refunded?.transfer || 0,
      },
      confirmado: {
        cash: stats.confirmado?.cash || 0,
        transfer: stats.confirmado?.transfer || 0,
      },
    };
  };

  // Function to render payment method summary cards
  const renderPaymentMethodCards = () => {
    const normalizedStats = getOrderStats(orderStats);
    
    const cashStats = {
      pendiente_manual: normalizedStats.pendiente_manual.cash,
      pendiente_comprobante_transferencia: normalizedStats.pendiente_comprobante_transferencia.cash,
      pendiente_confirmacion_transferencia: normalizedStats.pendiente_confirmacion_transferencia.cash,
      pagado: normalizedStats.pagado.cash,
      cancelado: normalizedStats.cancelado.cash,
      reembolsado: normalizedStats.reembolsado.cash,
      confirmado: normalizedStats.confirmado.cash,
    }

    const transferStats = {
      pendiente_manual: normalizedStats.pendiente_manual.transfer,
      pendiente_comprobante_transferencia: normalizedStats.pendiente_comprobante_transferencia.transfer,
      pendiente_confirmacion_transferencia: normalizedStats.pendiente_confirmacion_transferencia.transfer,
      pagado: normalizedStats.pagado.transfer,
      cancelado: normalizedStats.cancelado.transfer,
      reembolsado: normalizedStats.reembolsado.transfer,
      confirmado: normalizedStats.confirmado.transfer,
    }

    const cashTotal = Object.values(cashStats).reduce((sum, count) => sum + count, 0)
    const transferTotal = Object.values(transferStats).reduce((sum, count) => sum + count, 0)

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cash Payment Card */}
        <div className="bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-700/5 border border-green-600/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600/20 rounded-xl border border-green-500/30">
                <Banknote className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-300">Pagos en Efectivo</h3>
                <p className="text-sm text-green-400/80">Total: {cashTotal} órdenes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-300">{cashTotal}</div>
              <div className="text-xs text-green-400/70">órdenes totales</div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Status breakdown for cash */}
            {cashStats.pendiente_manual > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-800/10 rounded-lg border border-green-700/20">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-green-200">Pendiente</span>
                </div>
                <span className="text-lg font-bold text-green-300">{cashStats.pendiente_manual}</span>
              </div>
            )}

            {cashStats.pagado > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-800/10 rounded-lg border border-green-700/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-green-200">Pagado</span>
                </div>
                <span className="text-lg font-bold text-green-300">{cashStats.pagado}</span>
              </div>
            )}

            {cashStats.cancelado > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-800/10 rounded-lg border border-green-700/20">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-green-200">Cancelado</span>
                </div>
                <span className="text-lg font-bold text-green-300">{cashStats.cancelado}</span>
              </div>
            )}

            {cashStats.reembolsado > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-800/10 rounded-lg border border-green-700/20">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-green-200">Reembolsado</span>
                </div>
                <span className="text-lg font-bold text-green-300">{cashStats.reembolsado}</span>
              </div>
            )}

            {cashStats.confirmado > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-800/10 rounded-lg border border-green-700/20">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-green-200">Confirmado</span>
                </div>
                <span className="text-lg font-bold text-green-300">{cashStats.confirmado}</span>
              </div>
            )}

            {cashTotal === 0 && (
              <div className="text-center py-8">
                <div className="text-green-400/50 text-sm">No hay órdenes en efectivo</div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Payment Card */}
        <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-blue-700/5 border border-blue-600/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-300">Pagos por Transferencia</h3>
                <p className="text-sm text-blue-400/80">Total: {transferTotal} órdenes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-300">{transferTotal}</div>
              <div className="text-xs text-blue-400/70">órdenes totales</div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Status breakdown for transfers */}
            {transferStats.pendiente_manual > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-blue-200">Pendiente Confirmación</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.pendiente_manual}</span>
              </div>
            )}

            {transferStats.pendiente_comprobante_transferencia > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-blue-200">Pendiente (Falta Comprobante)</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.pendiente_comprobante_transferencia}</span>
              </div>
            )}

            {transferStats.pendiente_confirmacion_transferencia > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-blue-200">Pendiente (Verificar Comprobante)</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.pendiente_confirmacion_transferencia}</span>
              </div>
            )}

            {transferStats.pagado > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-blue-200">Pagado</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.pagado}</span>
              </div>
            )}

            {transferStats.cancelado > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-blue-200">Cancelado</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.cancelado}</span>
              </div>
            )}

            {transferStats.reembolsado > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-200">Reembolsado</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.reembolsado}</span>
              </div>
            )}

            {transferStats.confirmado > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-800/10 rounded-lg border border-blue-700/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-200">Confirmado</span>
                </div>
                <span className="text-lg font-bold text-blue-300">{transferStats.confirmado}</span>
              </div>
            )}

            {transferTotal === 0 && (
              <div className="text-center py-8">
                <div className="text-blue-400/50 text-sm">No hay órdenes por transferencia</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Mapeo seguro para detalles de orden
  let orderDetails: Order | null = null;
  if (showDetails && selectedOrder) {
    orderDetails = selectedOrder;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Órdenes</h1>
            <p className="mt-2 text-gray-400">Administra y supervisa todas las órdenes de compra</p>
          </div>
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 self-start sm:self-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Orders Card */}
          <div className="admin-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl shadow-sm">
                <ShoppingBag className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{orderStats.total}</p>
                <p className="text-sm text-blue-300 font-medium">Total Órdenes</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="admin-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl shadow-sm">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">${orderStats.revenue.toLocaleString()}</p>
                <p className="text-sm text-purple-300 font-medium">Ingresos Totales</p>
              </div>
            </div>
          </div>

          {/* Growth Indicator */}
          <div className="admin-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500/20 rounded-xl shadow-sm">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                                  <p className="text-2xl font-bold text-white">
                    {getOrderStats(orderStats).pagado.cash + getOrderStats(orderStats).pagado.transfer}
                  </p>
                <p className="text-sm text-emerald-300 font-medium">Órdenes Completadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Summary Cards */}
        {renderPaymentMethodCards()}

        {/* Enhanced Filters */}
        <div className="admin-card p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por orden, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="admin-input"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente_manual">Pendiente Confirmación</option>
                <option value="pendiente_comprobante_transferencia">Esperando Comprobante</option>
                <option value="pendiente_confirmacion_transferencia">Verificando Pago</option>
                <option value="pagado">Pagadas</option>
                <option value="cancelado">Canceladas</option>
                <option value="reembolsado">Reembolsadas</option>
                <option value="confirmado">Confirmadas</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="admin-input"
              />
            </div>

            <button
              onClick={async () => {
                console.log("🔄 Refresh manual iniciado")
                
                // Clear API cache first
                apiService.clearCache()

                // Reset pagination to first page
                setCurrentPage(1)

                // Force reload
                await retryLoadOrders()
              }}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {/* Enhanced Orders Table with Payment Method Visual Distinction */}
        <div className="admin-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No hay órdenes</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm || dateFilter
                  ? "No se encontraron órdenes con los filtros aplicados."
                  : "No hay órdenes con este estado."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total & Pago
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className={`hover:bg-gray-800/50 transition-all duration-200 ${getRowBackgroundClass(
                        order.metodoPago,
                      )}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 border border-blue-600/30">
                            <Package className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">#{order.numeroOrden}</div>
                            <div className="text-xs text-gray-400">{order.items.length} productos</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 font-medium">{order.infoEnvio?.nombreCompleto || <span className="text-gray-400 italic">Sin nombre</span>}</div>
                        <div className="text-xs text-gray-400">{order.infoEnvio?.correo || <span className="italic">Sin email</span>}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-bold">${order.total.toLocaleString()}</div>
                        <div className="mt-1">{getPaymentMethodBadge(order.metodoPago)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.estado)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Link>
                          
                          {/* Botón Pagado - solo visible cuando el estado es "confirmado" */}
                          {order.estado === "confirmado" && (
                            <button
                              onClick={() => updateOrderStatus(order._id, "pagado")}
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg hover:bg-emerald-600/30 transition-all duration-200 text-sm font-medium"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Pagado
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteOrder(order._id)}
                            disabled={!!deletingOrderId && deletingOrderId === order._id}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                          >
                            {deletingOrderId === order._id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                Eliminando...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="admin-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Mostrando {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalOrdersCount)} de{" "}
                {totalOrdersCount} órdenes
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Anterior
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600/30 text-blue-400 border border-blue-600/50"
                            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && orderDetails && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal max-w-4xl">
              <div className="admin-modal-header">
                <h3 className="text-lg font-medium text-white">Orden #{orderDetails.numeroOrden}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="admin-modal-body max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-white border-b border-gray-600 pb-2">Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Nombre:</span>{" "}
                        <span className="text-white">{orderDetails.infoEnvio?.nombreCompleto || <span className="text-gray-400 italic">Sin nombre</span>}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>{" "}
                        <span className="text-white">{orderDetails.infoEnvio?.correo || <span className="text-gray-400 italic">Sin email</span>}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Teléfono:</span>{" "}
                        <span className="text-white">{orderDetails.infoEnvio?.telefono || <span className="text-gray-400 italic">Sin teléfono</span>}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Dirección:</span>{" "}
                        <span className="text-white">{orderDetails.infoEnvio?.direccion || <span className="text-gray-400 italic">Sin dirección</span>}{orderDetails.infoEnvio?.ciudad ? `, ${orderDetails.infoEnvio.ciudad}` : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-white border-b border-gray-600 pb-2">Orden</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Fecha:</span>{" "}
                        <span className="text-white">{formatDate(orderDetails.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Pago:</span> {getPaymentMethodBadge(orderDetails.metodoPago)}
                      </div>
                      <div>
                        <span className="text-gray-400">Estado:</span> {getStatusBadge(orderDetails.estado)}
                      </div>
                      <div>
                        <span className="text-gray-400">Total:</span>{" "}
                        <span className="text-white font-medium">${orderDetails.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6">
                  <h4 className="font-medium text-white border-b border-gray-600 pb-2 mb-4">Productos</h4>
                  <div className="space-y-3">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-600 mr-3"
                            src={item.imagen || "/placeholder.svg?height=48&width=48"}
                            alt={item.nombre}
                          />
                          <div>
                            <div className="text-sm font-medium text-white">{item.nombre}</div>
                            <div className="text-xs text-gray-400">
                              Cantidad: {item.cantidad}
                              {item.volumen && ` | Volumen: ${item.volumen.ml}`}
                              {item.tipo && ` | Tipo: ${item.tipo}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-white">
                          ${(item.volumen.precio * item.cantidad).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Status */}
                <div className="mt-6 p-4 bg-gray-900/30 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Actualizar Estado</h4>
                  <div className="flex items-center space-x-3">
                    <select
                      value={orderDetails.estado}
                      onChange={(e) => updateOrderStatus(orderDetails._id, e.target.value as Order["estado"])}
                      disabled={updating}
                      className="admin-input disabled:opacity-50"
                    >
                      <option value="pendiente_manual">Pendiente Confirmación</option>
                      <option value="pendiente_comprobante_transferencia">Esperando Comprobante</option>
                      <option value="pendiente_confirmacion_transferencia">Verificando Pago</option>
                      <option value="pagado">Pagado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="reembolsado">Reembolsado</option>
                      <option value="confirmado">Confirmado</option>
                    </select>
                    <span className="text-sm text-gray-400">Estado actual: {getStatusBadge(orderDetails.estado)}</span>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
