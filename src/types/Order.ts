export interface Order {
  _id: string
  orderNumber: string
  items: Array<{
    productId: string
    title: string
    price: number
    quantity: number
    size?: string
    color?: string
    image?: string
  }>
  shippingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode?: string
    notes?: string
  }
  paymentMethod: "cash" | "transfer"
  subtotal: number
  shippingCost: number
  total: number
  status:
    | "pendiente_manual"
    | "pendiente_comprobante_transferencia"
    | "pendiente_confirmacion_transferencia"
    | "pagado"
    | "cancelado"
    | "reembolsado"
    | "confirmado"
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
  transferProofUrl?: string
}
