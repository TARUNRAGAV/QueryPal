import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import mermaid from 'mermaid';

// --- UTILITIES ---
const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
  const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const exportToPNG = async (elementRef, filename = 'chart.png') => {
  if (elementRef.current) {
    const canvas = await html2canvas(elementRef.current, { backgroundColor: '#ffffff', scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  }
};

const StreamText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0; setDisplayed('');
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(prev => prev + text.charAt(i)); i++; } 
      else clearInterval(timer);
    }, 12);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayed}</span>;
};

// --- RENDERERS ---
const MermaidRenderer = ({ chartCode, onPin, disablePin }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    if (ref.current && chartCode) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chartCode.replace(/```mermaid/g, '').replace(/```/g, '').trim())
        .then(({ svg }) => { if (ref.current) ref.current.innerHTML = svg; })
        .catch(err => console.error(err));
    }
  }, [chartCode]);

  return (
    <div ref={containerRef} style={{ width: '100%', minHeight: '400px', background: '#ffffff', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', marginTop: '16px' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button onClick={() => exportToPNG(containerRef, 'diagram.png')} style={{ background: '#f1f5f9', color: '#111', border: '1px solid #e2e8f0', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>PNG</button>
        {!disablePin && <button onClick={() => onPin({ type: 'diagram', mermaid_code: chartCode })} style={{ background: '#111', color: '#fff', border: 'none', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>PIN DIAGRAM</button>}
      </div>
      <div ref={ref} style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center', marginTop: '30px', width: '100%' }} />
    </div>
  );
};

const ChartRenderer = ({ result, onPin, disablePin }) => {
  const { chart_type, title, x_axis_key, y_axis_key, data } = result;
  // Tech Hardware Palette: OnePlus Red, Vibrant Orange, Deep Black, Slate Gray
  const COLORS = ['#ea002a', '#ff6b00', '#111111', '#64748b', '#f43f5e']; 
  const chartRef = useRef(null);
  const typeStr = (chart_type || '').toLowerCase();

  return (
    <div ref={chartRef} style={{ width: '100%', height: 550, background: '#ffffff', padding: '32px 24px', borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', marginTop: '16px' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button onClick={() => exportToCSV(data, `${title}.csv`)} style={{ background: '#f1f5f9', color: '#111', border: '1px solid #e2e8f0', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>CSV</button>
        <button onClick={() => exportToPNG(chartRef, `${title}.png`)} style={{ background: '#f1f5f9', color: '#111', border: '1px solid #e2e8f0', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>PNG</button>
        {!disablePin && <button onClick={() => onPin(result)} style={{ background: '#111', color: '#fff', border: 'none', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>PIN CHART</button>}
      </div>
      <h4 style={{ textAlign: 'center', marginBottom: '35px', color: '#111', fontSize: '18px' }}>{title}</h4>
      <ResponsiveContainer width="100%" height="85%">
        {typeStr.includes('bar') ? (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey={x_axis_key} tick={{fill: '#64748b', fontSize: 13}} /><YAxis tick={{fill: '#64748b', fontSize: 13}} /><Tooltip contentStyle={{background: '#ffffff', borderColor: '#ea002a', color: '#111', borderRadius: '0px'}} /><Bar dataKey={y_axis_key} fill="#ea002a" radius={[0,0,0,0]} /></BarChart>
        ) : typeStr.includes('line') ? (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey={x_axis_key} tick={{fill: '#64748b', fontSize: 13}} /><YAxis tick={{fill: '#64748b', fontSize: 13}} /><Tooltip contentStyle={{background: '#ffffff', borderColor: '#ff6b00', color: '#111', borderRadius: '0px'}} /><Line type="monotone" dataKey={y_axis_key} stroke="#ff6b00" strokeWidth={3} dot={{r:5, fill: '#ff6b00'}} /></LineChart>
        ) : typeStr.includes('scatter') ? (
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey={x_axis_key} tick={{fill: '#64748b', fontSize: 13}} /><YAxis dataKey={y_axis_key} tick={{fill: '#64748b', fontSize: 13}} /><Tooltip contentStyle={{background: '#ffffff', borderColor: '#111111', color: '#111', borderRadius: '0px'}} cursor={{strokeDasharray:'3 3'}}/><Scatter name={title} data={data} fill="#111111" /></ScatterChart>
        ) : (
          <PieChart><Pie data={data} dataKey={y_axis_key} nameKey={x_axis_key} cx="50%" cy="50%" outerRadius={150} label={{fill: '#111', fontSize: 13}} stroke="#ffffff" strokeWidth={2}>{data.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{background: '#ffffff', borderColor: '#ea002a', color: '#111', borderRadius: '0px'}} /><Legend wrapperStyle={{paddingTop: '20px'}}/></PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const TableRenderer = ({ data }) => {
  if (!data || !data.length) return null;
  const headers = Object.keys(data[0]);
  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0', position: 'relative', marginTop: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <button onClick={() => exportToCSV(data, 'table.csv')} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', color: '#111', border: '1px solid #e2e8f0', padding: '6px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>CSV</button>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginTop: '24px' }}>
        <thead><tr style={{ borderBottom: '2px solid #111' }}>{headers.map(h => <th key={h} style={{ padding: '12px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h.replace(/_/g, ' ')}</th>)}</tr></thead>
        <tbody>{data.map((r, i) => <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? 'transparent' : '#f8fafc' }}>{headers.map(h => <td key={h} style={{ padding: '12px', color: '#334155' }}>{r[h] !== null ? String(r[h]) : '—'}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [messages, setMessages] = useState([{ sender: 'agent', text: 'QUERYPAL BY STRIKERS ONLINE. READY FOR INPUT.', isTool: false }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  
  // DB State
  const [dashboardItems, setDashboardItems] = useState([]);
  const [queryHistory, setQueryHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const [dashRes, queryRes] = await Promise.all([ axios.get('http://127.0.0.1:8000/api/dashboard'), axios.get('http://127.0.0.1:8000/api/queries') ]);
      setDashboardItems(dashRes.data.map(item => JSON.parse(item.data_json)));
      setQueryHistory(queryRes.data);
    } catch (e) { console.error("History fetch error:", e); }
  };

  useEffect(() => { fetchHistory(); }, [activeTab]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handlePin = async (item) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/dashboard', { type: item.type, data_json: JSON.stringify(item) });
      alert("Asset saved to Dashboard.");
    } catch (e) { alert("Data stream error."); }
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Dictation not supported in this browser.");
    if (isListening) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInput(prev => prev + " " + e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (overrideInput = null) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput(''); setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/chat', { message: textToSend });
      if (res.data.type === 'tool_execution') {
        setMessages(prev => [...prev, { sender: 'agent', text: `[ACTION: ${res.data.tool_name}]`, isTool: true, result: res.data.result }]);
      } else {
        setMessages(prev => [...prev, { sender: 'agent', text: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: "SYSTEM ERROR: UNABLE TO REACH DATA ENGINE." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'transparent' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '30px 20px', zIndex: 50 }}>
        <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
          <h2 style={{ color: '#111', fontSize: '24px', margin: 0, textTransform: 'uppercase' }}>QUERYPAL<br/><span style={{ fontSize: '14px', color: '#64748b' }}>BY STRIKERS</span></h2>
          <p style={{ color: '#ea002a', fontSize: '10px', marginTop: '6px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'monospace' }}> </p>
        </div>
        
        <button onClick={() => {setMessages([{ sender: 'agent', text: 'SYSTEM RESET. AWAITING INPUT.', isTool: false }]); setActiveTab('chat');}} style={{ background: '#ea002a', color: '#fff', padding: '14px', borderRadius: '0px', border: 'none', fontWeight: '900', cursor: 'pointer', marginBottom: '30px', fontSize: '12px', letterSpacing: '1px' }}>
          NEW INQUIRY
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('chat')} style={{ background: activeTab==='chat' ? '#f1f5f9':'transparent', color: '#111', border: 'none', borderLeft: activeTab==='chat' ? '4px solid #ea002a' : '4px solid transparent', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>💬 Interface</button>
          <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab==='dashboard' ? '#f1f5f9':'transparent', color: '#111', border: 'none', borderLeft: activeTab==='dashboard' ? '4px solid #ff6b00' : '4px solid transparent', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('queries')} style={{ background: activeTab==='queries' ? '#f1f5f9':'transparent', color: '#111', border: 'none', borderLeft: activeTab==='queries' ? '4px solid #111' : '4px solid transparent', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>📜 SQL Ledger</button>
        </div>

        <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '16px', borderRadius: '0px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00' }}></div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Status</div>
          </div>
          <div style={{ fontSize: '13px', color: '#111', marginTop: '8px', fontFamily: 'monospace', fontWeight: 'bold' }}>ecommerce.db</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Top Bar */}
        <div style={{ padding: '24px 40px', borderBottom: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 40 }}>
          <h3 style={{ fontSize: '22px', color: '#111' }}>
            {activeTab === 'chat' && 'DATA TERMINAL'}
            {activeTab === 'dashboard' && 'VISUALIZATION DASHBOARD'}
            {activeTab === 'queries' && 'SYSTEM EXECUTION LOG'}
          </h3>
        </div>

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '32px' }}>
                    
                    {msg.sender === 'user' ? (
                      <div style={{ background: '#ea002a', padding: '18px 24px', borderRadius: '0px', color: '#fff', fontSize: '15px', lineHeight: '1.6', maxWidth: '80%', fontWeight: '500' }}>
                        {msg.text}
                      </div>
                    ) : (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '0px', maxWidth: '100%', color: '#111', fontSize: '15px', lineHeight: '1.7', width: msg.isTool ? '100%' : 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        {msg.isTool ? (
                          <div style={{ width: '100%' }}>
                            <span style={{ color: '#ea002a', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>
                              {msg.text}
                            </span>
                            
                            {msg.result?.type === 'chart' ? <ChartRenderer result={msg.result} onPin={handlePin} /> : 
                             msg.result?.type === 'diagram' ? <MermaidRenderer chartCode={msg.result.mermaid_code} onPin={handlePin} /> : 
                             msg.result?.sql ? (
                               <div style={{ marginTop: '20px' }}>
                                 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '0px', fontFamily: 'monospace', fontSize: '13px', color: '#ff6b00', borderLeft: '4px solid #ea002a', border: '1px solid #e2e8f0' }}>
                                   {msg.result.sql}
                                 </div>
                                 <TableRenderer data={msg.result.data} />
                               </div>
                             ) : <pre style={{fontSize: '14px', marginTop: '10px', color: '#64748b'}}>{JSON.stringify(msg.result)}</pre>}
                          </div>
                        ) : <StreamText text={msg.text} />}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ color: '#ff6b00', fontSize: '12px', marginTop: '10px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    Accessing records...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div style={{ padding: '30px 40px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #e2e8f0', zIndex: 40 }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                <button onClick={toggleVoice} style={{ background: isListening ? '#ff6b00' : '#f1f5f9', color: isListening ? '#fff' : '#111', border: '1px solid #e2e8f0', borderRadius: '0px', padding: '0 20px', cursor: 'pointer', fontSize: '18px', transition: 'background 0.3s' }}>🎙️</button>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder={isListening ? "DICTATION ACTIVE..." : "ENTER QUERY (E.G., 'SHOW REVENUE BY CATEGORY')"} style={{ flex: 1, background: '#ffffff', border: '2px solid #e2e8f0', color: '#111', padding: '18px 24px', borderRadius: '0px', outline: 'none', fontSize: '14px', fontWeight: 'bold' }} />
                <button onClick={() => sendMessage()} style={{ background: '#111', color: '#fff', border: 'none', padding: '0 36px', borderRadius: '0px', fontWeight: '900', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Execute</button>
              </div>
            </div>
          </>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '40px' }}>
              {dashboardItems.length === 0 ? <p style={{color:'#64748b', fontSize: '14px', textAlign: 'center', marginTop: '100px', fontWeight: 'bold', textTransform: 'uppercase'}}>DASHBOARD EMPTY. PIN ASSETS FROM THE TERMINAL.</p> : dashboardItems.map((item, idx) => (
                <div key={idx}>{item.type === 'chart' ? <ChartRenderer result={item} disablePin /> : <MermaidRenderer chartCode={item.mermaid_code} disablePin />}</div>
              ))}
            </div>
          </div>
        )}

        {/* QUERIES TAB */}
        {activeTab === 'queries' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {queryHistory.length === 0 ? <p style={{color:'#64748b', fontSize: '14px', textAlign: 'center', marginTop: '100px', fontWeight: 'bold', textTransform: 'uppercase'}}>NO QUERIES EXECUTED YET.</p> : queryHistory.map((q, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0', borderLeft: '4px solid #111', fontFamily: 'monospace', color: '#111', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ color: '#ea002a', fontSize: '11px', marginBottom: '12px', fontWeight: 'bold' }}>
                    LOG ENTRY: {q.timestamp}
                  </div>
                  {q.sql}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}