import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Cpu, 
  Wifi, 
  Sliders, 
  ShieldAlert, 
  Activity, 
  Monitor,
  Settings,
  Gamepad,
  SlidersHorizontal
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import TweakManager from './components/TweakManager';
import FpsCalculator from './components/FpsCalculator';
import LatencySimulator from './components/LatencySimulator';
import GameProfiles from './components/GameProfiles';
import AdvancedTweaks from './components/AdvancedTweaks';
import TelemetryDashboard from './components/TelemetryDashboard';

import PowerPlan from './components/PowerPlan';
import { BatteryCharging } from 'lucide-react';

import { ALL_TWEAKS, FPS_TWEAKS_COUNT, PING_TWEAKS_COUNT } from './data/tweaksData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tweaks' | 'profiles' | 'advanced' | 'calculator' | 'latency' | 'telemetry' | 'powerplan'>('dashboard');
  const [activeTweaks, setActiveTweaks] = useState<string[]>([]);
  const [activePowerPlanId, setActivePowerPlanId] = useState<string>(() => {
    try {
      return localStorage.getItem('frameflow-active-power-plan') || 'power-balanced';
    } catch (e) {
      return 'power-balanced';
    }
  });

  const totalTweaksCount = ALL_TWEAKS.length;

  // Single-tweak toggle selection action
  const handleToggleTweak = (id: string) => {
    setActiveTweaks((prev) => 
      prev.includes(id) 
        ? prev.filter((item) => item !== id) 
        : [...prev, id]
    );
  };

  // Grouped category toggler (Enable / Disable all in category)
  const handleToggleMultipleTweaks = (ids: string[], enable: boolean) => {
    setActiveTweaks((prev) => {
      // Filter out target IDs first
      const base = prev.filter((item) => !ids.includes(item));
      return enable ? [...base, ...ids] : base;
    });
  };

  // Turn on all tweaks in the database
  const handleOptimizeAll = () => {
    const allIds = ALL_TWEAKS.map((tweaker) => tweaker.id);
    setActiveTweaks(allIds);
  };

  // Turn off all tweaks in the database
  const handleRevertAll = () => {
    setActiveTweaks([]);
  };

  const optimizationPercentage = Math.round((activeTweaks.length / totalTweaksCount) * 100);

  const powerPlanFpsBoost = useMemo(() => {
    if (activePowerPlanId === 'power-high') return 22;
    if (activePowerPlanId === 'power-ultimate') return 38;
    if (activePowerPlanId === 'power-frameflow') return 55;
    return 0;
  }, [activePowerPlanId]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-0 sm:p-4 font-sans antialiased text-zinc-300">
      {/* Outer frame styling for modern local PC desktop application look */}
      <div className="w-full max-w-6xl bg-[#09090b] border border-zinc-800 rounded-none sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative min-h-[640px]">
        
        {/* Navigation / Control Title bar */}
        <header className="bg-[#0d0d10] border-b border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Zap className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display tracking-tight text-white leading-none">
                  FrameFlow
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-medium">v1.4.0-STABLE</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Competitive Tuning Control Hub</p>
            </div>
          </div>

          {/* Persistent global score panel */}
          <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 font-mono text-xs">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block leading-none uppercase">TUNING MATRIX</span>
              <span className="font-semibold text-zinc-300">{activeTweaks.length} / {totalTweaksCount} Deployed</span>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 uppercase">STATUS:</span>
              <span className={`font-bold ${optimizationPercentage > 85 ? 'text-blue-400' : 'text-amber-400'}`}>
                {optimizationPercentage === 0 ? 'STOCK' : 
                 optimizationPercentage < 40 ? 'LOW OPTIMIZED' : 
                 optimizationPercentage < 80 ? 'HIGH PERF' : 'EXTREME LOCK'}
              </span>
            </div>
          </div>
        </header>

        {/* Main application splits */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-56 bg-[#0d0d10] border-b md:border-b-0 md:border-r border-zinc-800 p-4 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
            
            <button
              id="sidebar-nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Monitor className="h-4 w-4" />
              Dynamic Dashboard
            </button>

            <button
              id="sidebar-nav-tweaks"
              onClick={() => setActiveTab('tweaks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'tweaks'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Sliders className="h-4 w-4" />
              Optimizations
            </button>

            <button
              id="sidebar-nav-profiles"
              onClick={() => setActiveTab('profiles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'profiles'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Gamepad className="h-4 w-4" />
              Game Profiles
            </button>

            <button
              id="sidebar-nav-advanced"
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'advanced'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Overclocker
            </button>

            <button
              id="sidebar-nav-telemetry"
              onClick={() => setActiveTab('telemetry')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'telemetry'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Activity className="h-4 w-4" />
              Performance Details
            </button>

            <button
              id="sidebar-nav-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'calculator'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Cpu className="h-4 w-4" />
              FPS Calculator
            </button>

            <button
              id="sidebar-nav-latency"
              onClick={() => setActiveTab('latency')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'latency'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <Wifi className="h-4 w-4" />
              Latency Diagnostic
            </button>

            <button
              id="sidebar-nav-powerplan"
              onClick={() => setActiveTab('powerplan')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer capitalize whitespace-nowrap md:whitespace-normal justify-center md:justify-start shrink-0 border ${
                activeTab === 'powerplan'
                  ? 'bg-zinc-800/50 text-blue-400 border-blue-500/20'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              <BatteryCharging className="h-4 w-4" />
              Power Plan
            </button>

            {/* Minor decorative guide box inside sidebar */}
            <div className="hidden md:block mt-auto p-4 border border-zinc-800 bg-[#0d0d10] rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">QUICK FACT</span>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Nagle's TCP optimization bypasses windows default delayed handshakes, reducing multiplayer server latency by up to 25%.
              </p>
            </div>
          </aside>

          {/* Dashboard Scroll Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-zinc-950/20">
            {activeTab === 'dashboard' && (
              <Dashboard 
                activeTweaks={activeTweaks} 
                optimizeAll={handleOptimizeAll} 
                revertAll={handleRevertAll} 
                totalTweaksCount={totalTweaksCount}
                fpsTweaksCount={FPS_TWEAKS_COUNT}
                pingTweaksCount={PING_TWEAKS_COUNT}
                activePowerPlanId={activePowerPlanId}
              />
            )}

            {activeTab === 'tweaks' && (
              <TweakManager 
                activeTweaks={activeTweaks} 
                toggleTweak={handleToggleTweak} 
                toggleMultipleTweaks={handleToggleMultipleTweaks}
              />
            )}

            {activeTab === 'profiles' && (
              <GameProfiles 
                activeTweaks={activeTweaks} 
                setActiveTweaks={setActiveTweaks} 
                allTweaks={ALL_TWEAKS}
              />
            )}

            {activeTab === 'advanced' && (
              <AdvancedTweaks />
            )}

            {activeTab === 'telemetry' && (
              <TelemetryDashboard 
                activeTweaksCount={activeTweaks.length} 
                totalTweaksCount={totalTweaksCount}
              />
            )}

            {activeTab === 'calculator' && (
              <FpsCalculator 
                activeTweaksCount={activeTweaks.length} 
                totalTweaksCount={totalTweaksCount}
                activePowerPlanId={activePowerPlanId}
              />
            )}

            {activeTab === 'latency' && (
              <LatencySimulator 
                activeTweaksCount={activeTweaks.length} 
                totalTweaksCount={totalTweaksCount}
              />
            )}

            {activeTab === 'powerplan' && (
              <PowerPlan 
                activePlanId={activePowerPlanId}
                onPowerPlanChange={(planId) => setActivePowerPlanId(planId)}
              />
            )}
          </main>
        </div>

        {/* Footer info panels */}
        <footer className="shrink-0 bg-[#0d0d10] border-t border-zinc-800 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono gap-3 leading-none z-10 select-none uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kernel Hook Active
            </span>
            <span className="hidden sm:inline text-zinc-800">•</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Latency Mode: Ultra
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-400 font-semibold">
              FPS BOOST: +{Math.round(activeTweaks.filter((id) => !id.startsWith('tcp') && !id.startsWith('dns') && !id.startsWith('nic') && !id.startsWith('qos')).length * 1.1) + powerPlanFpsBoost} FPS
            </span>
            <span className="text-zinc-800">•</span>
            <span>v1.4.0-STABLE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
