"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, ChevronLeft, Clock } from "lucide-react"
import { apiService } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"

interface ProductForm {
  nombre: string
  descripcion: string
  precio: number | string
  stock: number | string
  categoria: string
  volumen: { ml: string; precio: number }[]
  notasAromaticas: string[]
  imagenes: string[]
  descripcionDupe?: string
  tipo: ("vidrio" | "plastico")[]
  envases?: string[]
  estado: boolean
}

interface Category {
  name: string
  display_name: string
}

// Notas aromáticas comunes sugeridas
const NOTAS_COMUNES = [
  "Floral", "Amaderado", "Cítrico", "Frutal", "Oriental", "Especiado", "Verde", "Acuático", "Dulce", "Polvoroso", "Herbal", "Almizclado", "Gourmand", "Fresco", "Ámbar", "Cuero"
]

// Función para formatear número a miles con punto y coma decimal
function formatPrecioES(value: string | number) {
  if (value === '' || value === null || value === undefined) return ''
  const [entero, decimal] = String(value).replace(/\./g, ',').split(',')
  const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return decimal !== undefined ? `${enteroFormateado},${decimal}` : enteroFormateado
}

// 1. Definir el tipo Envase
interface Envase {
  _id: string;
  tipo: 'vidrio' | 'plastico';
  volumen: number;
  precio: number;
  stock: number;
}

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [form, setForm] = useState<ProductForm>({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    volumen: [],
    notasAromaticas: [],
    imagenes: [""],
    descripcionDupe: "",
    tipo: [],
    envases: [],
    estado: true,
  })

  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  // Validación visual para notas aromáticas
  const [notasTouched, setNotasTouched] = useState(false)
  const notasInvalid = notasTouched && form.notasAromaticas.length === 0

  // Validación visual para categorías
  const [categoriasTouched, setCategoriasTouched] = useState(false)

  // 2. Usar Envase[] en el estado de envasesDisponibles
  const [envasesDisponibles, setEnvasesDisponibles] = useState<Envase[]>([])
  useEffect(() => {
    async function fetchEnvases() {
      try {
        const envs = await apiService.get('/envases')
        setEnvasesDisponibles(envs as Envase[])
      } catch (e) {
        // Opcional: manejar error
      }
    }
    fetchEnvases()
  }, [])

  // Verificar autenticación
  useEffect(() => {
    console.log("AdminProductForm - Verificando autenticación:", { user, isEditing, id })

    if (user && user.role !== "admin") {
      console.warn("AdminProductForm - Acceso denegado: Se requiere rol de administrador")
      navigate("/admin/login")
      return
    }

    if (isEditing && !id) {
      console.error("AdminProductForm - ID de producto requerido para edición")
      navigate("/admin/products")
      return
    }

    console.log("AdminProductForm - Autenticación verificada correctamente")
  }, [user, navigate, isEditing, id])

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("AdminProductForm - Cargando categorías...")
        setCategoriesLoading(true)
        setCategoriesError(null)

        const response = await apiService.getSiteContent()
        console.log("AdminProductForm - Respuesta de contenido:", response)

        if (response.success && response.content?.productCatalog?.categories) {
          setAvailableCategories(response.content.productCatalog.categories)
          console.log("AdminProductForm - Categorías cargadas:", response.content.productCatalog.categories.length)
        } else {
          // Si no hay categorías, usar categorías por defecto
          const defaultCategories = [
            { name: "electronics", display_name: "Electrónicos" },
            { name: "clothing", display_name: "Ropa" },
            { name: "books", display_name: "Libros" },
            { name: "home", display_name: "Hogar" },
            { name: "sports", display_name: "Deportes" },
            { name: "beauty", display_name: "Belleza" },
            { name: "toys", display_name: "Juguetes" },
            { name: "food", display_name: "Comida" },
            { name: "automotive", display_name: "Automotriz" },
          ]
          setAvailableCategories(defaultCategories)
          console.log("AdminProductForm - Usando categorías por defecto debido a:", response.error || "respuesta vacía")
        }
      } catch (err) {
        console.error("AdminProductForm - Error loading categories:", err)

        // En caso de error, usar categorías por defecto para no bloquear el formulario
        const defaultCategories = [
          { name: "electronics", display_name: "Electrónicos" },
          { name: "clothing", display_name: "Ropa" },
          { name: "books", display_name: "Libros" },
          { name: "home", display_name: "Hogar" },
          { name: "sports", display_name: "Deportes" },
          { name: "beauty", display_name: "Belleza" },
          { name: "toys", display_name: "Juguetes" },
          { name: "food", display_name: "Comida" },
          { name: "automotive", display_name: "Automotriz" },
        ]
        setAvailableCategories(defaultCategories)
        setCategoriesError("No se pudieron cargar las categorías del servidor. Usando categorías por defecto.")
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Cargar producto si es edición
  useEffect(() => {
    const loadProductData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true)
          console.log(`AdminProductForm - Cargando producto con ID: ${id}`)

          const response = await apiService.getProduct(id)
          console.log("AdminProductForm - Respuesta del producto:", response)

          if (response.success && response.product) {
            const product = response.product
            console.log("AdminProductForm - Datos del producto recibidos:", product)

            setForm({
              nombre: product.nombre || "",
              descripcion: product.descripcion || "",
              precio: product.precio !== undefined ? String(product.precio) : "",
              stock: product.stock !== undefined ? String(product.stock) : "",
              categoria: product.categoria || "",
              volumen: product.volumen && product.volumen.length > 0 ? product.volumen : product.volumen ? [{ ml: "0", precio: 0 }] : [],
              notasAromaticas: product.notasAromaticas || [],
              imagenes: product.imagenes && product.imagenes.length > 0 ? product.imagenes : [""],
              descripcionDupe: product.descripcionDupe || "",
              tipo: Array.isArray(product.tipo)
                ? product.tipo.filter((t: string) => t === "vidrio" || t === "plastico")
                : product.tipo === "vidrio" || product.tipo === "plastico"
                ? [product.tipo]
                : [],
              envases: product.envases && product.envases.length > 0 ? product.envases : undefined,
              estado: product.estado !== undefined ? product.estado : true,
            })
            console.log("AdminProductForm - Estado del formulario actualizado")
          } else {
            console.error("AdminProductForm - Error en la respuesta:", response)
            const errorMessage = response.error || "Error al cargar el producto"

            if (errorMessage.includes("no encontrado")) {
              alert("❌ El producto no existe o fue eliminado.")
            } else {
              alert(`❌ ${errorMessage}`)
            }

            navigate("/admin/products")
          }
        } catch (error) {
          console.error("AdminProductForm - Error loading product:", error)

          let errorMessage = "Error desconocido al cargar el producto"
          if (error instanceof Error) {
            errorMessage = error.message
          }

          alert(`❌ ${errorMessage}`)
          navigate("/admin/products")
        } finally {
          setLoading(false)
        }
      } else if (!isEditing) {
        // Reset form for create mode
        setForm({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          categoria: "",
          volumen: [],
          notasAromaticas: [],
          imagenes: [""],
          descripcionDupe: "",
          tipo: [],
          envases: [],
          estado: true,
        })
      }
    }

    loadProductData()
  }, [id, isEditing, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let newValue: string | number = value
    if (name === 'precio' || name === 'stock') {
      // Eliminar puntos y cambiar coma por punto para parsear
      const clean = value.replace(/\./g, '').replace(',', '.')
      newValue = clean === '' ? '' : clean
    }
    console.log(`AdminProductForm - Cambio en campo '${name}':`, newValue)
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  // 1. Agrego estado para la URL de imagen y error
  const [nuevaImagen, setNuevaImagen] = useState("");
  const [errorImagen, setErrorImagen] = useState("");

  // 2. Función para validar URL
  function esUrlValida(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // 3. Función para agregar imagen
  const agregarImagen = () => {
    if (!nuevaImagen.trim()) return;
    if (!esUrlValida(nuevaImagen)) {
      setErrorImagen("URL no válida");
      return;
    }
    setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, nuevaImagen.trim()] }));
    setNuevaImagen("");
    setErrorImagen("");
  };

  // 4. Función para eliminar imagen
  const eliminarImagen = (index: number) => {
    setForm((prev) => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('AdminProductForm - handleSubmit ejecutado. Form:', form)
    // Validaciones mejoradas
    const errors: string[] = []

    if (!form.nombre.trim()) errors.push("El nombre es requerido")
    if (!form.descripcion.trim()) errors.push("La descripción es requerida")
    if (!form.categoria) errors.push("La categoría es requerida")
    if (form.imagenes.every((thumb) => !thumb.trim())) errors.push("Debe incluir al menos una imagen")

    // Validar que la categoría existe
    if (form.categoria && !availableCategories.some((cat) => cat.name === form.categoria)) {
      errors.push("La categoría seleccionada no es válida")
    }

    // Validar URLs de imágenes
    const invalidImages = form.imagenes.filter((thumb) => {
      if (!thumb.trim()) return false
      try {
        new URL(thumb)
        return false
      } catch {
        return true
      }
    })

    if (invalidImages.length > 0) {
      errors.push("Algunas URLs de imágenes no son válidas")
    }

    if (errors.length > 0) {
      alert(`❌ Errores de validación:\n\n${errors.map((err) => `• ${err}`).join("\n")}`)
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      setSaving(true)
      setRateLimited(false)
      const { tipo, ...formWithoutTipo } = form;
      console.log('Enviando producto con estado:', typeof form.estado, form.estado);
      const productData = {
        ...formWithoutTipo,
        precio: Number(form.precio),
        stock: Number(form.stock || 0),
        volumen: form.volumen.map((vol) => ({
          ml: vol.ml,
          precio: Number(vol.precio),
        })),
        notasAromaticas: form.notasAromaticas,
        imagenes: form.imagenes.filter((thumb) => thumb.trim() !== ""),
        descripcionDupe: form.descripcionDupe || "",
        envases: form.envases || [],
        estado: !!form.estado,
        tipo: 'vidrio' as 'vidrio' | 'plastico',
      }
      console.log('AdminProductForm - handleConfirmSubmit. Datos a enviar:', productData)
      if (isEditing && id) {
        const resp = await apiService.updateProduct(id, productData)
        console.log('AdminProductForm - Respuesta updateProduct:', resp)
      } else if (!isEditing) {
        const resp = await apiService.createProduct(productData)
        console.log('AdminProductForm - Respuesta createProduct:', resp)
      }
      navigate("/admin/products")
    } catch (error: unknown) {
      console.error("AdminProductForm - Error saving product:", error)

      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      
      if (errorMessage.includes("429")) {
        setRateLimited(true)
        alert("Demasiadas peticiones. Por favor, espera 15 minutos antes de intentar nuevamente.")
      } else {
        alert(isEditing ? "Error al actualizar el producto" : "Error al crear el producto")
      }
    } finally {
      setSaving(false)
      if (!rateLimited) {
        setShowConfirmation(false)
      }
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    setRateLimited(false)
  }

  // Selección de envases
  const handleEnvaseChange = (envaseId: string) => {
    const seleccionado = form.envases?.includes(envaseId)
    console.log('AdminProductForm - Cambio en envases:', envaseId, seleccionado ? 'Quitar' : 'Agregar')
    setForm((prev) => ({
      ...prev,
      envases: seleccionado
        ? (prev.envases || []).filter((id) => id !== envaseId)
        : [...(prev.envases || []), envaseId],
    }))
  }

  // Estados de carga
  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-300 text-lg">
            {categoriesLoading ? "Cargando categorías..." : "Cargando producto..."}
          </p>
        </div>
      </div>
    )
  }

  // Mostrar advertencia si hay error de categorías pero continuar
  if (categoriesError) {
    console.warn("AdminProductForm - Advertencia de categorías:", categoriesError)
  }

  // Pantalla de confirmación
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={handleCancelConfirmation}
                className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 border border-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-bold text-white" style={{ fontSize: '1.05rem', lineHeight: '1.2' }}>Confirmar {isEditing ? "Actualización" : "Creación"}</h1>
                <p className="text-gray-400" style={{ fontSize: '0.93rem', lineHeight: '1.2' }}>
                  Por favor revisa los detalles del producto antes de {isEditing ? "actualizar" : "crear"}
                </p>
              </div>
            </div>
          </div>

          {/* Rate Limit Warning */}
          {rateLimited && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-8 flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Clock className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium" style={{ fontSize: '0.97rem', lineHeight: '1.2', color: '#f87171' }}>Límite de peticiones alcanzado</h4>
                <p className="text-red-200/70 text-sm">
                  Has realizado demasiadas peticiones en poco tiempo. Por favor, espera 15 minutos antes de intentar
                  nuevamente.
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Card */}
          <div className="bg-gradient-to-br from-gray-800/40 via-gray-700/20 to-gray-600/10 backdrop-blur-sm border border-gray-600/40 rounded-xl shadow-lg mb-8">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
                <h3 className="font-semibold text-white" style={{ fontSize: '1rem', lineHeight: '1.2' }}>Resumen del Producto</h3>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-transparent rounded-xl p-6 border border-gray-700/30">
                  <h4 className="font-medium text-white mb-4" style={{ fontSize: '0.97rem', lineHeight: '1.2' }}>Información Básica</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Title - Full Width */}
                    <div className="lg:col-span-2">
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        required
                        className="admin-input"
                        value={form.nombre ?? ''}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre del producto"
                      />
                    </div>

                    {/* Description - Full Width */}
                    <div className="lg:col-span-2">
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        name="descripcion"
                        id="descripcion"
                        rows={4}
                        required
                        className="admin-input resize-none"
                        value={form.descripcion ?? ''}
                        onChange={handleInputChange}
                        placeholder="Describe las características del producto"
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
                      <div className="flex flex-wrap gap-2">
                        {availableCategories.map((category) => (
                          <button
                            type="button"
                            key={category.name}
                            className={`admin-btn px-3 py-1 rounded-full border text-xs font-medium transition-all duration-150
                              ${form.categoria === category.name
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-gray-800 text-blue-200 border-gray-600 hover:bg-blue-900/30 hover:border-blue-500"}
                              ${(form.categoria === '' && categoriasTouched) ? "ring-2 ring-red-500" : ""}`}
                            style={{ minWidth: 100 }}
                            onClick={() => {
                              setForm((prev) => ({ ...prev, categoria: category.name }))
                              setCategoriasTouched(true)
                            }}
                          >
                            {category.display_name}
                          </button>
                        ))}
                      </div>
                      {(form.categoria === '' && categoriasTouched) && (
                        <p className="text-red-400 text-xs mt-2">Debes seleccionar una categoría</p>
                      )}
                    </div>

                    {/* Images */}
                    <div className="bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-transparent rounded-xl p-6 border border-gray-700/30 mt-8">
                      <h4 className="font-semibold text-white mb-4" style={{ fontSize: '1rem', lineHeight: '1.2' }}>
                        Imágenes ({form.imagenes.length})
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
                        <input
                          type="url"
                          className="admin-input flex-1"
                          placeholder="Pega la URL de la imagen (https://...)"
                          value={nuevaImagen}
                          onChange={e => {
                            setNuevaImagen(e.target.value);
                            setErrorImagen("");
                          }}
                          onKeyDown={e => { if (e.key === 'Enter') agregarImagen(); }}
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary px-6 py-2"
                          onClick={agregarImagen}
                          disabled={!nuevaImagen.trim() || !esUrlValida(nuevaImagen)}
                        >
                          Agregar
                        </button>
                      </div>
                      {errorImagen && <p className="text-red-400 text-xs mb-2">{errorImagen}</p>}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {form.imagenes.length === 0 && (
                          <p className="text-gray-400 text-center py-4 col-span-full">No hay imágenes disponibles</p>
                        )}
                        {form.imagenes.map((thumbnail, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-600 group">
                            <img
                              src={thumbnail || "/placeholder.svg"}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-700/80 hover:bg-red-800 text-white rounded-full p-1 shadow-lg transition-all duration-150 opacity-80 group-hover:opacity-100"
                              onClick={() => eliminarImagen(index)}
                              title="Eliminar imagen"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Sección de selección de envases */}
                    <div className="mt-8">
                      <label className="block text-sm font-medium text-gray-300 mb-2">¿En qué envases se vende este perfume? *</label>
                      <div className="flex flex-col gap-2">
                        {envasesDisponibles.map((envase) => {
                          const seleccionado = form.envases?.includes(envase._id)
                          return (
                            <label
                              key={envase._id}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 shadow min-w-[220px] max-w-xl cursor-pointer
                                ${seleccionado ? 'bg-blue-700/20 border-blue-400 ring-2 ring-blue-400' : 'bg-slate-800/70 border-slate-600 hover:bg-blue-900/20 hover:border-blue-500'}`}
                            >
                              <input
                                type="checkbox"
                                checked={!!seleccionado}
                                onChange={() => {
                                  handleEnvaseChange(envase._id)
                                }}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-400"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-base flex items-center gap-2">
                                  {envase.tipo === 'vidrio' ? (
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-700">Vidrio</span>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-900 text-yellow-200 border border-yellow-700">Plástico</span>
                                  )}
                                  {envase.volumen}ml
                                </span>
                                <span className="text-xs text-green-300 font-bold">${envase.precio.toLocaleString()} <span className="text-gray-400">| Stock: {envase.stock}</span></span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                      {(!form.envases || form.envases.length === 0) && (
                        <p className="text-red-400 text-xs mt-2">Debes seleccionar al menos un envase</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                      <select
                        className="admin-input"
                        value={form.estado ? 'activo' : 'inactivo'}
                        onChange={e => setForm(prev => ({ ...prev, estado: e.target.value === 'activo' ? true : false }))}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 mb-8 flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h4 className="font-medium" style={{ fontSize: '0.97rem', lineHeight: '1.2', color: '#fbbf24' }}>Importante</h4>
              <p className="text-yellow-200/70 text-sm">
                Esta acción {isEditing ? "actualizará" : "creará"} el producto en el sistema.
                {isEditing
                  ? " Los cambios se aplicarán inmediatamente."
                  : " El producto estará disponible inmediatamente si está marcado como activo."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancelConfirmation}
              className="px-8 py-3 border-2 border-gray-600 rounded-xl text-gray-300 bg-transparent hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium text-base"
            >
              Volver al Formulario
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={saving || rateLimited}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base min-w-[180px] sm:min-w-[200px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Guardando...
                </>
              ) : rateLimited ? (
                <>
                  <Clock className="h-5 w-5 mr-3" />
                  Límite alcanzado
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-3" />
                  Confirmar y {isEditing ? "Actualizar" : "Crear"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate("/admin/products")}
              className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 border border-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: '1.05rem', lineHeight: '1.2' }}>{isEditing ? "Editar Perfume" : "Nuevo Perfume"}</h1>
              <p className="text-gray-400" style={{ fontSize: '0.93rem', lineHeight: '1.2' }}>
                {isEditing ? "Modifica los datos del perfume" : "Completa la información del nuevo perfume"}
              </p>
              {categoriesError && (
                <div className="mt-2 flex items-center space-x-2">
                  <p className="text-yellow-400 text-sm">⚠️ {categoriesError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded hover:bg-yellow-600/30 transition-all duration-200"
                  >
                    Recargar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card padre con gradiente */}
        <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-blue-700/5 border border-blue-600/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-6 py-8">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
              <input
                type="text"
                name="nombre"
                className="admin-input"
                value={form.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del perfume"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
              <textarea
                name="descripcion"
                className="admin-input resize-none"
                value={form.descripcion}
                onChange={handleInputChange}
                placeholder="Describe el perfume"
                rows={4}
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <button
                    type="button"
                    key={category.name}
                    className={`admin-btn px-3 py-1 rounded-full border text-xs font-medium transition-all duration-150
                      ${form.categoria === category.name
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-gray-800 text-blue-200 border-gray-600 hover:bg-blue-900/30 hover:border-blue-500"}
                      ${(form.categoria === '' && categoriasTouched) ? "ring-2 ring-red-500" : ""}`}
                    style={{ minWidth: 100 }}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, categoria: category.name }))
                      setCategoriasTouched(true)
                    }}
                  >
                    {category.display_name}
                  </button>
                ))}
              </div>
              {(form.categoria === '' && categoriasTouched) && (
                <p className="text-red-400 text-xs mt-2">Debes seleccionar una categoría</p>
              )}
            </div>

            {/* Envases */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">¿En qué envases se vende este perfume? *</label>
              <div className="flex flex-col gap-2">
                {envasesDisponibles.map((envase) => (
                  <label key={envase._id} className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 shadow min-w-[220px] max-w-xl cursor-pointer bg-slate-800/70 border-slate-600 hover:bg-blue-900/20 hover:border-blue-500">
                    <input
                      type="checkbox"
                      checked={form.envases?.includes(envase._id)}
                      onChange={() => {
                        handleEnvaseChange(envase._id)
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-400"
                    />
                    <span className="font-semibold text-base flex items-center gap-2">
                      {envase.tipo === 'vidrio' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-700">Vidrio</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-900 text-yellow-200 border border-yellow-700">Plástico</span>
                      )}
                      {envase.volumen}ml
                    </span>
                    <span className="text-xs text-green-300 font-bold">${envase.precio.toLocaleString()} <span className="text-gray-400">| Stock: {envase.stock}</span></span>
                  </label>
                ))}
              </div>
              {(!form.envases || form.envases.length === 0) && (
                <p className="text-red-400 text-xs mt-2">Debes seleccionar al menos un envase</p>
              )}
            </div>

            {/* Notas Aromáticas */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notas Aromáticas</label>
              <div className="flex flex-wrap gap-2">
                {NOTAS_COMUNES.map((nota) => (
                  <button
                    type="button"
                    key={nota}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-150 ${form.notasAromaticas.includes(nota) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-700 text-gray-200 border-gray-500 hover:bg-blue-900/30 hover:border-blue-500"}`}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        notasAromaticas: prev.notasAromaticas.includes(nota)
                          ? prev.notasAromaticas.filter((n) => n !== nota)
                          : [...prev.notasAromaticas, nota],
                      }))
                      setNotasTouched(true)
                    }}
                  >
                    {nota}
                  </button>
                ))}
              </div>
            </div>

            {/* Imagen principal al final */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Imagen principal *</label>
              <input
                type="url"
                className="admin-input"
                placeholder="URL de la imagen principal (https://...)"
                value={form.imagenes[0] || ""}
                onChange={e => {
                  const val = e.target.value;
                  setForm(prev => ({ ...prev, imagenes: [val] }));
                }}
                required
              />
              {form.imagenes[0] && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={form.imagenes[0]}
                    alt="Imagen principal"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-600"
                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                  />
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <select
                className="admin-input"
                value={form.estado ? 'activo' : 'inactivo'}
                onChange={e => setForm(prev => ({ ...prev, estado: e.target.value === 'activo' ? true : false }))}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            {/* Botón para crear/actualizar perfume al final del formulario */}
            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base min-w-[180px] sm:min-w-[200px]"
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    {isEditing ? "Actualizar perfume" : "Crear perfume"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}