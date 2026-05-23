import React, { useState, useEffect } from 'react';
import { SERVER_LIST } from '../data/gamesData';
import { Wifi, Activity, Terminal, Play, CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface LatencySimulatorProps {
  activeTweaksCount: number;
  totalTweaksCount: number;
}

export default function LatencySimulator({ activeTweaksCount, totalTweaksCount }: LatencySimulatorProps) {
  const [selectedServerId, setSelectedServerId] = useState(SERVER_LIST[0].id);
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testComplete, setTestComplete] = useState(false);
  const [pingStats, setPingStats] = useState<{ stock: number; optimized: number; jitter: number; loss: number } | null>(null);

  const selectedServer = SERVER_LIST.find((s) => s.id === selectedServerId)!;

  // Compute calculated ping reduction based on loaded tweaks
  const reductionRatio = Math.min(0.48, (activeTweaksCount / totalTweaksCount) * 0.45); // up to 45% reduction

  const runLatencyTest = () => {
    setTesting(true);
    setTestComplete(false);
    setLogs([]);
    setPingStats(null);

    const steps = [
      `Initializing TCP DSCP Game Port Quality of Service matching...`,
      `Testing ICMP connection handshake to ${selectedServer.name} [IP: ${104 + Math.floor(Math.random() * 50)}.${16 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 254)}]`,
      `Hop 1: 192.168.1.1 (Local Gateway Input Buffer) latency detected...`,
      `Hop 4: Core edge ISP nodes parsed. Nagle's TCP queue throttle checking...`,
      `Hop 7: Fiber distribution trunk matching packet flags...`,
      `Hop 11: Game Server Lobby cluster resolved. Measuring dynamic jitter spikes...`,
      `Routing audit complete. Computing FrameFlow adapter performance differentials.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs((prev) => [...prev, `[Ready] ${steps[currentStep]}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTesting(false);
        setTestComplete(true);

        // Calculate and save metrics
        const stockPing = selectedServer.basePing;
        const optimizedPing = Math.max(3, Math.round(stockPing * (1 - reductionRatio)));
        const stockJitter = Math.max(1, Math.round(stockPing * 0.15));
        const optimizedJitter = Math.max(1, Math.round(stockJitter * 0.3)); // significant drop in jitter
        
        setPingStats({
          stock: stockPing,
          optimized: optimizedPing,
          jitter: Math.max(1, optimizedJitter),
          loss: reductionRatio > 0.3 ? 0 : 1 // 0% packet loss with optimizations
        });
      }
    }, 700);
  };

  return (
    <div className="space-y-6" id="latency-tab">
      <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
        <Wifi className="h-5 w-5 text-blue-400" />
        Competitive Routing & Latency Diagnostic Center
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left 2 columns: Server Selector & Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-5 space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              Select Server Region
            </h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 font-sans">
              {SERVER_LIST.map((srv) => (
                <button
                  key={srv.id}
                  id={`btn-server-${srv.id}`}
                  onClick={() => {
                    setSelectedServerId(srv.id);
                    setTestComplete(false);
                    setPingStats(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    selectedServerId === srv.id
                      ? 'bg-blue-500/10 border-blue-500/35 text-blue-400 font-semibold shadow-sm'
                      : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{srv.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{srv.region}</p>
                  </div>
                  <span className="font-mono">{srv.basePing} ms (base)</span>
                </button>
              ))}
            </div>

            <button
              id="btn-run-latency"
              disabled={testing}
              onClick={runLatencyTest}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-all font-sans cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-[1.01] active:scale-[0.99]"
            >
              <Terminal className="h-4 w-4" />
              {testing ? 'Analyzing route...' : 'Test Competitive Route'}
            </button>
          </div>
        </div>

        {/* Right 3 columns: Terminal & Real-Time Statistics */}
        <div className="lg:col-span-3 space-y-6">
          {/* Diagnostic Console Log */}
          <div className="rounded-xl bg-black border border-zinc-800 p-5 font-mono text-xs text-zinc-300 min-h-[160px] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3 text-[10px] text-zinc-500">
                <span>COMPETITIVE HOP AUDIT LOG</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
              </div>

              {logs.length === 0 ? (
                <p className="text-zinc-500 italic py-4 font-sans text-xs">Click "Test Competitive Route" to trace network latency parameters...</p>
              ) : (
                <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <p>{log}</p>
                    </div>
                  ))}
                  {testing && (
                    <div className="flex items-center gap-1.5 text-zinc-500 pl-4 animate-pulse">
                      <span>Analyzing packet queues...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Test Outcomes / Result card */}
          {testComplete && pingStats && (
            <div className="rounded-xl bg-zinc-900/10 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-150 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                Optimization Diagnosis
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">STOCK PING</span>
                  <span className="text-xl font-bold text-zinc-400 font-mono">{pingStats.stock} ms</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">TUNED PING</span>
                  <span className="text-xl font-bold text-blue-400 font-mono">{pingStats.optimized} ms</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">JITTER REDUCTION</span>
                  <span className="text-xl font-bold text-blue-400 font-mono">-{Math.round((1 - pingStats.jitter / (pingStats.stock * 0.15)) * 100)}% Jitter</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">PACKET LOSS</span>
                  <span className="text-xl font-bold text-[#adff2f] font-mono">{pingStats.loss}% loss</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15 text-xs text-zinc-400 flex gap-2.5 font-sans">
                <Info className="h-4.5 w-4.5 text-blue-450 shrink-0 mt-0.5" />
                <p>
                  Deploying FrameFlow network configurations completely optimizes TCP Window Auto-Tuning scales, registers TCPAckFrequency immediately, and forces your Network Interface Card to skip Green energy throttles while gaming.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
