
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  MapPin, 
  Brain, 
  Send, 
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Sparkles,
  Volume2
} from 'lucide-react';
import { 
  setupLiveSession, 
  analyzeRestaurantImage, 
  searchSuppliersOnMaps, 
  performDeepAnalysis 
} from '../services/geminiService';
import { Order, InventoryItem, MenuItem } from '../types';

// Audio decoding helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface AIViewProps {
  orders: Order[];
  inventory: InventoryItem[];
  menu: MenuItem[];
}

const AIView: React.FC<AIViewProps> = ({ orders, inventory, menu }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'vision' | 'maps' | 'thinking'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const liveSessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<any>(null);

  useEffect(() => {
    return () => stopLiveSession();
  }, []);

  const stopLiveSession = () => {
    if (liveSessionRef.current) liveSessionRef.current.close();
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    setIsRecording(false);
  };

  const startLiveVoice = async () => {
    try {
      if (isRecording) {
        stopLiveSession();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new AudioContext({ sampleRate: 16000 });

      const session = await setupLiveSession((message) => {
        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData && audioContextRef.current) {
          const bytes = decode(audioData);
          decodeAudioData(bytes, audioContextRef.current, 24000, 1).then(buffer => {
            const source = audioContextRef.current!.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current!.destination);
            const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
          });
        }
      });

      liveSessionRef.current = session;
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
        const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
        session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
      };
      source.connect(processor);
      processor.connect(inputCtx.destination);
      scriptProcessorRef.current = processor;
      setIsRecording(true);
    } catch (err) {
      alert("Erro ao acessar microfone.");
    }
  };

  const handleAction = async () => {
    if (!inputText && activeTab !== 'vision') return;
    setLoading(true);
    setResponse(null);
    try {
      if (activeTab === 'vision') {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          const res = await analyzeRestaurantImage(file, inputText || "O que você vê?");
          setResponse({ text: res });
        }
      } else if (activeTab === 'maps') {
        const res = await searchSuppliersOnMaps(inputText);
        setResponse(res);
      } else if (activeTab === 'thinking') {
        const res = await performDeepAnalysis(inputText, { orders, inventory });
        setResponse({ text: res });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
          <Sparkles className="text-emerald-600" size={24} />
          Assistente IA
        </h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1">Gestão inteligente por voz e visão.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
        <TabButton active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} icon={<Mic size={18} />} label="Voz" />
        <TabButton active={activeTab === 'vision'} onClick={() => setActiveTab('vision')} icon={<Camera size={18} />} label="Visão" />
        <TabButton active={activeTab === 'maps'} onClick={() => setActiveTab('maps')} icon={<MapPin size={18} />} label="Mapa" />
        <TabButton active={activeTab === 'thinking'} onClick={() => setActiveTab('thinking')} icon={<Brain size={18} />} label="Deep" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col min-h-[400px]">
        <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center">
          {activeTab === 'voice' ? (
            <div className="text-center space-y-6">
              <button 
                onClick={startLiveVoice}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-emerald-600 shadow-lg shadow-emerald-100'} text-white`}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              <p className="font-bold text-slate-800 text-sm md:text-base">{isRecording ? "Ouvindo..." : "Toque para falar"}</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {activeTab === 'vision' && (
                <label className="block w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden cursor-pointer bg-slate-50">
                  {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs"><ImageIcon size={32} /><span>Carregar Foto</span></div>}
                  <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) { const r = new FileReader(); r.onload = () => setPreviewImage(r.result as string); r.readAsDataURL(file); }
                  }} />
                </label>
              )}
              <div className="relative">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl h-24 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={handleAction} disabled={loading} className="absolute bottom-3 right-3 bg-emerald-600 text-white p-2 rounded-xl">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {response && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-xs md:text-sm">
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">{response.text}</div>
            {response.sources?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {response.sources.map((c: any, i: number) => c.maps && <a key={i} href={c.maps.uri} target="_blank" className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] text-emerald-600 flex items-center gap-1">{c.maps.title} <ExternalLink size={10} /></a>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${active ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default AIView;
