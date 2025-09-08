import jsPDF from 'jspdf';

const InvoicePDF = {
  generateInvoice: (order) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(24);
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text('KICI PERFUME', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('A Perfume Studio', 20, 40);
    doc.text('Email: info@herbytots.com', 20, 50);
    doc.text('Phone: +91 91161 61630', 20, 60);
    
    // Invoice Title
    doc.setFontSize(20);
    doc.setTextColor(128, 0, 128);
    doc.text('INVOICE', 150, 30);
    
    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${order.order_number}`, 150, 45);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 150, 55);
    doc.text(`Status: ${order.status?.toUpperCase()}`, 150, 65);
    
    // Customer Details
    doc.setFontSize(14);
    doc.setTextColor(128, 0, 128);
    doc.text('BILL TO:', 20, 85);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${order.user?.name || 'Customer'}`, 20, 100);
    doc.text(`${order.user?.email || ''}`, 20, 110);
    
    // Add a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 125, 190, 125);
    
    // Items Header
    doc.setFontSize(12);
    doc.setTextColor(128, 0, 128);
    doc.text('ITEM', 20, 140);
    doc.text('QTY', 100, 140);
    doc.text('UNIT PRICE', 130, 140);
    doc.text('TOTAL', 170, 140);
    
    // Items line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 145, 190, 145);
    
    // Items
    let yPosition = 160;
    let subtotal = 0;
    
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const productName = item.product?.name || item.product_snapshot?.name || 'Product';
        const quantity = item.quantity || 0;
        const unitPrice = parseFloat(item.unit_price || item.price || 0);
        const total = parseFloat(item.total_price || (unitPrice * quantity));
        
        subtotal += total;
        
        // Product name (wrap if too long)
        const maxWidth = 75;
        const lines = doc.splitTextToSize(productName, maxWidth);
        doc.text(lines, 20, yPosition);
        
        doc.text(quantity.toString(), 100, yPosition);
        doc.text(`₹${unitPrice.toFixed(2)}`, 130, yPosition);
        doc.text(`₹${total.toFixed(2)}`, 170, yPosition);
        
        yPosition += Math.max(15, lines.length * 5);
        
        // Add product details if available
        if (item.product_snapshot?.concentration || item.product_snapshot?.size) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          let details = '';
          if (item.product_snapshot.concentration) details += item.product_snapshot.concentration;
          if (item.product_snapshot.size) details += ` - ${item.product_snapshot.size}`;
          doc.text(details, 20, yPosition - 8);
        }
      });
    }
    
    // Totals section
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, yPosition, 190, yPosition);
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Subtotal
    doc.text('Subtotal:', 130, yPosition);
    doc.text(`₹${(order.subtotal_amount || subtotal).toFixed(2)}`, 170, yPosition);
    
    // Tax
    yPosition += 15;
    doc.text('Tax (GST):', 130, yPosition);
    doc.text(`₹${(order.tax_amount || 0).toFixed(2)}`, 170, yPosition);
    
    // Shipping
    yPosition += 15;
    doc.text('Shipping:', 130, yPosition);
    doc.text(`₹${(order.shipping_cost || 0).toFixed(2)}`, 170, yPosition);
    
    // Discount
    if (order.discount_amount && order.discount_amount > 0) {
      yPosition += 15;
      doc.setTextColor(0, 150, 0);
      doc.text('Discount:', 130, yPosition);
      doc.text(`-₹${order.discount_amount.toFixed(2)}`, 170, yPosition);
      doc.setTextColor(0, 0, 0);
    }
    
    // Total line
    yPosition += 10;
    doc.setDrawColor(128, 0, 128);
    doc.setLineWidth(1);
    doc.line(120, yPosition, 190, yPosition);
    
    // Total
    yPosition += 15;
    doc.setFontSize(14);
    doc.setTextColor(128, 0, 128);
    doc.text('TOTAL:', 130, yPosition);
    doc.text(`₹${(order.total_amount || 0).toFixed(2)}`, 170, yPosition);
    
    // Payment Information
    yPosition += 25;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Method:', 20, yPosition);
    doc.text((order.payment_method || '').replace('_', ' ').toUpperCase(), 70, yPosition);
    
    yPosition += 15;
    doc.text('Payment Status:', 20, yPosition);
    doc.setTextColor(order.payment_status === 'paid' ? 0 : 200, order.payment_status === 'paid' ? 150 : 100, 0);
    doc.text((order.payment_status || '').toUpperCase(), 70, yPosition);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 20, 280);
    doc.text('For any queries, contact us at info@herbytots.com', 20, 290);
    
    return doc;
  },
  
  downloadInvoice: (order) => {
    const doc = InvoicePDF.generateInvoice(order);
    doc.save(`Invoice-${order.order_number}.pdf`);
  },
  
  viewInvoice: (order) => {
    const doc = InvoicePDF.generateInvoice(order);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
};

export default InvoicePDF;
