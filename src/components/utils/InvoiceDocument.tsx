import React from "react";

// Google Fonts para Playfair Display y Montserrat
const fontLinks = (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
    <style>{`
      .daisy-playfair { font-family: 'Playfair Display', serif; }
      .daisy-montserrat { font-family: 'Montserrat', Arial, sans-serif; }
    `}</style>
  </>
);

// Paleta de colores
const COLOR_BG = "#FAFAF7";
const COLOR_ACCENT = "#234078"; // Azul oscuro
const COLOR_TEXT = "#222";
const COLOR_LINE = "#e0e1e5";
const COLOR_TABLE_HEADER = "#d0dbf2";

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  volumenMl?: number;
};

export type InvoiceDocumentProps = {
  company: {
    logoUrl: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    cuit?: string;
    iva?: string;
  };
  client: {
    name: string;
    address: string;
    email: string;
    phone: string;
    city?: string;
  };
  invoice: {
    number: string;
    date: string;
    dueDate?: string;
    items: InvoiceItem[];
    subtotal: number;
    shippingCost?: number;
    total: number;
    tax?: number;
    paymentTerms: string;
    paymentMethod?: string;
    status?: string;
    notes?: string;
    accentColor?: string;
    wantsShipping?: boolean;
  };
};

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ company, client, invoice }) => {
  // Función para mapear estados a texto legible
  const getEstadoLegible = (estado: string): string => {
    const estadosMap: { [key: string]: string } = {
      'pendiente_confirmacion_transferencia': 'Pendiente',
      'pendiente_pago': 'Pendiente de pago',
      'confirmado': 'Confirmado',
      'pendiente_comprobante_transferencia': 'Pendiente',
      'pendiente_manual': 'Pendiente',
      'pagado': 'Pagado',
      'reembolsado': 'Reembolsado',
      'cancelado': 'Cancelado',
    };
    return estadosMap[estado] || estado;
  };

  return (
    <div style={{
      fontFamily: 'Montserrat, Arial, sans-serif',
      background: COLOR_BG,
      color: COLOR_TEXT,
      width: '210mm',
      minHeight: '297mm',
      margin: '30px auto',
      borderRadius: 12,
      boxShadow: '0 0 16px rgba(0,0,0,0.07)',
      padding: '36px 32px',
      fontSize: 15,
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {fontLinks}
      {/* Header: Logo y Título centrados */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <img src="/icono_logo.png" alt="Icon Daisy" style={{ height: 40 }} />
          <img src="/text_logo.png" alt="Logo Daisy" style={{ height: 44 }} />
        </div>
      </div>
      <div className="daisy-playfair" style={{ width: '100%', textAlign: 'center', fontSize: 32, color: COLOR_ACCENT, fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>
        Factura de Orden
      </div>
      {/* Línea divisoria */}
      <div style={{ width: '100%', height: 2, background: COLOR_LINE, margin: '0 0 18px 0' }} />

      {/* Información Daisy, Cliente y Orden en columna */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 24px auto', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        {/* Empresa */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div className="daisy-playfair" style={{ color: COLOR_ACCENT, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Daisy Perfumes Artesanales</div>

          <div className="daisy-montserrat" style={{ fontSize: 14 }}>Tel: {company.phone}</div>
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>Email: {company.email}</div>

        </div>
        
        {/* Cliente */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div className="daisy-playfair" style={{ color: COLOR_ACCENT, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Facturado a:</div>
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>{client.name}</div>
          {client.address && <div className="daisy-montserrat" style={{ fontSize: 14 }}>{client.address}</div>}
          {client.city && <div className="daisy-montserrat" style={{ fontSize: 14 }}>{client.city}</div>}
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>{client.email}</div>
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>{client.phone}</div>
        </div>
        {/* Orden */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div className="daisy-playfair" style={{ color: COLOR_ACCENT, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Datos de la Orden:</div>
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>N°: <b>{invoice.number}</b></div>
          <div className="daisy-montserrat" style={{ fontSize: 14 }}>Fecha: <b>{invoice.date}</b></div>
          {invoice.status && <div className="daisy-montserrat" style={{ fontSize: 14 }}>Estado de la orden: <b>{getEstadoLegible(invoice.status)}</b></div>}
          {invoice.paymentMethod && <div className="daisy-montserrat" style={{ fontSize: 14 }}>Metodo de Pago:<b> {invoice.paymentMethod}</b></div>}
        </div>
      </div>

      {/* Tabla de productos */}
      <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', marginBottom: 24, marginLeft:3 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
          <thead>
            <tr style={{ background: COLOR_TABLE_HEADER }}>
              <th className="daisy-montserrat" style={{ textAlign: 'left', fontSize: 14, fontWeight: 600, padding: '10px 6px', color: COLOR_ACCENT, borderBottom: `2px solid ${COLOR_LINE}` }}>Producto</th>
              <th className="daisy-montserrat" style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, padding: '10px 6px', color: COLOR_ACCENT, borderBottom: `2px solid ${COLOR_LINE}` }}>Cant.</th>
              <th className="daisy-montserrat" style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, padding: '10px 6px', color: COLOR_ACCENT, borderBottom: `2px solid ${COLOR_LINE}` }}>Unitario</th>
              <th className="daisy-montserrat" style={{ textAlign: 'right', fontSize: 14, fontWeight: 600, padding: '10px 6px', color: COLOR_ACCENT, borderBottom: `2px solid ${COLOR_LINE}` }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? 'transparent' : '#f2f5ff' }}>
                <td style={{ padding: '8px 6px', fontSize: 14 }}>
                  {item.description}
                  {item.volumenMl && (
                    <span style={{ color: COLOR_ACCENT, fontSize: 13 }}> ({item.volumenMl} ml)</span>
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: '8px 6px', fontSize: 14 }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '8px 6px', fontSize: 14 }}>${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'right', padding: '8px 6px', fontSize: 14 }}>${item.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div style={{ width: '100%', maxWidth: 340, alignSelf: 'flex-end', marginBottom: 24 }}>
        <div style={{ borderTop: `3px solid ${COLOR_ACCENT}`, paddingTop: 12, marginBottom: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 2 }}>
          <div>Subtotal:</div>
          <div>${invoice.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        </div>
        {typeof invoice.shippingCost === 'number' && invoice.wantsShipping && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 2 }}>
            <div>Envío:</div>
            <div>${invoice.shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
          </div>
        )}
        {typeof invoice.shippingCost === 'number' && !invoice.wantsShipping && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 2 }}>
            <div>Punto de encuentro:</div>
            <div>Gratis</div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, color: COLOR_ACCENT, marginTop: 8 }}>
          <div>Total:</div>
          <div>${invoice.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Notas adicionales */}
      {invoice.notes && (
        <div style={{ fontSize: 14, color: COLOR_ACCENT, width: '100%', marginBottom: 18, borderLeft: `3px solid ${COLOR_ACCENT}`, paddingLeft: 12, background: '#f2f5ff', paddingTop: 6, paddingBottom: 6 }}>
          <b>Notas:</b> {invoice.notes}
        </div>
      )}

      {/* Pie de página: Gracias y redes sociales */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 32, marginBottom: 8 }}>
        <div className="daisy-playfair" style={{ fontSize: 26, color: COLOR_ACCENT, fontWeight: 700, marginBottom: 6 }}>
          ¡Gracias por tu compra!
        </div>
        <div className="daisy-montserrat" style={{ fontSize: 14, color: COLOR_TEXT, marginBottom: 4 }}>
          Factura generada el {invoice.date}
        </div>
        <div className="daisy-montserrat" style={{ fontSize: 14, color: COLOR_TEXT, marginBottom: 8 }}>
          <b>Términos de pago:</b> {invoice.paymentTerms}
        </div>
        {/* Placeholder para redes sociales */}

        <div style={{ marginTop: 10, textAlign: 'center', color: COLOR_ACCENT, fontWeight: 600, fontSize: 15 }}>
          Cualquiera duda comunicate al número: {company.phone}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDocument; 