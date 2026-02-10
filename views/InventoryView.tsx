
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Search, Plus, Filter, AlertTriangle, ArrowUpDown, Tag } from 'lucide-react';

interface InventoryProps {
  inventory: InventoryItem[];
  updateInventory: (id: string, qty: number) => void;
}

const InventoryView: React.FC<InventoryProps> = ({ inventory, updateInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Gestão de Stock</h1>
          <p className="text-slate-500 text-xs md:text-sm">Inventário detalhado e reposição.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200">
          <Plus size={18} />
          <span>Cadastrar Item</span>
        </button>
      </div>

      {/* Grid de Itens */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-3 md:p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar no inventário..." 
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Stock Atual</th>
                <th className="px-6 py-4">P. Custo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
              {filtered.map(item => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                        <Tag size={12} /> {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>{item.quantity} {item.unit}</span>
                        <span className="text-[9px] text-slate-400">Mín: {item.minThreshold} {item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {item.costPrice.toFixed(2)} MT
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                        isLow ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {isLow ? <AlertTriangle size={10} /> : null}
                        {isLow ? 'Crítico' : 'Normal'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => updateInventory(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => updateInventory(item.id, item.quantity + 1)}
                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
