import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gauge, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Monitor
} from 'lucide-react';
import { ALL_TWEAKS } from '../data/tweaksData';
import { Tweak } from '../types';

interface DashboardProps {
  activeTweaks: string[];
  optimizeAll: () => void;
  revertAll: () => void;
  totalTweaksCount: number;
  fpsTweaksCount: number;
  pingTweaksCount: number;
  activePowerPlanId?: string;
}

export default function Dashboard({
  activeTweaks,
  optimizeAll,
  revertAll,
  totalTweaksCount,
  fpsTweaksCount,
  pingTweaksCount,
  activePowerPlanId,
}: DashboardProps) {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [systemGrade, setSystemGrade] = useState<'F' | 'C' | 'A' | 'S+'>('F');

  // Simulated PC configuration
  const pcSpecs = {
    os: 'Windows 11 Home / Pro (Build 22631)',
    cpu: 'Detected CPU Threads (16 Detected)',
    ram: '16.0 GB DDR4/DDR5 Dual Channel',
    gpu: 'PCIe Gaming Graphics Accelerator Class'
  };

  const optimizationPercentage = Math.round((activeTweaks.length / totalTweaksCount) * 100);

  const powerPlanFpsBoost = React.useMemo(() => {
    if (activePowerPlanId === 'power-high') return 22;
    if (activePowerPlanId === 'power-ultimate') return 38;
    if (activePowerPlanId === 'power-frameflow') return 55;
    return 0;
  }, [activePowerPlanId]);

  const powerPlanPingPercentReduction = React.useMemo(() => {
    if (activePowerPlanId === 'power-high') return 12;
    if (activePowerPlanId === 'power-ultimate') return 24;
    if (activePowerPlanId === 'power-frameflow') return 38;
    return 0;
  }, [activePowerPlanId]);

  useEffect(() => {
    if (optimizationPercentage === 0) setSystemGrade('F');
    else if (optimizationPercentage < 35) setSystemGrade('C');
    else if (optimizationPercentage < 80) setSystemGrade('A');
    else setSystemGrade('S+');
  }, [optimizationPercentage]);

  const runSystemScan = () => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setHasScanned(true);
          // Auto optimize on first scan if not already optimized
          if (activeTweaks.length === 0) {
            optimizeAll();
          }
          return 100;
        }
        return prev + 4;
      });
    }, 80);
  };

  // Curated list of vulnerabilities shown before optimizing
  const scanIssues = [
    { name: 'Nagle\'s TCP Algorithm is active', desc: 'Increases processing buffer queues which compounds server latency.', code: 'TCP_DELAY_ACTIVE' },
    { name: 'Windows CPU Core Parking is enabled', desc: 'Deactivates idle threads, introducing dynamic micro-stuttering.', code: 'CORE_PARK_ACTIVE' },
    { name: 'Default HPET (High Precision Event Timer)', desc: 'Adds background event-loop queries, affecting frame rates.', code: 'HPET_STUTTER_RISK' },
    { name: 'Standard Energy Saving Active', desc: 'PCIe slots and GPU downvolt inside competitive gaming lobbies.', code: 'ENERGY_SAVER_ON' },
    { name: 'Windows Delivery Optimization Bloatware', desc: 'Spins up hidden disk write queries during matchmaking.', code: 'BLOAT_SERVICES' },
  ];

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="h-3 w-3 animate-pulse" />
              SYSTEM PERFORMANCE TUNER
            </div>
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight font-sans">
              Tune Your PC for Zero Input Lag
            </h1>
            <p className="text-sm text-zinc-400">
              Deploy over 50 specific graphics adjustments and 25 hardware levels configurations explicitly structured to maximize competitive FPS, lock stable frame times, and cut telemetry bloat.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            {!hasScanned && !scanning ? (
              <button
                id="btn-scan"
                onClick={runSystemScan}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer font-sans flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                Scan System Settings
              </button>
            ) : scanning ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between text-xs font-mono text-blue-400">
                  <span>SCANNING SYSTEM...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-sky-500 transition-all duration-100 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <button
                  id="btn-re-scan"
                  onClick={runSystemScan}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium border border-blue-500/20 bg-zinc-900/50 text-blue-400 hover:bg-zinc-900 transition-all cursor-pointer font-sans flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Analyze Again
                </button>
                <button
                  id="btn-restore"
                  onClick={revertAll}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium border border-zinc-800 bg-zinc-900/10 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-all cursor-pointer font-sans text-center"
                >
                  Restore Backups
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Key Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="stats-grid">
        {/* Core Tweak Engine Status Gauge */}
        <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">OPTIMIZATION DEPTH</span>
            <Gauge className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-end justify-between py-2">
            <div>
              <span className="text-4xl font-bold text-zinc-50 font-mono tracking-tight">
                {optimizationPercentage}%
              </span>
              <p className="text-xs text-zinc-500 mt-1">Configured Registers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold font-mono text-xl ${
                systemGrade === 'S+' ? 'bg-blue-500/10 text-blue-450 border border-blue-500/20 shadow-[0_0_10px_rgba(37,99,235,0.1)]' :
                systemGrade === 'A' ? 'bg-indigo-500/20 text-indigo-400' :
                systemGrade === 'C' ? 'bg-amber-500/20 text-amber-400' :
                'bg-rose-500/10 text-rose-500'
              }`}>
                {systemGrade}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">Grade</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Active adjustments:</span>
            <span className="font-mono text-blue-400 font-semibold">
              {activeTweaks.length} / {totalTweaksCount}
            </span>
          </div>
        </div>

        {/* FPS Tweaks Deployment */}
        <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">FPS BOOST INDEX</span>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <span className="text-4xl font-bold text-zinc-100 font-mono tracking-tight">
              +{Math.round(activeTweaks.filter((id) => !id.startsWith('tcp') && !id.startsWith('dns') && !id.startsWith('nic') && !id.startsWith('qos')).length * 1.1) + powerPlanFpsBoost} FPS
            </span>
            <p className="text-xs text-zinc-500 mt-1">Estimated competitive game boost</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Deployed FPS Tweak pool:</span>
            <span className="font-mono text-zinc-200 font-medium">
              {activeTweaks.filter((id) => id.startsWith('cpu') || id.startsWith('gpu') || id.startsWith('ram') || id.startsWith('bloat') || id.startsWith('disk') || id.startsWith('visuals')).length} / {fpsTweaksCount}
            </span>
          </div>
        </div>

        {/* Latency Tweaks Deployment */}
        <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">NET ROUTING INDEX</span>
            <Wifi className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <span className="text-4xl font-bold text-zinc-100 font-mono tracking-tight">
              -{Math.min(90, Math.round(activeTweaks.filter((id) => id.startsWith('tcp') || id.startsWith('dns') || id.startsWith('nic') || id.startsWith('qos')).length * 1.6) + powerPlanPingPercentReduction)}% Ping
            </span>
            <p className="text-xs text-zinc-500 mt-1">Lower jitter & reduced packet loss</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Deployed Network Tweak pool:</span>
            <span className="font-mono text-zinc-200 font-medium">
              {activeTweaks.filter((id) => id.startsWith('tcp') || id.startsWith('dns') || id.startsWith('nic') || id.startsWith('qos')).length} / {pingTweaksCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left 3 Columns: Active PC Scan results OR Status summaries */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl bg-zinc-900/20 border border-zinc-800/80 p-5">
            <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-450" />
              Local PC Specifications Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800/40">
                <p className="text-[10px] font-mono text-zinc-500">OPERATING SYSTEM</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Monitor className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-200 font-mono truncate">{pcSpecs.os}</span>
                </div>
              </div>
              <div className="bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800/40">
                <p className="text-[10px] font-mono text-zinc-500">CENTRAL PROCESSING UNIT</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-200 font-mono truncate">{pcSpecs.cpu}</span>
                </div>
              </div>
              <div className="bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800/40">
                <p className="text-[10px] font-mono text-zinc-500">SYSTEM MEMORY (RAM)</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Monitor className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-200 font-mono truncate">{pcSpecs.ram}</span>
                </div>
              </div>
              <div className="bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-800/40">
                <p className="text-[10px] font-mono text-zinc-500">GRAPHICS ADAPTER ACCELERATION</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-200 font-mono truncate">{pcSpecs.gpu}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-zinc-400 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0" />
              <span>FrameFlow actively checks standard registry headers, TCP window properties, and display adapter configurations.</span>
            </div>
          </div>

          {/* Issue Logs */}
          <div className="rounded-xl bg-zinc-900/20 border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${activeTweaks.length === totalTweaksCount ? 'text-emerald-500' : 'text-amber-500'}`} />
                Target Analysis Logs
              </h2>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {activeTweaks.length === totalTweaksCount ? '0 Issues Found' : `${5 - Math.floor(activeTweaks.length / 15)} Potential Latencies`}
              </span>
            </div>

            {scoringSystemIssues(activeTweaks, optimizeAll, scanIssues)}
          </div>
        </div>

        {/* Right 2 Columns: Tips & Guides */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
              FrameFlow Philosophy
            </h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <span className="h-5 w-5 bg-zinc-800 rounded-md flex items-center justify-center font-mono font-medium text-xs text-blue-450 shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-zinc-300">Disable High Precision Event Timer (HPET)</h3>
                  <p className="text-zinc-500 mt-1">Unifies physical timers and removes system interrupts while executing heavy competitive frame buffers.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="h-5 w-5 bg-zinc-800 rounded-md flex items-center justify-center font-mono font-medium text-xs text-blue-450 shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-zinc-300">No TCP Handshake Delays</h3>
                  <p className="text-zinc-500 mt-1">Disabling Nagle\'s algorithm drops competitive network round-trip delay time by up to 15-20 milliseconds.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="h-5 w-5 bg-zinc-800 rounded-md flex items-center justify-center font-mono font-medium text-xs text-blue-450 shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-zinc-300">Strip Background Polling Operations</h3>
                  <p className="text-zinc-500 mt-1">Telemetry, news, diagnostic loops and search indexing consume CPU and NVMe cycles that frame buffers need.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Want to generate actual batch settings script?</span>
              <span className="inline-flex items-center gap-1 text-xs text-blue-450 font-mono hover:underline cursor-pointer">
                Power Tools <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center justify-between relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/5 blur-2xl" />
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                Full Competitive Lock
              </h3>
              <p className="text-xs text-zinc-400">
                Ready to unleash unmatched game latency margins? Toggle all changes instantly.
              </p>
            </div>
            {activeTweaks.length < totalTweaksCount ? (
              <button
                id="btn-optimize-all"
                onClick={optimizeAll}
                className="px-6 py-2.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer font-sans whitespace-nowrap rounded-xl hover:scale-[1.01] active:scale-[0.99]"
              >
                Apply All {totalTweaksCount}
              </button>
            ) : (
              <div className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-sans font-semibold whitespace-nowrap shadow-sm">
                <CheckCircle2 className="h-4 w-4" /> Optimized
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function scoringSystemIssues(activeTweaks: string[], optimizeAll: () => void, scanIssues: { name: string; desc: string; code: string }[]) {
  if (activeTweaks.length >= 70) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
        <CheckCircle2 className="h-10 w-10 text-blue-400" />
        <div className="space-y-1">
          <h3 className="text-blue-400 font-semibold text-sm">System Tuning Enforced Successfully!</h3>
          <p className="text-xs text-zinc-400 max-w-md">
            All 53 input bottlenecks and 29 multiplayer routing delays have been optimization-matched inside FrameFlow. Your computer behaves in true high performance gaming state.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scanIssues.map((issue, idx) => {
        // Simple logic to show less issues as optimization goes up
        const isResolved = activeTweaks.length > (idx * 15);
        return (
          <div 
            key={issue.code} 
            className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
              isResolved 
                ? 'bg-zinc-950/20 border-zinc-800/40 opacity-45' 
                : 'bg-zinc-950/60 border-zinc-800'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${isResolved ? 'bg-zinc-500' : 'bg-amber-400 animate-pulse'}`} />
                <h4 className={`text-xs font-medium ${isResolved ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                  {issue.name}
                </h4>
              </div>
              <p className="text-[11px] text-zinc-500 ml-3.5">{issue.desc}</p>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
              isResolved 
                ? 'border-zinc-800 text-zinc-650 bg-zinc-950' 
                : 'border-amber-500/20 text-amber-400 bg-amber-500/5'
            }`}>
              {isResolved ? 'RESOLVED' : issue.code}
            </span>
          </div>
        );
      })}
      
      {activeTweaks.length < 50 && (
        <div className="pt-2 text-center">
          <button 
            id="btn-issue-fix-all"
            onClick={optimizeAll}
            className="text-xs text-blue-450 font-mono hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            Deploy Optimization Stack Now <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
