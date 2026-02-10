import React from 'react';
import { Order } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

interface ReportsProps {
  orders: Order[];
}

const ReportsView: React.FC<ReportsProps> = ({ orders }) => {
  // Mock performance data
  const data = [
    { name: 'Seg', sales: 4000, profit: 2400 },
    { name: 'Ter', sales: 3000, profit: 1398 },
    { name: 'Qua', sales: 2000, profit: 9800 },
    { name: 'Qui', sales: 2780, profit: 3908 },
    { name: 'Sex', sales: 1890, profit: 4800 },
    { name: 'Sáb', sales: 2390, profit: 3800 },
    { name: 'Dom', sales: 3490, profit: 4300 },
  ];

  const categoryData = [
    { name: 'Pratos', value: 400 },
    { name: 'Pizzas', value: 300 },
    { name: 'Bebidas', value: 300 },
    { name: 'Doces', value: 200 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios Analíticos</h1>
          <p className="text-slate-500 text-sm">Visualize o desempenho do seu negócio com dados detalhados.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
          <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-2">
            <Calendar size={16} />
            Últimos 7 dias
          </button>
          <button className="px-4 py-2 text-slate-500 rounded-lg text-sm font-medium hover:bg-slate-50">Mensal</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Receita Total" value="12.450 MT" icon={<DollarSign className="text-emerald-600" />} trend="+12.5%" isUp={true} />
        <MetricCard title="Ticket Médio" value="68,20 MT" icon={<ShoppingBag className="text-blue-600" />} trend="-3.2%" isUp={false} />
        <MetricCard title="Novos Clientes" value="48" icon={<Users className="text-purple-600" />} trend="+18%" isUp={true} />
        <MetricCard title="Satisfação" value="4.8/5" icon={<TrendingUp className="text-amber-600" />} trend="+0.2" isUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">Tendência de Vendas Semanal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">Vendas por Categoria</h2>
          <div className="h-80 flex flex-col md:flex-row items-center">
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 px-8">
              {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{((cat.value / 1200) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string; isUp: boolean }> = ({ title, value, icon, trend, isUp }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </div>
    </div>
    <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export default ReportsView;