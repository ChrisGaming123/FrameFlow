import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Wifi, 
  Tv, 
  Sliders, 
  Play, 
  Square, 
  Flame, 
  Settings2, 
  Info, 
  CheckCircle2, 
  Zap, 
  Minimize2,
  TrendingUp,
  BarChart2
} from 'lucide-react';

interface MetricItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  unit: string;
  colorClass: string;
  accentColor: string; // hex
  baseMin: number;
  baseMax: number;
  gameMin: number;
  gameMax: number;
}

const METRICS_POOL: MetricItem[] = [
  {
    id: 'fps',
    name: 'Frames Per Second (FPS)',
    icon: <Tv className="h-4 w-4 text-blue-400" />,
    unit: 'FPS',
    colorClass: 'text-blue-400 border-blue-500/20',
    accentColor: '#3b82f6',
    baseMin: 55,
    baseMax: 60,
    gameMin: 220,
    gameMax: 295
  },
  {
    id: 'ping',
    name: 'Matchmaking Ping',
    icon: <Wifi className="h-4 w-4 text-emerald-400" />,
    unit: 'ms',
    colorClass: 'text-emerald-400 border-emerald-500/20',
    accentColor: '#10b981',
    baseMin: 32,
    baseMax: 38,
    gameMin: 8,
    gameMax: 14
  },
  {
    id: 'cpu',
    name: 'CPU Utilization',
    icon: <Cpu className="h-4 w-4 text-purple-400" />,
    unit: '%',
    colorClass: 'text-purple-400 border-purple-500/20',
    accentColor: '#a855f7',
    baseMin: 4,
    baseMax: 11,
    gameMin: 38,
    gameMax: 54
  },
  {
    id: 'gpu',
    name: 'GPU Core Load',
    icon: <Flame className="h-4 w-4 text-amber-500" />,
    unit: '%',
    colorClass: 'text-amber-500 border-amber-500/20',
    accentColor: '#f59e0b',
    baseMin: 2,
    baseMax: 8,
    gameMin: 84,
    gameMax: 96
  },
  {
    id: 'ram',
    name: 'System RAM Allocation',
    icon: <Activity className="h-4 w-4 text-pink-400" />,
    unit: 'GB',
    colorClass: 'text-pink-400 border-pink-500/20',
    accentColor: '#ec4899',
    baseMin: 7.2,
    baseMax: 7.6,
    gameMin: 11.2,
    gameMax: 12.8
  }
];

export default function TelemetryDashboard({
  activeTweaksCount,
  totalTweaksCount
}: {
  activeTweaksCount: number;
  totalTweaksCount: number;
}) {
  const [sessionActive, setSessionActive] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(500); // ms
  const [visibleMetricIds, setVisibleMetricIds] = useState<string[]>(['fps', 'ping', 'cpu', 'gpu', 'ram']);
  const [showConfig, setShowConfig] = useState(false);

  // States to keep running arrays of last 15 ticks for each metric
  const [history, setHistory] = useState<Record<string, number[]>>({
    fps: Array(15).fill(60),
    ping: Array(15).fill(34),
    cpu: Array(15).fill(8),
    gpu: Array(15).fill(4),
    ram: Array(15).fill(7.4)
  });

  const [fpsAverages, setFpsAverages] = useState({
    avg: 245,
    low1: 185,
    high: 295
  });

  // Calculate tweaks optimization efficiency impact
  const speedBoostFactor = activeTweaksCount > 0 ? (activeTweaksCount / totalTweaksCount) : 0;

  // Use interval loop to append random metrics
  useEffect(() => {
    const handleTicker = () => {
      setHistory((prev) => {
        const nextHistory = { ...prev };
        
        METRICS_POOL.forEach((metric) => {
          const arr = [...(prev[metric.id] || Array(15).fill(0))];
          arr.shift();
          
          let minVal = sessionActive ? metric.gameMin : metric.baseMin;
          let maxVal = sessionActive ? metric.gameMax : metric.baseMax;

          // Apply tweak impact offsets!
          if (metric.id === 'fps' && sessionActive) {
            // High active tweaks equals better frames
            const boost = Math.round(speedBoostFactor * 55); 
            minVal += boost;
            maxVal += boost;
          }
          if (metric.id === 'ping' && sessionActive) {
            // High active tweaks equals lower ping
            const reduction = Math.round(speedBoostFactor * 12);
            minVal = Math.max(3, minVal - reduction);
            maxVal = Math.max(7, maxVal - reduction);
          }

          let newValue = minVal + Math.random() * (maxVal - minVal);
          // Limit decimals for CPU/GPU/FPS, keep 1 decimal for RAM
          if (metric.id === 'ram') {
            newValue = Math.round(newValue * 10) / 10;
          } else {
            newValue = Math.round(newValue);
          }

          arr.push(newValue);
          nextHistory[metric.id] = arr;
        });

        // Dynamic low/high recalculations
        if (sessionActive) {
          const activeFpsList = nextHistory.fps || [];
          const average = Math.round(activeFpsList.reduce((a, b) => a + b, 0) / activeFpsList.length);
          setFpsAverages({
            avg: average,
            low1: Math.round(average * 0.78),
            high: Math.round(average * 1.15)
          });
        }

        return nextHistory;
      });
    };

    const interval = setInterval(handleTicker, refreshInterval);
    return () => clearInterval(interval);
  }, [sessionActive, refreshInterval, speedBoostFactor]);

  const handleToggleMetric = (id: string) => {
    setVisibleMetricIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one visible
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Safe helper to compile beautiful SVG stroke commands
  const compileSvgPath = (points: number[], maxLimit: number, minLimit: number) => {
    if (points.length === 0) return '';
    const width = 280;
    const height = 65;
    const padX = width / (points.length - 1);
    
    // Scale points to fits the SVG viewport safely
    const scaled = points.map((p) => {
      let range = maxLimit - minLimit;
      if (range === 0) range = 1;
      const pct = (p - minLimit) / range;
      // SVG top coordinate is 0, so invert scale
      return height - (pct * (height - 10)) - 5;
    });

    return scaled.reduce((acc, y, i) => {
      const x = i * padX;
      return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }, '');
  };

  // Safe helper to compile filled area polygon under lines
  const compileSvgFillPath = (points: number[], maxLimit: number, minLimit: number) => {
    if (points.length === 0) return '';
    const width = 280;
    const height = 65;
    const pathLine = compileSvgPath(points, maxLimit, minLimit);
    if (!pathLine) return '';
    // Append coordinates to drop back to basement line
    return `${pathLine} L ${width} ${height} L 0 ${height} Z`;
  };

  return (
    <div className="space-y-6" id="telemetry-dashboard-tab">
      
      {/* Intro descriptive header block */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-bold text-zinc-150 flex items-center gap-1.5 font-sans">
              <Activity className="h-5 w-5 text-blue-400" />
              Real-time Performance Telemetry
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Displays lightweight, zero-overhead simulated statistics mapped to your active hardware specs. Experience microsecond frame timings, live fluctuations, and custom toggle metrics.
          </p>
        </div>

        {/* Customizable parameters drawer button */}
        <button
          id="btn-toggle-config-panel"
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs font-mono font-medium tracking-wide bg-zinc-900 border border-zinc-800 text-blue-400 px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-inner hover:bg-zinc-850"
        >
          <Settings2 className="h-4 w-4" />
          {showConfig ? 'Close Displays Config' : 'Customize Display Metrics'}
        </button>
      </div>

      {/* Customize metrics display drawer panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5 space-y-4 font-sans text-xs">
              <h4 className="font-semibold text-zinc-200">Configure Dashboard Layout</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {METRICS_POOL.map((m) => {
                  const isChecked = visibleMetricIds.includes(m.id);
                  return (
                    <label 
                      key={m.id} 
                      className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer select-none transition-colors ${
                        isChecked 
                          ? 'bg-zinc-900/40 border-blue-500/20 text-zinc-200' 
                          : 'bg-zinc-950/20 border-zinc-900 text-zinc-500 hover:text-zinc-450'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleMetric(m.id)}
                        className="rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <span className="font-medium truncate">{m.name.split(' ')[0]}</span>
                    </label>
                  );
                })}
              </div>

              {/* Adjust sampling rate */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-zinc-900">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-zinc-500 uppercase block">Telemetry Update Rate (Interval)</span>
                  <p className="text-zinc-450 leading-relaxed text-[11px]">
                    Lower intervals provide higher fidelity curves but simulate dynamic rendering loops more intensely.
                  </p>
                </div>

                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-900 max-w-[320px]">
                  <button
                    id="rate-eco"
                    onClick={() => setRefreshInterval(2000)}
                    className={`py-1 px-3 rounded text-[11px] font-sans font-medium hover:text-zinc-105 cursor-pointer ${
                      refreshInterval === 2000 ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500'
                    }`}
                  >
                    Eco (2.0s)
                  </button>
                  <button
                    id="rate-normal"
                    onClick={() => setRefreshInterval(500)}
                    className={`py-1 px-3 rounded text-[11px] font-sans font-medium hover:text-zinc-105 cursor-pointer ${
                      refreshInterval === 500 ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500'
                    }`}
                  >
                    Normal (0.5s)
                  </button>
                  <button
                    id="rate-perf"
                    onClick={() => setRefreshInterval(150)}
                    className={`py-1 px-3 rounded text-[11px] font-sans font-medium hover:text-zinc-105 cursor-pointer ${
                      refreshInterval === 150 ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500'
                    }`}
                  >
                    High Fidelity (0.15s)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stats Dock Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Game Simulation Switcher Box */}
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-blue-400 font-semibold tracking-wider uppercase block">SIMULATOR STATE ENGINE</span>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans">Active Game Session Switch</h3>
            <p className="text-xs text-zinc-400 leading-normal font-sans">
              Toggle this state engine to simulate hardware loads representing a heavy competitive gaming session in Full High Definition (1080p Exclusive) mode.
            </p>
          </div>

          <div className="space-y-3 font-mono text-[10.5px]">
            <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-900 pb-2">
              <span>ACTIVE PROFILE:</span>
              <span className="text-zinc-300 font-semibold uppercase">{activeTweaksCount > 0 ? 'TUNED FLOWS' : 'FACTORY DEFAULT'}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-900 pb-2">
              <span>TELEM CPU OVERHEAD:</span>
              <span className="text-emerald-400 font-semibold">0.01% (LIGHTWEIGHT)</span>
            </div>
          </div>

          <button
            id="btn-toggle-telemetry-session"
            onClick={() => setSessionActive(!sessionActive)}
            className={`w-full py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              sessionActive 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
            }`}
          >
            {sessionActive ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" /> Stop Gaming Simulator
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Simulate Gaming Load
              </>
            )}
          </button>
        </div>

        {/* Map individual telemetry cards */}
        {METRICS_POOL.filter((m) => visibleMetricIds.includes(m.id)).map((metric) => {
          const ticks = history[metric.id] || Array(15).fill(0);
          const currentReading = ticks[ticks.length - 1];
          
          let minRange = sessionActive ? metric.gameMin : metric.baseMin;
          let maxRange = sessionActive ? metric.gameMax : metric.baseMax;
          if (metric.id === 'fps' && sessionActive) {
            const boost = Math.round(speedBoostFactor * 55);
            minRange += boost;
            maxRange += boost;
          }
          if (metric.id === 'ping' && sessionActive) {
            const reduction = Math.round(speedBoostFactor * 12);
            minRange = Math.max(3, minRange - reduction);
            maxRange = Math.max(7, maxRange - reduction);
          }

          const pathStr = compileSvgPath(ticks, maxRange, minRange);
          const fillPathStr = compileSvgFillPath(ticks, maxRange, minRange);

          return (
            <div
              id={`telemetry-card-${metric.id}`}
              key={metric.id}
              className="rounded-xl border border-zinc-800 bg-[#0d0d10]/30 p-5 flex flex-col justify-between space-y-4 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{metric.name.split(' (')[0]}</span>
                {metric.icon}
              </div>

              <div className="relative z-10 flex items-baseline gap-1.5 py-1">
                <span className="text-3xl font-bold font-mono tracking-tight text-zinc-50">
                  {currentReading}
                </span>
                <span className="text-xs font-mono text-zinc-500 font-semibold uppercase">{metric.unit}</span>
                
                {sessionActive && metric.id === 'fps' && (
                  <span className="text-[9.5px] font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/15 py-0.5 px-1.5 rounded ml-auto">
                    AVG: {fpsAverages.avg}
                  </span>
                )}
                {sessionActive && metric.id === 'ping' && (
                  <span className="text-[9.5px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 py-0.5 px-1.5 rounded ml-auto">
                    JITTER: ±1ms
                  </span>
                )}
              </div>

              {/* Sparkline curve rendering node */}
              <div className="h-[65px] bg-zinc-950/40 rounded-lg border border-zinc-900 relative overflow-hidden flex items-end">
                {/* Horizontal reference grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 px-1 select-none pointer-events-none opacity-10">
                  <div className="border-t border-dashed border-zinc-400 w-full" />
                  <div className="border-t border-dashed border-zinc-400 w-full" />
                  <div className="border-t border-dashed border-zinc-400 w-full" />
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 280 65" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`gradient-${metric.id}`} x1="0" y1="y1" x2="0" y2="1">
                      <stop offset="0%" stopColor={metric.accentColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={metric.accentColor} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  {fillPathStr && (
                    <path 
                      d={fillPathStr} 
                      fill={`url(#gradient-${metric.id})`}
                      className="transition-all duration-300 ease-in-out"
                    />
                  )}

                  {/* Core Stroke line curve */}
                  {pathStr && (
                    <path 
                      d={pathStr} 
                      fill="none" 
                      stroke={metric.accentColor} 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300 ease-in-out"
                    />
                  )}
                </svg>
              </div>
            </div>
          );
        })}

        {/* Secondary panel for FPS averages if FPS is being monitored */}
        {visibleMetricIds.includes('fps') && sessionActive && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-5 flex flex-col justify-between md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              Calculated Live Render Benchmarks
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/40 text-center">
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">AVERAGE TIMING RATE</span>
                <span className="text-lg font-bold text-zinc-200">{fpsAverages.avg} Frames/sec</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/40 text-center">
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">1% LATENCY LOWS</span>
                <span className="text-lg font-bold text-blue-400">{fpsAverages.low1} Frames/sec</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/40 text-center">
                <span className="text-[10px] text-zinc-500 block uppercase mb-1">STABILIZED MAX RENDERS</span>
                <span className="text-lg font-bold text-zinc-200">{fpsAverages.high} Frames/sec</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
