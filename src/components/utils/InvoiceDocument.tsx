import React from "react";

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceDocumentProps = {
  company: {
    logoUrl: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    cuit?: string;
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
  // Paleta blanco y negro
  const black = "#111";
  const white = "#fff";
  const grayDark = "#333";
  const gray = "#666";
  const grayLight = "#eee";

  return (
    <div style={{ fontFamily: 'Open Sans, Inter, Roboto, Arial, sans-serif', background: white, color: black, maxWidth: 800, margin: '0 auto', borderRadius: 12, boxShadow: '0 0 15px rgba(0,0,0,0.08)', padding: 30, fontSize: 14 }}>
      {/* Header con ambos logos */}
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 20, marginBottom: 30, borderBottom: `1px solid ${grayLight}` }}>
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 32 }}>
          <img src="/icono_logo.png" alt="Logo Daisy" style={{ height: 64, marginBottom: 0 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <img src="/text_logo.png" alt="Daisy Perfumes Artesanales" style={{ height: 48, marginBottom: 4 }} />
          <div style={{ fontSize: 18, color: grayDark, fontWeight: 400, marginBottom: 2 }}>Neuquén Capital</div>
          <div style={{ fontSize: 13, color: grayDark }}>{company.address}</div>
          <div style={{ fontSize: 13, color: grayDark }}>Tel: {company.phone} | Email: {company.email}</div>
          {company.cuit && <div style={{ fontSize: 13, color: grayDark }}>CUIT: {company.cuit}</div>}
        </div>
      </div>

      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: black, textAlign: 'center', margin: '25px 0', textTransform: 'uppercase' }}>Factura de Venta</div>

      {/* Invoice Details */}
      <div style={{ background: white, padding: 18, borderRadius: 8, marginBottom: 20, border: `1px solid ${grayLight}`, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <div>
          <span style={{ fontWeight: 600, color: gray }}>Número de Orden:</span> #{invoice.number}<br />
          <span style={{ fontWeight: 600, color: gray }}>Fecha de Emisión:</span> {invoice.date}<br />
          {invoice.dueDate && <><span style={{ fontWeight: 600, color: gray }}>Vencimiento:</span> {invoice.dueDate}<br /></>}
        </div>
        <div style={{ textAlign: 'right' }}>
          {invoice.status && <><span style={{ fontWeight: 600, color: gray }}>Estado:</span> {invoice.status.toUpperCase()}<br /></>}
          {invoice.paymentMethod && <><span style={{ fontWeight: 600, color: gray }}>Método de Pago:</span> {invoice.paymentMethod}<br /></>}
        </div>
      </div>

      {/* Client Info */}
      <div style={{ background: white, padding: 18, borderRadius: 8, marginBottom: 20, border: `1px solid ${grayLight}` }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: black, marginBottom: 10, borderBottom: `1px solid ${grayLight}`, paddingBottom: 5 }}>Datos del Cliente</div>
        <p><span style={{ fontWeight: 600, color: gray }}>Nombre:</span> {client.name}</p>
        <p><span style={{ fontWeight: 600, color: gray }}>Email:</span> {client.email}</p>
        <p><span style={{ fontWeight: 600, color: gray }}>Teléfono:</span> {client.phone}</p>
        <p><span style={{ fontWeight: 600, color: gray }}>Dirección:</span> {client.address}</p>
        {client.city && <p><span style={{ fontWeight: 600, color: gray }}>Ciudad:</span> {client.city}</p>}
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr>
            <th style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'left', fontSize: 14, background: grayLight, color: black, fontWeight: 600, textTransform: 'uppercase' }}>Producto/Servicio</th>
            <th style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'center', fontSize: 14, background: grayLight, color: black, fontWeight: 600, textTransform: 'uppercase' }}>Cantidad</th>
            <th style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'right', fontSize: 14, background: grayLight, color: black, fontWeight: 600, textTransform: 'uppercase' }}>Precio Unit.</th>
            <th style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'right', fontSize: 14, background: grayLight, color: black, fontWeight: 600, textTransform: 'uppercase' }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? white : '#fafafa' }}>
              <td style={{ border: `1px solid ${grayLight}`, padding: 10 }}>{item.description}</td>
              <td style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'right' }}>${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
              <td style={{ border: `1px solid ${grayLight}`, padding: 10, textAlign: 'right' }}>${item.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ textAlign: 'right', marginTop: 25 }}>
        <table style={{ marginLeft: 'auto', borderCollapse: 'collapse', width: '50%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15 }}>Subtotal:</td>
              <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15, textAlign: 'right' }}>${invoice.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
            {typeof invoice.shippingCost === 'number' && (
              <tr>
                <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15 }}>{invoice.wantsShipping ? 'Envío:' : 'Punto de encuentro:'}</td>
                <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15, textAlign: 'right' }}>{invoice.wantsShipping ? `$${invoice.shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'Gratis'}</td>
              </tr>
            )}
            {typeof invoice.tax === 'number' && (
              <tr>
                <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15 }}>Impuestos:</td>
                <td style={{ padding: '6px 15px', borderBottom: `1px solid ${grayLight}`, fontSize: 15, textAlign: 'right' }}>${invoice.tax.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
              </tr>
            )}
            <tr>
              <td className="total-final" style={{ fontWeight: 700, fontSize: 18, color: black, borderTop: `2px solid ${grayDark}`, paddingTop: 8 }}>TOTAL:</td>
              <td className="total-final" style={{ fontWeight: 700, fontSize: 18, color: black, borderTop: `2px solid ${grayDark}`, paddingTop: 8, textAlign: 'right' }}>${invoice.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notas adicionales */}
      {invoice.notes && (
        <div style={{ background: white, padding: 18, borderRadius: 8, marginTop: 20, marginBottom: 20, border: `1px solid ${grayLight}` }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: black, marginBottom: 10, borderBottom: `1px solid ${grayLight}`, paddingBottom: 5 }}>Notas Adicionales</div>
          <p>{invoice.notes}</p>
        </div>
      )}

      {/* Payment Terms */}
      <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: grayDark, borderTop: `1px solid ${grayLight}`, paddingTop: 20 }}>
        <p style={{ fontWeight: 600, color: black }}>¡Gracias por tu compra!</p>
        <p>Esta factura fue generada automáticamente el {invoice.date}</p>
        <p>Para consultas sobre tu pedido, contactanos por WhatsApp: +54 299 400 1234</p>
        <div style={{ color: grayDark, fontSize: 14, marginTop: 10 }}>
          <b>Términos de pago:</b> {invoice.paymentTerms}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDocument; 