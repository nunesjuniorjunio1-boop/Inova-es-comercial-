
import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Search, Filter, Edit3, Trash2, Eye, LayoutGrid, List, X, Image as ImageIcon } from 'lucide-react';

interface MenuProps {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuView: React.FC<MenuProps> = ({ menu, setMenu }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Pratos',
    image: '',
    stock: 0
  });

  const categories = ['Todos', ...Array.from(new Set(menu.map(i => i.category)))];

  const filteredMenu = selectedCategory === 'Todos' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const item: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name || '',
      description: newItem.description || '',
      price: Number(newItem.price),
      category: newItem.category || 'Pratos',
      image: newItem.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400`,
      stock: Number(newItem.stock) || 0
    };

    setMenu(prev => [...prev, item]);
    setIsAddModalOpen(false);
    setNewItem({ name: '', description: '', price: 0, category: 'Pratos', image: '', stock: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Cardápio</h1>
          <p className="text-slate-500 text-sm">Visualize e edite os itens oferecidos aos seus clientes.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar item..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full lg:w-64 text-sm shadow-sm"
            />
          </div>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button className="p-1.5 bg-slate-100 text-emerald-600 rounded-lg shadow-sm"><LayoutGrid size={18} /></button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"><List size={18} /></button>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:shadow-emerald-50/50 hover:border-emerald-200 transition-all flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-emerald-700 px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
                {item.price.toFixed(2)} MT
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                <button className="p-2 bg-white text-slate-700 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Eye size={20} />
                </button>
                <button className="p-2 bg-white text-slate-700 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Edit3 size={20} />
                </button>
                <button className="p-2 bg-white text-rose-500 rounded-full hover:bg-rose-50 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{item.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{item.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${item.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                  <span className="text-xs font-semibold text-slate-600">{item.stock} un. em estoque</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Card Action */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-full min-h-[340px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/20 transition-all group"
        >
          <div className="p-4 bg-slate-50 rounded-full group-hover:bg-emerald-100 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold">Adicionar Novo Prato</span>
        </button>
      </div>

      {/* Add Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Novo Prato</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Prato</label>
                <input 
                  required
                  type="text" 
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Ex: Hambúrguer Clássico"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preço (MT)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={newItem.price || ''}
                    onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={newItem.stock || ''}
                    onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                <select 
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all appearance-none"
                >
                  <option value="Pratos">Pratos</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Doces">Doces</option>
                  <option value="Acompanhamentos">Acompanhamentos</option>
                  <option value="Saladas">Saladas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL da Imagem</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={newItem.image}
                    onChange={e => setNewItem({...newItem, image: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
                <textarea 
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  placeholder="Descreva os ingredientes e detalhes do prato..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  Adicionar Prato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuView;
