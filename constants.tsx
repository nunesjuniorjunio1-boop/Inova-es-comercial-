
import { MenuItem, InventoryItem, Order, OrderStatus, CashTransaction } from './types';

export const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Hambúrguer Gourmet', description: 'Blend de 180g, queijo cheddar, bacon caramelizado.', price: 34.90, category: 'Pratos', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', stock: 50 },
  { id: '2', name: 'Pizza Margherita', description: 'Molho de tomate pelado, mussarela de búfala e manjericão.', price: 42.00, category: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=400', stock: 30 },
  { id: '3', name: 'Batata Frita Rústica', description: 'Cortes grossos com alecrim e páprica defumada.', price: 18.50, category: 'Acompanhamentos', image: 'https://images.unsplash.com/photo-1573015613731-c41623b48f53?auto=format&fit=crop&q=80&w=400', stock: 100 },
  { id: '4', name: 'Suco de Laranja Natural', description: '500ml de pura vitamina C.', price: 9.00, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400', stock: 40 },
  { id: '5', name: 'Esparguete à Bolonhesa', description: 'Massa italiana com molho de carne e manjericão fresco.', price: 28.00, category: 'Pratos', image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=400', stock: 25 },
  { id: '6', name: 'Salada Caesar', description: 'Alface romana, croutons, queijo parmesão e molho especial.', price: 22.00, category: 'Saladas', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400', stock: 15 },
  { id: '7', name: 'Petit Gâteau', description: 'Bolinho quente de chocolate com gelado de baunilha.', price: 15.00, category: 'Doces', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400', stock: 12 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Carne Moída (Patinho)', quantity: 15, unit: 'kg', minThreshold: 5, costPrice: 280, category: 'Proteínas' },
  { id: 'i2', name: 'Pão de Brioche', quantity: 120, unit: 'un', minThreshold: 30, costPrice: 15, category: 'Padaria' },
  { id: 'i3', name: 'Queijo Cheddar', quantity: 8, unit: 'kg', minThreshold: 2, costPrice: 450, category: 'Laticínios' },
  { id: 'i4', name: 'Batata Asterix', quantity: 45, unit: 'kg', minThreshold: 10, costPrice: 65, category: 'Legumes' },
  { id: 'i5', name: 'Laranja Pêra', quantity: 200, unit: 'un', minThreshold: 50, costPrice: 8, category: 'Frutas' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1001',
    customerName: 'Ricardo Oliveira',
    items: [{ menuItemId: '1', name: 'Hambúrguer Gourmet', quantity: 2, price: 34.90 }],
    total: 69.80,
    status: OrderStatus.PREPARING,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    estimatedPrepTime: 25
  }
];

export const INITIAL_TRANSACTIONS: CashTransaction[] = [
  { id: 't1', type: 'income', description: 'Venda Pedido #1001', amount: 69.80, category: 'Vendas', date: new Date() },
  { id: 't2', type: 'expense', description: 'Compra de Laticínios', amount: 1250.00, category: 'Fornecedores', date: new Date(Date.now() - 86400000) },
  { id: 't3', type: 'expense', description: 'Energia Elétrica', amount: 4500.00, category: 'Contas Fixas', date: new Date(Date.now() - 172800000) },
];
