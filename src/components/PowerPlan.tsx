import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Settings, 
  Terminal, 
  Check, 
  Copy, 
  Info, 
  Cpu, 
  Gauge, 
  AlertCircle,
  HelpCircle,
  Activity,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface PowerPlanProps {
  onPowerPlanChange: (planId: string, fpsBoostText: string, pingLowerText: string) => void;
  activePlanId: string;
}

interface PowerPlanItem {
  id: string;
  name: string;
  description: string;
  fpsBoost: string;
  pingReduction: string;
  icon: React.ReactNode;
  colorClass: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
  cmdCommand: string;
  guid: string;
  technicalSpecs: {
    minCpuState: string;
    coreParking: string;
    pcieLinkState: string;
    usbSelectiveSuspend: string;
  };
}

const POWER_PLANS_DATA: PowerPlanItem[] = [
  {
    id: 'power-balanced',
    name: 'Balanced (Windows Default)',
    description: 'Standard multi-tasking profile. Allows core clocks to scale down under idle states, resulting in timing delays when loading heavy assets.',
    fpsBoost: '0%',
    pingReduction: '0ms',
    icon: <Settings className="h-4 w-4 text-zinc-400" />,
    colorClass: 'bg-zinc-950/10 border-zinc-900',
    borderColor: 'border-zinc-800',
    textColor: 'text-zinc-400',
    badgeColor: 'bg-zinc-900 text-zinc-450 border-zinc-850',
    cmdCommand: 'powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e',
    guid: '381b4222-f694-41f0-9685-ff5bb260df2e',
    technicalSpecs: {
      minCpuState: '5% (Scaling Enabled)',
      coreParking: 'Standard (Standard Latency)',
      pcieLinkState: 'Moderate Power Savings',
      usbSelectiveSuspend: 'Enabled (Dynamic Idle Sleep)'
    }
  },
  {
    id: 'power-high',
    name: 'High Performance',
    description: 'Increases CPU priority bounds and forces a sustained base frequency clock speed, removing primary thread startup lag spikes.',
    fpsBoost: '+12%',
    pingReduction: '-5ms',
    icon: <Gauge className="h-4 w-4 text-blue-400" />,
    colorClass: 'bg-blue-950/5 border-blue-900/20',
    borderColor: 'border-blue-900/10 hover:border-blue-500/30',
    textColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/5 text-blue-400 border-blue-500/10',
    cmdCommand: 'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
    guid: '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
    technicalSpecs: {
      minCpuState: '100% Minimum Lock',
      coreParking: 'Partially Disabled (Fast Awake)',
      pcieLinkState: 'Off (Maximum Performance)',
      usbSelectiveSuspend: 'Disabled'
    }
  },
  {
    id: 'power-ultimate',
    name: 'Ultimate Performance',
    description: 'An advanced Windows workspace power plan engineered for workstation designs. Eliminates microsecond hardware latency cycles.',
    fpsBoost: '+22%',
    pingReduction: '-10ms',
    icon: <Activity className="h-4 w-4 text-emerald-400" />,
    colorClass: 'bg-emerald-950/5 border-emerald-900/20',
    borderColor: 'border-emerald-950 hover:border-emerald-500/30',
    textColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10',
    cmdCommand: 'powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61',
    guid: 'e9a42b02-d5df-448d-aa00-03f14749eb61',
    technicalSpecs: {
      minCpuState: '100% (Absolute Locked Clock)',
      coreParking: 'Fully Disabled (All Cores Active)',
      pcieLinkState: 'Off (Zero Bus Restraints)',
      usbSelectiveSuspend: 'Disabled (Constant Polling)'
    }
  },
  {
    id: 'power-frameflow',
    name: 'FrameFlow Ultra-Power Plan ⚡',
    description: 'Our proprietary custom-tuned profile block. Bypasses core parking, enforces active NIC hardware polling, disables energy-efficient ethernet, and allocates 100% thread frequency indices for a massive boost.',
    fpsBoost: '+35%',
    pingReduction: '-16ms',
    icon: <Flame className="h-4 w-4 text-amber-400 animate-pulse" />,
    colorClass: 'bg-amber-950/5 border-amber-900/20',
    borderColor: 'border-amber-950 hover:border-amber-500/40',
    textColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cmdCommand: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 && powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61',
    guid: 'custom-frameflow-ultimate-ultra-v1',
    technicalSpecs: {
      minCpuState: '100% (Bypassed Thermal Dampeners)',
      coreParking: 'Core Parking Bypassed Completely',
      pcieLinkState: 'Power Management Link Off',
      usbSelectiveSuspend: 'Strict Disabled (Zero Input Jitter)'
    }
  }
];

export default function PowerPlan({
  onPowerPlanChange,
  activePlanId
}: PowerPlanProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(activePlanId || 'power-balanced');
  const [notification, setNotification] = useState<string | null>(null);

  const activePlanDetails = POWER_PLANS_DATA.find((p) => p.id === selectedPlanId) || POWER_PLANS_DATA[0];

  const handleCopyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSelectPlan = (plan: PowerPlanItem) => {
    setSelectedPlanId(plan.id);
  };

  const handleActivatePlanInApp = () => {
    onPowerPlanChange(activePlanDetails.id, activePlanDetails.fpsBoost, activePlanDetails.pingReduction);
    localStorage.setItem('frameflow-active-power-plan', activePlanDetails.id);
    showNotification(`Successfully deployed "${activePlanDetails.name}" configuration profile into FrameFlow.`);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="power-plan-tab">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-zinc-900 border border-blue-500/30 text-zinc-100 px-4 py-3 rounded-xl shadow-[0_4px_25px_rgba(37,99,235,0.25)] flex items-center gap-2.5 font-sans text-xs"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <span className="font-semibold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro info box */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-2">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400 stroke-[2.5]" />
          OS Power Management Alignment
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Windows power saving regimes intentionally disable high-frequency CPU cores and throttle PCIe bus lines, seeking energy conservation. For multiplayer gaming, this introduces sub-millisecond interrupts and micro-stutters. Selecting a dedicated power scheme forces CPU stability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left column - plan selection (col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-blue-400" />
              Select Optimization Scheme
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">4 DEFINED SCHEMES</span>
          </div>

          <div className="space-y-3">
            {POWER_PLANS_DATA.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrentlyApplied = activePlanId === plan.id;

              return (
                <div
                  id={`power-scheme-${plan.id}`}
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#002b5c]/10 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.06)]' 
                      : 'bg-[#09090b]/40 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl" />
                  
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold tracking-tight text-zinc-150">{plan.name}</span>
                        {isCurrentlyApplied && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/25 uppercase">
                            Active Scheme
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-zinc-400 leading-normal max-w-xl">{plan.description}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase border ${plan.badgeColor}`}>
                        FPS: {plan.fpsBoost}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-xs relative z-10">
                    <div className="flex items-center gap-1.5 text-zinc-550 font-mono text-[10px]">
                      <span>GUID index:</span>
                      <span className="truncate max-w-[120px]">{plan.guid}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-sans font-medium text-blue-400 text-xs">
                      {isSelected ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      ) : (
                        <span>Configure Parameters</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column - specifications and CMD deployment instructions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Deployment SPECIFICATIONS
            </h3>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#0d0d10]/20 p-5 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Selected Profile specs</span>
              <h4 className="text-sm font-bold text-zinc-200">{activePlanDetails.name}</h4>
            </div>

            {/* Metrics outcome info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Projected FPS Gain</span>
                <span className="text-base font-extrabold text-blue-400">{activePlanDetails.fpsBoost} Boost</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Projected Latency</span>
                <span className="text-base font-extrabold text-emerald-400">{activePlanDetails.pingReduction} Delay</span>
              </div>
            </div>

            {/* Hardware-level specs details list */}
            <div className="space-y-2.5 font-mono text-[10.5px]">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Minimum Processor State:</span>
                <span className="text-zinc-300 font-semibold">{activePlanDetails.technicalSpecs.minCpuState}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Core Parking Protocols:</span>
                <span className="text-zinc-300 font-semibold">{activePlanDetails.technicalSpecs.coreParking}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">PCI Express Link State:</span>
                <span className="text-zinc-300 font-semibold">{activePlanDetails.technicalSpecs.pcieLinkState}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">USB Selective Suspend:</span>
                <span className="text-zinc-300 font-semibold">{activePlanDetails.technicalSpecs.usbSelectiveSuspend}</span>
              </div>
            </div>

            {/* Immediate deploy button */}
            <button
              id="btn-deploy-power-plan-action"
              onClick={handleActivatePlanInApp}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <Zap className="h-4 w-4 stroke-[2.5]" />
              Deploy Profile Integration
            </button>

            {/* CMD registry / powercfg box instructions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">CMD Command line implementation</span>
                <button
                  id="btn-copy-powercfg-command"
                  onClick={() => handleCopyCommand(activePlanDetails.cmdCommand)}
                  className="text-blue-400 font-mono text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied Cmd' : 'Copy Code'}
                </button>
              </div>

              <div className="bg-black/60 p-3 rounded-lg border border-zinc-900/80 font-mono text-[10px] text-zinc-400 break-all select-all leading-normal whitespace-pre-wrap">
                {activePlanDetails.cmdCommand}
              </div>

              <div className="flex gap-2 p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs font-sans text-zinc-400 leading-normal">
                <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-300">Control Panel Interface Override</p>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    This deploys the profile registry keys to your system kernel instantly. Run CMD as Administrator and paste the copied command sequence to configure Power Options.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
