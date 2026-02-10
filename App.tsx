
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Package, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  Sparkles,
  Menu,
  DollarSign
} from 'lucide-react';
import { INITIAL_MENU, INITIAL_INVENTORY, INITIAL_ORDERS, INITIAL_TRANSACTIONS } from './constants';
import { AppView, Order, OrderStatus, MenuItem, InventoryItem, CashTransaction } from './types';
import DashboardView from './views/DashboardView';
import InventoryView from './views/InventoryView';
import MenuView from './views/MenuView';
import ReportsView from './views/ReportsView';
import AIView from './views/AIView';
import FinancesView from './views/FinancesView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<CashTransaction[]>(INITIAL_TRANSACTIONS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pendingOrdersCount = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.minThreshold).length;

  const handleUpdateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // Se entregue, gerar entrada no caixa
    if (newStatus === OrderStatus.DELIVERED) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const newTx: CashTransaction = {
          id: `t-${Date.now()}`,
          type: 'income',
          description: `Venda Pedido #${orderId}`,
          amount: order.total,
          category: 'Vendas',
          date: new Date()
        };
        setTransactions(prev => [newTx, ...prev]);
      }
    }
  }, [orders]);

  const handleUpdateInventory = useCallback((itemId: string, newQuantity: number) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView orders={orders} updateStatus={handleUpdateOrderStatus} inventory={inventory} menu={menu} />;
      case 'inventory':
        return <InventoryView inventory={inventory} updateInventory={handleUpdateInventory} />;
      case 'menu':
        return <MenuView menu={menu} setMenu={setMenu} />;
      case 'reports':
        return <ReportsView orders={orders} />;
      case 'ai_assistant':
        return <AIView orders={orders} inventory={inventory} menu={menu} />;
      case 'finances':
        return <FinancesView transactions={transactions} setTransactions={setTransactions} />;
      default:
        return <DashboardView orders={orders} updateStatus={handleUpdateOrderStatus} inventory={inventory} menu={menu} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      <aside className={`hidden md:flex bg-white border-r border-slate-200 transition-all duration-300 flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg">
            <Utensils size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-emerald-900">GastroMaster</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<Sparkles size={20} />} label="Assistente IA" active={activeView === 'ai_assistant'} onClick={() => setActiveView('ai_assistant')} collapsed={!isSidebarOpen} highlight />
          <SidebarItem icon={<DollarSign size={20} />} label="Financeiro" active={activeView === 'finances'} onClick={() => setActiveView('finances')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<Package size={20} />} label="Inventário" active={activeView === 'inventory'} onClick={() => setActiveView('inventory')} collapsed={!isSidebarOpen} badge={lowStockCount} />
          <SidebarItem icon={<Utensils size={20} />} label="Cardápio" active={activeView === 'menu'} onClick={() => setActiveView('menu')} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<BarChart3 size={20} />} label="Relatórios" active={activeView === 'reports'} onClick={() => setActiveView('reports')} collapsed={!isSidebarOpen} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Menu size={20} /></button>
            <div className="md:hidden bg-emerald-600 p-1.5 rounded-lg text-white"><Utensils size={18} /></div>
            <h2 className="font-bold text-slate-800 text-sm md:text-base hidden sm:block">Gestão Master</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Pesquisar..." className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full w-32 sm:w-48 text-xs focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button className="relative p-2 text-slate-500"><Bell size={20} /></button>
            <img src="https://picsum.photos/seed/user/100" className="w-8 h-8 rounded-full border border-slate-200" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderView()}</main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 z-50">
        <MobileNavItem icon={<LayoutDashboard size={20} />} active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} label="Início" />
        <MobileNavItem icon={<Sparkles size={20} />} active={activeView === 'ai_assistant'} onClick={() => setActiveView('ai_assistant')} label="IA" />
        <MobileNavItem icon={<DollarSign size={20} />} active={activeView === 'finances'} onClick={() => setActiveView('finances')} label="Caixa" />
        <MobileNavItem icon={<Package size={20} />} active={activeView === 'inventory'} onClick={() => setActiveView('inventory')} label="Stock" badge={lowStockCount} />
        <MobileNavItem icon={<BarChart3 size={20} />} active={activeView === 'reports'} onClick={() => setActiveView('reports')} label="Relat." />
      </nav>
    </div>
  );
};

const SidebarItem: React.FC<any> = ({ icon, label, active, onClick, collapsed, badge, highlight }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' : highlight ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
    <div className={active ? 'text-emerald-600' : ''}>{icon}</div>
    {!collapsed && <span className="flex-1 text-left text-sm">{label}</span>}
    {!collapsed && !!badge && badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </button>
);

const MobileNavItem: React.FC<any> = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 h-full gap-1 relative ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
    {icon}
    <span className="text-[9px] font-medium">{label}</span>
    {!!badge && badge > 0 && <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full font-bold">{badge}</span>}
  </button>
);

export default App;
