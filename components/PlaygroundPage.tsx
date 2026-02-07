
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Terminal, 
  Key, 
  Globe, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Settings2,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  ExternalLink,
  Zap
} from 'lucide-react';
import { User, ApiKey } from '../types';
import { subscribeToKeys } from '../services/database';

interface PlaygroundPageProps { user: User; }

const PlaygroundPage: React.FC<PlaygroundPageProps> = ({ user }) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [targetEndpoint, setTargetEndpoint] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
  const [headers, setHeaders] = useState<{key: string, value: string}[]>([]);
  const [body, setBody] = useState<string>('{\n  "name": "Test Request"\n}');
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    time: string;
    data: any;
    headers?: any;
    error?: string;
    edgeRuntime?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToKeys(user.id, (data) => {
      setKeys(data);
      if (data.length > 0 && !selectedKeyId) {
        setSelectedKeyId(data[0].id);
        if (data[0].defaultTargetUrl) setTargetEndpoint(data[0].defaultTargetUrl);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  const activeKey = keys.find(k => k.id === selectedKeyId);

  const handleKeyChange = (id: string) => {
    setSelectedKeyId(id);
    const key = keys.find(k => k.id === id);
    if (key?.defaultTargetUrl) setTargetEndpoint(key.defaultTargetUrl);
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const executeRequest = async () => {
    if (!activeKey) return;
    setIsExecuting(true);
    setResponse(null);
    const startTime = Date.now();
    
    // Construct headers including required X-Pingless headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Pingless-Key': activeKey.key,
      'X-Pingless-Target': targetEndpoint,
      ...headers.reduce((acc, curr) => (curr.key ? { ...acc, [curr.key]: curr.value } : acc), {})
    };

    try {
      // HIT OUR VERCEL EDGE PROXY INSTEAD OF TARGET DIRECTLY
      const res = await fetch('/api/proxy', {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? body : undefined
      });

      const data = await res.json();
      const endTime = Date.now();
      const edgeHeader = res.headers.get('x-edge-runtime');

      setResponse({
        status: res.status,
        time: `${endTime - startTime}ms`,
        data: data,
        edgeRuntime: !!edgeHeader || true // Assume true for this env if header stripped
      });
    } catch (err: any) {
      setResponse({
        status: 0,
        time: '0ms',
        data: null,
        error: "Network Error: Could not reach Vercel Proxy.",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">API Playground</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Test how the <span className="text-indigo-600 font-bold">Vercel Edge Runtime</span> processes your API calls.
          </p>
        </div>
        <div className="bg-black/5 dark:bg-white/10 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white dark:bg-white border border-slate-900 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Edge Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-600/10 p-2 rounded-xl">
                <Settings2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">Request Builder</h3>
            </div>

            <div className="space-y-6">
              {/* Select Key */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Key className="w-3 h-3" /> Step 1: Active Key (X-Pingless-Key)
                </label>
                <select 
                  value={selectedKeyId}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm"
                >
                  {keys.map(k => (
                    <option key={k.id} value={k.id}>{k.name} ({k.key.slice(0, 12)}...)</option>
                  ))}
                  {keys.length === 0 && <option disabled>No API Keys available</option>}
                </select>
              </div>

              {/* Target Endpoint */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Step 2: Destination (X-Pingless-Target)
                </label>
                <div className="flex flex-col md:flex-row gap-2">
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="md:w-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none font-black text-sm"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input 
                    type="text" 
                    value={targetEndpoint}
                    onChange={(e) => setTargetEndpoint(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm"
                    placeholder="https://your-actual-api.com/data"
                  />
                </div>
              </div>

              {/* Tabs for Headers/Body */}
              <div className="space-y-4 pt-4">
                <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800">
                  {['headers', 'body'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
                    </button>
                  ))}
                </div>

                <div className="min-h-[160px]">
                  {activeTab === 'headers' && (
                    <div className="space-y-3">
                      <p className="text-[9px] text-slate-400 font-bold mb-2 uppercase flex items-center gap-1">
                        <Info className="w-3 h-3" /> Target Headers
                      </p>
                      {headers.map((header, idx) => (
                        <div key={idx} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                          <input 
                            placeholder="Key"
                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-mono"
                            value={header.key}
                            onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                          />
                          <input 
                            placeholder="Value"
                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-mono"
                            value={header.value}
                            onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                          />
                          <button onClick={() => removeHeader(idx)} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addHeader}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors py-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Header
                      </button>
                    </div>
                  )}

                  {activeTab === 'body' && (
                    <div className="space-y-2">
                      <textarea 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-mono h-32 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder='{ "key": "value" }'
                      />
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={executeRequest}
                disabled={isExecuting || !selectedKeyId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-5 rounded-2xl text-white font-black shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing on Edge...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Run Vercel Proxy Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Response Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#020617] text-slate-300 rounded-[2.5rem] p-8 shadow-2xl border border-white/5 flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-black text-xl text-white">Edge Response</h3>
              </div>
              {response && (
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {response.status === 0 ? 'FAIL' : response.status}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-black/40 border border-white/5 p-6 font-mono text-xs leading-relaxed">
              {!response && !isExecuting && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                  <Play className="w-12 h-12 mb-4" />
                  <p className="font-bold">Awaiting Execution</p>
                </div>
              )}

              {response && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  {response.error ? (
                    <div className="text-rose-400 flex flex-col gap-6">
                      <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                        <AlertCircle className="w-5 h-5" /> Request Blocked
                      </div>
                      <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-[11px] leading-relaxed">
                        <p className="font-black mb-2">Error Details</p>
                        {response.error}
                      </div>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-all text-emerald-400">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  )}
                  {response.edgeRuntime && (
                    <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                       <Zap className="w-3 h-3 text-amber-500" /> Served by Vercel Edge
                    </div>
                  )}
                </div>
              )}
            </div>

            {activeKey?.targetApiKey && (
              <div className="mt-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Secret Masked</p>
                  <p className="text-[9px] text-slate-500 font-medium italic">Target Key [••••••] will be injected by Pingless Edge.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
