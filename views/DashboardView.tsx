
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, InventoryItem, MenuItem } from '../types';
import { 
  Plus, 
  ChefHat, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Timer,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { getSmartInsights } from '../services/geminiService';
import { printOrderReceipt } from '../utils/printUtils';

interface DashboardProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  inventory: InventoryItem[];
  menu: MenuItem[];
}

const DashboardView: React.FC<DashboardProps> = ({ orders, updateStatus, inventory, menu }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getSmartInsights(orders, inventory, menu);
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const activeOrders = orders.filter(o => [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY].includes(o.status));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Painel de Controlo</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestão operacional em tempo real.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
          <Plus size={18} />
          <span>Novo Pedido</span>
        </button>
      </div>

      {/* Stats Grid - Responsive Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Pendentes" value={orders.filter(o => o.status === OrderStatus.PENDING).length.toString()} icon={<Clock size={16} className="text-amber-600" />} trend="+2" />
        <StatCard title="Preparo" value={orders.filter(o => o.status === OrderStatus.PREPARING).length.toString()} icon={<ChefHat size={16} className="text-blue-600" />} trend="14m" />
        <StatCard title="Receita Hoje" value={`${orders.reduce((acc, curr) => acc + curr.total, 0).toFixed(0)} MT`} icon={<TrendingUp size={16} className="text-emerald-600" />} trend="+15%" />
        <StatCard title="Estoque" value={inventory.filter(i => i.quantity <= i.minThreshold).length.toString()} icon={<AlertTriangle size={16} className="text-rose-600" />} trend="Alertas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Timer size={16} className="text-emerald-600" />
                Pedidos Ativos
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                {activeOrders.length} EM CURSO
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {activeOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">Nenhum pedido ativo.</div>
              ) : (
                activeOrders.map(order => (
                  <div key={order.id} className="p-4 md:p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">#{order.id}</span>
                          <button 
                            onClick={() => printOrderReceipt(order)}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Imprimir Recibo / VD"
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{order.customerName}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-emerald-600">{order.total.toFixed(2)} MT</p>
                        <p className="text-[10px] text-slate-400">Há {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)}m</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span className="text-slate-700 font-medium">{item.quantity}x {item.name}</span>
                          <span className="text-slate-400">{(item.price * item.quantity).toFixed(2)} MT</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {order.status === OrderStatus.PENDING && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.PREPARING)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow-md shadow-emerald-100">Iniciar</button>
                      )}
                      {order.status === OrderStatus.PREPARING && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.READY)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold">Finalizar</button>
                      )}
                      {order.status === OrderStatus.READY && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.DELIVERED)} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">Entregar</button>
                      )}
                      <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"><XCircle size={18} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-emerald-200" />
              <h2 className="font-bold text-base">Análise da IA</h2>
            </div>
            <div className="space-y-3">
              {loadingInsights ? [1,2].map(i => <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse" />) : insights.slice(0, 2).map((insight, idx) => (
                <div key={idx} className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <h3 className="font-bold text-xs text-emerald-50">{insight.title}</h3>
                  <p className="text-[10px] text-emerald-100 mt-1">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />
              Alertas de Stock
            </h2>
            <div className="space-y-3">
              {inventory.filter(i => i.quantity <= i.minThreshold).map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-rose-500 font-bold">{item.quantity}{item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <div className="p-1.5 bg-slate-50 rounded-lg">{icon}</div>
      <span className="text-[9px] font-bold text-emerald-600">{trend}</span>
    </div>
    <div className="text-sm font-bold text-slate-900 mt-1">{value}</div>
    <div className="text-[9px] text-slate-400 uppercase tracking-tight">{title}</div>
  </div>
);

export default DashboardView;
