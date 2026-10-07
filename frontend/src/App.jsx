import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  
  // KYC Form state
  const [userId, setUserId] = useState('user_99218');
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Copilot state
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'copilot', text: 'Hello Analyst. I am your AI Identity Copilot. Ask me anything about verification failures, deepfake alerts, or fraud risk scores.' }
  ]);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('id_document', idFile || new Blob(['dummy'], {type: 'image/png'}));
    formData.append('selfie_video', selfieFile || new Blob(['dummy'], {type: 'video/mp4'}));

    try {
      const res = await fetch('http://localhost:8000/api/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      alert('Verification error');
    } finally {
      setLoading(false);
    }
  };

  const handleAskCopilot = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const newChat = [...chatLog, { sender: 'user', text: question }];
    setChatLog(newChat);
    const qText = question;
    setQuestion('');

    try {
      const res = await fetch('https://enterprise-trust-engine-5geb.vercel.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: qText })
      });
      const data = await res.json();
      setChatLog([...newChat, { sender: 'copilot', text: data.copilot_response }]);
    } catch (err) {
      setChatLog([...newChat, { sender: 'copilot', text: 'Error connecting to AI Copilot service.' }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient glowing gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center shadow-2xl z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            🛡️ EEF DIGITAL TRUST & DEEPFAKE SHIELD
          </h1>
        </div>
        <div className="flex gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white'}`}>
            📊 Executive Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('kyc')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'kyc' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white'}`}>
            🔍 Live KYC & Verification
          </button>
          <button 
            onClick={() => setActiveTab('copilot')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'copilot' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white'}`}>
            🤖 AI Security Copilot
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full z-10">
        
        {/* EXECUTIVE DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Enterprise Threat & Risk Overview</h2>
                <p className="text-sm text-slate-400">Real-time telemetry across 600M annual identity verifications and 8M daily voice calls.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Fully Operational
              </span>
            </div>

            {/* Glowing Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-cyan-500/50 transition-all group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Users</p>
                <p className="text-3xl font-black text-white mt-2 group-hover:scale-105 transition-transform origin-left">{stats?.total_registered_users || '180M'}</p>
                <span className="text-xs text-emerald-400 font-medium mt-2 block">↑ 12% growth this quarter</span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual Verifications</p>
                <p className="text-3xl font-black text-cyan-400 mt-2 group-hover:scale-105 transition-transform origin-left">{stats?.annual_verifications || '600M'}</p>
                <span className="text-xs text-cyan-400 font-medium mt-2 block">⚡ Avg speed: &lt; 1.4s</span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 transition-all group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Success Rate</p>
                <p className="text-3xl font-black text-emerald-400 mt-2 group-hover:scale-105 transition-transform origin-left">{stats?.success_rate || '94.8%'}</p>
                <span className="text-xs text-emerald-400 font-medium mt-2 block">Stable biometric accuracy</span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-rose-500/50 transition-all group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Deepfake Alerts</p>
                <p className="text-3xl font-black text-rose-400 mt-2 group-hover:scale-105 transition-transform origin-left">{stats?.active_deepfake_alerts || '14'}</p>
                <span className="text-xs text-rose-400 font-medium mt-2 block">🚨 Blocked in real-time</span>
              </div>
            </div>

            {/* Bottom Row Dashboard Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Trust Score Distribution Matrix</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">High Trust (85 - 100)</span>
                      <span className="text-emerald-400 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Medium Risk / Review Required (50 - 84)</span>
                      <span className="text-amber-400 font-bold">9%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">High Risk / Synthetic Fraud Blocked (0 - 49)</span>
                      <span className="text-rose-400 font-bold">3%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div className="bg-gradient-to-r from-rose-600 to-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Active AI Pipelines</h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> InsightFace & YOLOv11 Liveness</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span> PaddleOCR Document Forensics</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Neo4j Knowledge Graph Analytics</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> LangGraph Security Copilot</li>
                  </ul>
                </div>
                <button onClick={() => setActiveTab('kyc')} className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 transition">
                  Test Verification Pipeline →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIVE KYC VERIFICATION TAB */}
        {activeTab === 'kyc' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <span>⚡</span> Initiate Biometric & Document Check
              </h2>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">User Identifier</label>
                  <input 
                    type="text" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload ID Document (Passport / National ID)</label>
                  <input 
                    type="file" 
                    onChange={e => setIdFile(e.target.files[0])} 
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 file:cursor-pointer transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload Selfie Video / Liveness Check</label>
                  <input 
                    type="file" 
                    onChange={e => setSelfieFile(e.target.files[0])} 
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 file:cursor-pointer transition" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black tracking-wide py-3.5 rounded-xl shadow-xl shadow-cyan-500/20 hover:opacity-90 transition transform active:scale-95">
                  {loading ? 'Running Multimodal AI Pipelines (< 2s)...' : 'Run Verification & Trust Engine'}
                </button>
              </form>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
                  <span>📊</span> Verification & Analysis Report
                </h2>
                {verificationResult ? (
                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Status:</span>
                      <span className={`font-extrabold px-3 py-1 rounded-full text-xs tracking-wider ${verificationResult.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'}`}>
                        {verificationResult.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Trust Score:</span>
                      <span className="font-black text-cyan-400 text-lg">{verificationResult.metrics.trust_score} / 100</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Liveness Confidence:</span>
                      <span className="font-bold text-emerald-400">{verificationResult.metrics.liveness_confidence * 100}%</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-medium">Deepfake Probability:</span>
                      <span className={verificationResult.metrics.deepfake_probability > 0.5 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {verificationResult.metrics.deepfake_probability * 100}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">{verificationResult.audit_message}</p>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
                    <p className="text-slate-500 text-sm italic">Submit identity documents and video selfie to trigger deepfake & biometric analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI SECURITY COPILOT TAB */}
        {activeTab === 'copilot' && (
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[550px] animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <span>🤖</span> AI Identity Security Copilot
              </h2>
              <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-medium">Model: LangGraph + Hugging Face Transformers</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl rounded-2xl p-4 text-sm shadow-lg leading-relaxed ${chat.sender === 'user' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none' : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAskCopilot} className="flex gap-3">
              <input 
                type="text" 
                value={question} 
                onChange={e => setQuestion(e.target.value)} 
                placeholder="Ask e.g. Why did verification fail? or Show deepfake probability..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition shadow-inner" 
              />
              <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-xl text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition">
                Ask Copilot 🚀
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}