
import { Order, CashTransaction } from '../types';

export const printOrderReceipt = (order: Order) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) return;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 4px 0;">${item.quantity}x ${item.name}</td>
      <td style="text-align: right; padding: 4px 0;">${(item.price * item.quantity).toFixed(2)} MT</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>Recibo - Pedido #${order.id}</title>
        <style>
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 80mm; 
            margin: 0 auto; 
            padding: 10px;
            font-size: 12px;
            color: #000;
          }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .header h1 { font-size: 16px; margin: 0; }
          .info { margin-bottom: 10px; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; }
          .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 5px; font-weight: bold; font-size: 14px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px solid #eee; padding-top: 10px; }
          @media print {
            body { width: 100%; margin: 0; padding: 5px; }
            @page { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GASTRO MASTER PRO</h1>
          <p>Inovação Comercial</p>
        </div>
        <div class="info">
          <p><b>DOC: Venda a Dinheiro (VD)</b></p>
          <p>Data: ${new Date(order.createdAt).toLocaleString()}</p>
          <p>Pedido: #${order.id}</p>
          <p>Cliente: ${order.customerName}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px solid #000;">Item</th>
              <th style="text-align: right; border-bottom: 1px solid #000;">Preço</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="total">
          <div style="display: flex; justify-content: space-between;">
            <span>TOTAL:</span>
            <span>${order.total.toFixed(2)} MT</span>
          </div>
        </div>
        <div class="footer">
          <p>Obrigado pela sua preferência!</p>
          <p>Processado por GastroMaster Pro AI</p>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printTransactionReceipt = (tx: CashTransaction) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Recibo - Transação #${tx.id}</title>
        <style>
          body { 
            font-family: 'Courier New', Courier, monospace; 
            width: 80mm; 
            margin: 0 auto; 
            padding: 10px;
            font-size: 12px;
            color: #000;
          }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .header h1 { font-size: 16px; margin: 0; }
          .info { margin-bottom: 15px; }
          .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 5px; font-weight: bold; font-size: 16px; text-align: center; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          @media print { @page { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GASTRO MASTER PRO</h1>
          <p>Comprovativo de Operação</p>
        </div>
        <div class="info">
          <p><b>Tipo: ${tx.type === 'income' ? 'Entrada (VD)' : 'Saída (Pagamento)'}</b></p>
          <p>Data: ${new Date(tx.date).toLocaleString()}</p>
          <p>Categoria: ${tx.category}</p>
          <p>Descrição: ${tx.description}</p>
        </div>
        <div class="total">
           VALOR: ${tx.amount.toFixed(2)} MT
        </div>
        <div class="footer">
          <p>Guarde este comprovativo.</p>
          <p>Sistema GastroMaster Pro</p>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
