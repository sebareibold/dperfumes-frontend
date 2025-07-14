// Este archivo se comporta como un manager de la API, de tal manera que únicamente los subsistemas del front se comunican con él.
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://dperfumes-backend-production.up.railway.app/apis"

// Cache para las respuestas de la API
const apiCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Control de rate limiting simplificado
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 segundo entre peticiones
let isRateLimited = false
let rateLimitUntil = 0

// Función para hacer peticiones con rate limiting
const makeRequest = async (url: string, method: string, data?: unknown, params?: unknown) => {
  const now = Date.now()
  
  // Verificar si estamos en rate limiting
  if (isRateLimited && now < rateLimitUntil) {
    const waitTime = rateLimitUntil - now
    console.log(`⏳ Rate limit activo. Esperando ${Math.ceil(waitTime / 1000)} segundos...`)
    await new Promise((res) => setTimeout(res, waitTime))
    isRateLimited = false
    rateLimitUntil = 0
  }
  
  // Asegurar intervalo mínimo entre peticiones
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - (now - lastRequestTime)
    await new Promise((res) => setTimeout(res, waitTime))
  }
  
  lastRequestTime = Date.now()

  const config = {
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }

  try {
    console.log(`📡 Haciendo petición ${method.toUpperCase()} a ${url}`)
    const response = await axios(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`❌ Error ${error.response.status} en ${method} ${url}:`, error.response.data)
      
      // Manejar específicamente el error 429 (Too Many Requests)
      if (error.response.status === 429) {
        const retryAfter = error.response.data.retryAfter || 900
        isRateLimited = true
        rateLimitUntil = Date.now() + (retryAfter * 1000)
        
        console.warn(`🚫 Rate limit alcanzado. Esperando ${retryAfter} segundos.`)
        throw new Error(`Rate limit alcanzado. Intenta de nuevo en ${Math.ceil(retryAfter / 60)} minutos.`)
      }
      
      throw new Error(error.response.data.message || `Error en la petición: ${error.response.status}`)
    } else {
      console.error(`❌ Error desconocido en ${method} ${url}:`, error)
      throw new Error("Error de red o desconocido")
    }
  }
}

// Interfaces para perfumes
interface PerfumeVolume {
  ml: string
  precio: number
}

interface Perfume {
  _id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  stock: number
  status: boolean
  volumen: PerfumeVolume[]
  notasAromaticas: string[]
  imagenes: string[]
  descripcionDupe?: string
  tipo: "vidrio" | "plastico"
  createdAt?: string
  updatedAt?: string
  estado: boolean
}

interface PerfumeCreateData {
  nombre: string
  descripcion: string
  categoria: string
  volumen: PerfumeVolume[]
  stock: number
  imagenes: string[]
  descripcionDupe?: string
  tipo: "vidrio" | "plastico"
  notasAromaticas: string[]
  estado: boolean
}

export const apiService = {
  // Limpiar todo el caché
  clearCache: () => {
    apiCache.clear()
    console.log("🗑️ Caché de API limpiado.")
  },

  // Limpiar caché de perfumes
  clearPerfumesCache: () => {
    for (const key of apiCache.keys()) {
      if (key.startsWith("/products")) {
        apiCache.delete(key)
      }
    }
    console.log("🗑️ Caché de perfumes limpiado.")
  },

  // Limpiar caché de órdenes
  clearOrdersCache: () => {
    for (const key of apiCache.keys()) {
      if (key.startsWith("/orders")) {
        apiCache.delete(key)
      }
    }
    console.log("🗑️ Caché de órdenes limpiado.")
  },

  // Limpiar caché de contenido del sitio
  clearSiteContentCache: () => {
    for (const key of apiCache.keys()) {
      if (key.startsWith("/content")) {
        apiCache.delete(key)
      }
    }
    console.log("🗑️ Caché de contenido del sitio limpiado.")
  },

  // Función genérica para hacer peticiones GET con caché
  get: async (url: string, params?: Record<string, unknown>) => {
    const cacheKey = `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`
    const cached = apiCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`⚡ Usando caché para GET ${url}`)
      return cached.data
    }

    try {
      const response = await makeRequest(url, "get", undefined, params)
      apiCache.set(cacheKey, { data: response, timestamp: Date.now() })
      return response
    } catch (error) {
      console.error(`Error en GET ${url}:`, error)
      throw error
    }
  },

  // Función genérica para hacer peticiones POST
  post: async (url: string, data?: Record<string, unknown>) => {
    try {
      const response = await makeRequest(url, "post", data)
      // Invalidar caché relevante después de un POST
      if (url.startsWith("/products")) apiService.clearPerfumesCache()
      if (url.startsWith("/orders")) apiService.clearOrdersCache()
      if (url.startsWith("/content")) apiService.clearSiteContentCache()
      return response
    } catch (error) {
      console.error(`Error en POST ${url}:`, error)
      throw error
    }
  },

  // Función genérica para hacer peticiones PUT
  put: async (url: string, data?: Record<string, unknown>) => {
    try {
      const response = await makeRequest(url, "put", data)
      // Invalidar caché relevante después de un PUT
      if (url.startsWith("/products")) apiService.clearPerfumesCache()
      if (url.startsWith("/orders")) apiService.clearOrdersCache()
      if (url.startsWith("/content")) apiService.clearSiteContentCache()
      return response
    } catch (error) {
      console.error(`Error en PUT ${url}:`, error)
      throw error
    }
  },

  // Función genérica para hacer peticiones DELETE
  del: async (url: string) => {
    try {
      const response = await makeRequest(url, "delete")
      // Invalidar caché relevante después de un DELETE
      if (url.startsWith("/products")) apiService.clearPerfumesCache()
      if (url.startsWith("/orders")) apiService.clearOrdersCache()
      if (url.startsWith("/content")) apiService.clearSiteContentCache()
      return response
    } catch (error) {
      console.error(`Error en DELETE ${url}:`, error)
      throw error
    }
  },

  // Auth Endpoints
  login: async (credentials: Record<string, unknown>) => {
    try {
      const response = (await apiService.post("/auth/login", credentials)) as Record<string, unknown>
      if (response.token) {
        localStorage.setItem("token", response.token as string)
      }
      return { success: true, user: response.user, token: response.token }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error de credenciales"
          : "Error desconocido",
      }
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    // No hay endpoint de logout en el backend, solo se limpia el token local
    return { success: true }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return { success: false, user: null }
    }
    try {
      const response = (await apiService.get("/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      })) as Record<string, unknown>
      return { success: true, user: response.user }
    } catch (error: unknown) {
      console.error("Error checking auth:", error)
      localStorage.removeItem("token")
      return { success: false, user: null }
    }
  },

  // User Profile Endpoints
  updateProfile: async (profileData: Record<string, unknown>) => {
    try {
      const response = (await apiService.put("/users/profile", profileData)) as Record<string, unknown>
      return { success: true, user: response.user }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al actualizar perfil"
          : "Error desconocido",
      }
    }
  },

  updatePassword: async (passwordData: Record<string, unknown>) => {
    try {
      const response = (await apiService.put("/users/password", passwordData)) as Record<string, unknown>
      return { success: true, message: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al actualizar contraseña"
          : "Error desconocido",
      }
    }
  },

  // Perfume Endpoints (actualizados para el esquema de perfumes)
  getProducts: async (params?: Record<string, unknown>) => {
    try {
      const response = (await apiService.get("/products", params)) as Record<string, unknown>
      return {
        success: response.status === "success",
        payload: response.payload as Perfume[],
        totalPages: response.totalPages,
        totalProducts: response.totalDocs,
        page: response.page,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener perfumes"
          : "Error desconocido",
        payload: [],
        totalPages: 0,
        totalProducts: 0,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = (await apiService.get(`/products/${id}`)) as Record<string, unknown>
      return { success: true, product: response.product as Perfume }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener perfume"
          : "Error desconocido",
      }
    }
  },

  createProduct: async (productData: PerfumeCreateData) => {
    try {
      const response = await apiService.post("/products", { ...productData }) as Perfume;
      return { success: true, product: response }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al crear perfume"
          : "Error desconocido",
      }
    }
  },

  updateProduct: async (id: string, productData: Partial<PerfumeCreateData>) => {
    try {
      const response = await apiService.put(`/products/${id}`, productData) as Perfume
      return { success: true, product: response }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al actualizar perfume"
          : "Error desconocido",
      }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = (await apiService.del(`/products/${id}`)) as any
      return { success: true, message: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al eliminar perfume"
          : "Error desconocido",
      }
    }
  },

  // Obtener perfumes más vistos
  getMostViewedProducts: async (limit: number) => {
    try {
      const response = (await apiService.get("/products/most-viewed", { limit })) as any
      return { success: true, products: response.products }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener perfumes más vistos"
          : "Error desconocido",
        products: [],
      }
    }
  },

  // Order Endpoints
  createOrder: async (orderData: any) => {
    try {
      const response = (await apiService.post("/orders", orderData)) as any
      return { success: true, order: response.order }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al crear orden"
          : "Error desconocido",
      }
    }
  },

  getOrder: async (id: string) => {
    try {
      const response = (await apiService.get(`/orders/${id}`)) as any
      return { success: true, order: response.order }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener orden"
          : "Error desconocido",
      }
    }
  },

  getAllOrders: async (page = 1, limit = 10, status?: string) => {
    try {
      const params = { page, limit, ...(status && { status }) }
      const response = (await apiService.get("/orders", params)) as any
      return {
        success: true,
        orders: response.orders,
        totalOrders: response.totalOrders,
        totalPages: response.totalPages,
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener órdenes"
          : "Error desconocido",
        orders: [],
        totalOrders: 0,
        totalPages: 0,
      }
    }
  },

  updateOrderStatus: async (id: string, status: string, adminNotes: string) => {
    try {
      const response = (await apiService.put(`/orders/${id}/status`, { status, adminNotes })) as any
      return { success: true, order: response.order }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al actualizar estado de orden"
          : "Error desconocido",
      }
    }
  },

  deleteOrder: async (id: string) => {
    try {
      const response = (await apiService.del(`/orders/${id}`)) as any
      return { success: true, message: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al eliminar orden"
          : "Error desconocido",
      }
    }
  },

  getOrdersSummary: async () => {
    try {
      const response = (await apiService.get("/orders/summary")) as any
      return { success: true, summary: response.summary }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener resumen de órdenes"
          : "Error desconocido",
      }
    }
  },

  // Site Content Endpoints
  getSiteContent: async () => {
    try {
      const response = (await apiService.get("/content")) as any
      return { success: true, content: response.content }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener contenido del sitio"
          : "Error desconocido",
      }
    }
  },

  updateSiteContent: async (contentData: any) => {
    try {
      const response = (await apiService.put("/content", contentData)) as any
      return { success: true, content: response.content }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al actualizar contenido del sitio"
          : "Error desconocido",
      }
    }
  },

  // Interaction Endpoints
  createInteraction: async (type: string, data: any) => {
    try {
      const response = (await apiService.post("/interactions", { type, data })) as any
      return { success: true, interaction: response.interaction }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al registrar interacción"
          : "Error desconocido",
      }
    }
  },

  getInteractionsSummary: async () => {
    try {
      const response = (await apiService.get("/interactions/summary")) as any
      return { success: true, summary: response.summary }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener resumen de interacciones"
          : "Error desconocido",
      }
    }
  },

  getMostViewedCategories: async (limit: number) => {
    try {
      const response = (await apiService.get("/interactions/most-viewed-categories", { limit })) as any
      return { success: true, categories: response.categories }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener categorías más vistas"
          : "Error desconocido",
        categories: [],
      }
    }
  },

  // File Upload Endpoints
  uploadTransferProof: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(`${API_BASE_URL}/upload/transfer-proof`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return { success: true, url: response.data.url, filename: response.data.filename }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al subir archivo"
          : "Error desconocido",
      }
    }
  },

  // Contact Form Endpoint
  sendContactForm: async (formData: any) => {
    try {
      const response = (await apiService.post("/contact", formData)) as any
      return { success: true, message: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al enviar formulario de contacto"
          : "Error desconocido",
      }
    }
  },

  // Order by Order Number Endpoint
  getOrderByOrderNumber: async (orderNumber: string) => {
    try {
      const response = (await apiService.get(`/orders/by-number/${orderNumber}`)) as any
      return { success: true, order: response.order }
    } catch (error: unknown) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al obtener orden por número"
          : "Error desconocido",
      }
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return response.data
    } catch (error) {
      console.error("Health check failed:", error)
      return null
    }
  },
}
