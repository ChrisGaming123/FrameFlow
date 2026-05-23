import React, { useState, useMemo } from 'react';
import { GAMES_LIST, CPU_SPECS, GPU_SPECS } from '../data/gamesData';
import { Zap, Cpu, Award, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';

interface FpsCalculatorProps {
  activeTweaksCount: number;
  totalTweaksCount: number;
  activePowerPlanId?: string;
}

export default function FpsCalculator({ activeTweaksCount, totalTweaksCount, activePowerPlanId }: FpsCalculatorProps) {
  const [selectedGameId, setSelectedGameId] = useState(GAMES_LIST[0].id);
  const [selectedCpuId, setSelectedCpuId] = useState(CPU_SPECS[2].id);
  const [selectedGpuId, setSelectedGpuId] = useState(GPU_SPECS[2].id);

  const selectedGame = useMemo(() => GAMES_LIST.find((g) => g.id === selectedGameId)!, [selectedGameId]);
  const selectedCpu = useMemo(() => CPU_SPECS.find((c) => c.id === selectedCpuId)!, [selectedCpuId]);
  const selectedGpu = useMemo(() => GPU_SPECS.find((g) => g.id === selectedGpuId)!, [selectedGpuId]);

  // Performance calculations:
  const performanceSpecsMultiplier = useMemo(() => {
    // combine cpu and gpu multipliers
    return (selectedCpu.multiplier + selectedGpu.multiplier) / 2;
  }, [selectedCpu, selectedGpu]);

  // Let's compute FPS based on hardware spec and game base figures
  const baseFps = useMemo(() => {
    const minFps = selectedGame.baseFpsLowSpec;
    const maxFps = selectedGame.baseFpsHighSpec;
    
    // interpolation based on performanceSpecsMultiplier (typically from 0.65 to 1.7)
    // we scale between low-spec and high-spec bounds
    const scale = Math.min(1, Math.max(0, (performanceSpecsMultiplier - 0.6) / 1.2));
    const rawFps = minFps + scale * (maxFps - minFps);
    return Math.round(rawFps);
  }, [selectedGame, performanceSpecsMultiplier]);

  // Compute Latency based on spec
  const baseLatency = useMemo(() => {
    const maxLat = selectedGame.baseLatencyLowSpec;
    const minLat = selectedGame.baseLatencyHighSpec;
    const scale = Math.min(1, Math.max(0, (performanceSpecsMultiplier - 0.6) / 1.2));
    const rawLat = maxLat - scale * (maxLat - minLat);
    return Math.round(rawLat);
  }, [selectedGame, performanceSpecsMultiplier]);

  // FrameFlow Active Optimizer boost scaling
  // Every active tweak gives a fractional boost
  const tweakRatio = totalTweaksCount > 0 ? activeTweaksCount / totalTweaksCount : 0;
  
  // Power Plan Bonus
  const powerPlanBonusPercentage = useMemo(() => {
    if (activePowerPlanId === 'power-high') return 0.05;
    if (activePowerPlanId === 'power-ultimate') return 0.12;
    if (activePowerPlanId === 'power-frameflow') return 0.20;
    return 0;
  }, [activePowerPlanId]);

  const powerPlanLatencyReductionMultiplier = useMemo(() => {
    if (activePowerPlanId === 'power-high') return 0.90;
    if (activePowerPlanId === 'power-ultimate') return 0.80;
    if (activePowerPlanId === 'power-frameflow') return 0.65;
    return 1.0;
  }, [activePowerPlanId]);

  // Max possible boost with 100% optimizations is up to 18-24% FPS gain, and 40-50% input lag drop
  const optimizedFps = useMemo(() => {
    const maxGainPercentage = 0.222; // ~22.2% boost potential
    const gainFactor = 1 + (tweakRatio * maxGainPercentage) + powerPlanBonusPercentage;
    return Math.round(baseFps * gainFactor);
  }, [baseFps, tweakRatio, powerPlanBonusPercentage]);

  const optimizedLatency = useMemo(() => {
    const maxReductionPercentage = 0.45; // ~45% speed latency lower
    const reductionFactor = (1 - (tweakRatio * maxReductionPercentage)) * powerPlanLatencyReductionMultiplier;
    return Math.max(2, Math.round(baseLatency * reductionFactor));
  }, [baseLatency, tweakRatio, powerPlanLatencyReductionMultiplier]);

  const fpsGained = optimizedFps - baseFps;
  const latencyReduced = baseLatency - optimizedLatency;

  return (
    <div className="space-y-6" id="calculator-tab">
      {/* Title */}
      <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-blue-400" />
        Game Performance & Latency Calculator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Selectors */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-5 space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              HARDWARE CONFIGURATION
            </h3>

            {/* CPU Select */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs text-zinc-400 block font-mono">Processor (CPU)</label>
              <select
                id="select-cpu"
                value={selectedCpuId}
                onChange={(e) => setSelectedCpuId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CPU_SPECS.map((cpu) => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Select */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs text-zinc-400 block font-mono">Graphics (GPU)</label>
              <select
                id="select-gpu"
                value={selectedGpuId}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {GPU_SPECS.map((gpu) => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Competitive Game */}
            <div className="space-y-1.5 font-sans">
              <label className="text-xs text-zinc-400 block font-mono">Choose Game Title</label>
              <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {GAMES_LIST.map((game) => (
                  <button
                    key={game.id}
                    id={`btn-select-game-${game.id}`}
                    onClick={() => setSelectedGameId(game.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      selectedGameId === game.id
                        ? 'bg-blue-500/10 border-blue-500/25 text-blue-400 font-semibold shadow-sm'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                    }`}
                  >
                    <span className="font-semibold">{game.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{game.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Graphs & Results panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparison Card */}
          <div className="rounded-xl bg-zinc-900/10 border border-zinc-800/80 p-6 space-y-6 relative overflow-hidden">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-450" />
              Estimated Performance Benchmark for {selectedGame.name}
            </h3>

            {/* Result Stats Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">FPS DEPLOYMENT RESULT</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-blue-400 font-mono">
                    {optimizedFps} FPS
                  </span>
                  <span className="text-xs text-zinc-400">
                    vs {baseFps} stock
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-2 flex items-center gap-1.5">
                  <span className="text-blue-400 font-bold font-sans">+{fpsGained} FPS Boost</span>
                  <span>({Math.round((fpsGained / baseFps) * 100)}% FPS Gain)</span>
                </div>
              </div>

              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-850">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SYSTEM INPUT LATENCY</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-blue-400 font-mono">
                    {optimizedLatency} ms
                  </span>
                  <span className="text-xs text-zinc-400">
                    vs {baseLatency}ms stock
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-2 flex items-center gap-1.5">
                  <span className="text-blue-400 font-bold font-sans">-{latencyReduced} ms Reduced</span>
                  <span>({Math.round((latencyReduced / baseLatency) * 100)}% Input Lag Low)</span>
                </div>
              </div>
            </div>

            {/* Custom Visual Performance Charts */}
            <div className="space-y-4">
              {/* Graphic 1: FPS comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Frame Delivery Speed (FPS) - Higher is Better</span>
                  <span className="text-zinc-300 font-bold">{optimizedFps} FPS Max</span>
                </div>
                <div className="space-y-2">
                  {/* Stock PC bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-zinc-500 font-sans">
                      <span>Stock Configuration</span>
                      <span>{baseFps} FPS</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-zinc-700 rounded-full transition-all duration-300" 
                        style={{ width: `${(baseFps / 450) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Optimized PC bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-blue-400 font-sans">
                      <span className="font-semibold">FrameFlow Optimized</span>
                      <span className="font-bold">{optimizedFps} FPS</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-blue-500/10">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                        style={{ width: `${(optimizedFps / 450) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic 2: Latency comparison */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Input Lag & Click Response (ms) - Lower is Better</span>
                  <span className="text-blue-400 font-bold">{optimizedLatency} ms Low</span>
                </div>
                <div className="space-y-2">
                  {/* Stock PC bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-zinc-500 font-sans">
                      <span>Stock Configuration</span>
                      <span>{baseLatency} ms</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                      {/* Calculate width where 0ms is full (but we inverse so longer bar means worse latency) */}
                      <div 
                        className="h-full bg-rose-500/60 rounded-full transition-all duration-300" 
                        style={{ width: `${(baseLatency / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Optimized PC bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-blue-400">
                      <span className="font-semibold text-xs">FrameFlow Optimized</span>
                      <span className="font-bold text-xs">{optimizedLatency} ms</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-blue-500/10">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                        style={{ width: `${(optimizedLatency / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on active selections */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Selected Specs Quality: <b className="text-zinc-300 font-mono capitalize">{selectedCpu.tier} End Spec Core</b></span>
              <span>Based on <b>{activeTweaksCount}</b> active FrameFlow tweaks deployed</span>
            </div>
          </div>

          {/* Action Reminder Banner */}
          {activeTweaksCount < totalTweaksCount && (
            <div className="rounded-xl border border-zinc-850 p-4 bg-zinc-950/40 text-xs text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                You are currently achieving only a partial performance boost. Deploy more optimization tweaks!
              </span>
              <span className="font-semibold text-zinc-200">
                {activeTweaksCount} / {totalTweaksCount} Deployed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
