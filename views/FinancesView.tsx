
import React, { useState } from 'react';
import { CashTransaction } from '../types';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Filter,
  Printer
} from 'lucide-react';
import { printTransactionReceipt } from '../utils/printUtils';

interface FinancesProps {
  transactions: CashTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<CashTransaction[]>>;
}

const FinancesView: React.FC<FinancesProps> = ({ transactions, setTransactions }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTx, setNewTx] = useState<Partial<CashTransaction>>({ type: 'income', amount: 0, category: 'Outros' });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddTx = () => {
    if (!newTx.description || !newTx.amount) return;
    const tx: CashTransaction = {
      id: `t-${Date.now()}`,
      type: newTx.type as 'income' | 'expense',
      description: newTx.description,
      amount: Number(newTx.amount),
      category: newTx.category || 'Geral',
      date: new Date()
    };
    setTransactions(prev => [tx, ...prev]);
    setIsAddOpen(false);
    setNewTx({ type: 'income', amount: 0, category: 'Outros' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Financeiro</h1>
          <p className="text-slate-500 text-xs md:text-sm">Controle de entradas e saídas do caixa.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-emerald-100"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Nova Transação</span>
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard 
          title="Saldo Atual" 
          value={`${balance.toFixed(2)} MT`} 
          icon={<DollarSign size={20} />} 
          color="bg-white border-slate-200" 
          textColor="text-slate-900"
        />
        <SummaryCard 
          title="Entradas" 
          value={`${totalIncome.toFixed(2)} MT`} 
          icon={<ArrowUpRight size={20} />} 
          color="bg-emerald-50 border-emerald-100" 
          textColor="text-emerald-700"
        />
        <SummaryCard 
          title="Saídas" 
          value={`${totalExpense.toFixed(2)} MT`} 
          icon={<ArrowDownLeft size={20} />} 
          color="bg-rose-50 border-rose-100" 
          textColor="text-rose-700"
        />
      </div>

      {/* Listagem de Transações */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            Movimentações Recentes
          </h2>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <Filter size={18} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{tx.category} • {tx.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'} {tx.amount.toFixed(2)} MT
                </div>
                <button 
                  onClick={() => printTransactionReceipt(tx)}
                  className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  title="Imprimir Comprovativo"
                >
                  <Printer size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Simples para Adicionar Transação */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Lançar no Caixa</h3>
            <div className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setNewTx({...newTx, type: 'income'})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newTx.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Entrada
                </button>
                <button 
                  onClick={() => setNewTx({...newTx, type: 'expense'})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newTx.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Saída
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Descrição (ex: Compra de Carne)" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={newTx.description || ''}
                onChange={e => setNewTx({...newTx, description: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Valor (MT)" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})}
              />
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                onChange={e => setNewTx({...newTx, category: e.target.value})}
              >
                <option value="Vendas">Vendas</option>
                <option value="Fornecedores">Fornecedores</option>
                <option value="Contas Fixas">Contas Fixas</option>
                <option value="Salários">Salários</option>
                <option value="Outros">Outros</option>
              </select>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancelar</button>
                <button onClick={handleAddTx} className="flex-1 py-3 text-sm font-bold bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color, textColor }: any) => (
  <div className={`${color} border p-4 rounded-2xl shadow-sm`}>
    <div className="flex items-center gap-2 mb-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
    </div>
    <div className={`text-xl font-bold ${textColor}`}>{value}</div>
  </div>
);

export default FinancesView;
