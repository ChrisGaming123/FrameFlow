import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Wifi, 
  Settings, 
  Info, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

interface AdvancedTweakItem {
  id: string;
  name: string;
  category: 'kernel' | 'registry' | 'network';
  description: string;
  explanation: string;
  impact: 'Extreme' | 'High' | 'Medium';
  risk: string;
  valueDescription: string;
  registryPath?: string;
}

const ADVANCED_TWEAKS_DATA: AdvancedTweakItem[] = [
  // --- KERNEL PARAMETERS ---
  {
    id: 'adv-kernel-timer',
    name: 'Force Precision Timer Resolution (0.50ms)',
    category: 'kernel',
    description: 'Forces the Windows Kernel clock timer to the absolute physiological limit of 0.50ms, bypassing the default 15.6ms scaling.',
    explanation: 'Windows defaults to 15.6ms timer intervals to save CPU power states. Under heavy competitive gameplay, this introduces minute stutters and input lag mismatch inside physics loops. Shifting to fixed 0.50ms aligns high-interrupt inputs with frame rendering points.',
    impact: 'Extreme',
    risk: 'Minor power consumption increase on laptop designs during battery-only operation. Restricting dynamic ticks might produce variable clock cycles on ultra-legacy CPUs.',
    valueDescription: 'Enforce Global Timer Resolution to 5000 [Value: 0.5ms]',
    registryPath: 'BCDEdit - DisableDynamicTick Enabled'
  },
  {
    id: 'adv-kernel-quantum',
    name: 'Thread Scheduling Quantum Optimization',
    category: 'kernel',
    description: 'Modifies the Windows scheduler quantum allocations, locking absolute short-quantum priority to foreground gaming processes.',
    explanation: 'By default, Windows uses variable thread quantum lengths designed to favor multiple background jobs simultaneously. Swapping to short, locked intervals prevents other applications from stealing CPU clock cycles when game frame buffers demand resource processing.',
    impact: 'High',
    risk: 'Background tasks such as heavy compression, downloading, or rendering while gaming will experience prolonged execution rates and minor UI hesitation.',
    valueDescription: 'Win32PrioritySeparation = DWORD:00000026 [Calculated Quantum Offset]',
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl'
  },
  {
    id: 'adv-kernel-paging',
    name: 'Disable Executive Kernel Paging',
    category: 'kernel',
    description: 'Keeps critical driver codes and filesystem system structures strictly in physical RAM, completely preventing page swapping.',
    explanation: 'Automatically locks critical executive drivers in high-speed RAM instead of occasionally dumping them to the virtual page memory on the SSD. Minimizes high-intensity disk access delays while fetching hardware instructions.',
    impact: 'High',
    risk: 'CRITICAL: Requires a minimum of 16GB RAM installed. If the computer runs out of physical memory, it may trigger abrupt application crashes or memory dump state flags.',
    valueDescription: 'DisablePagingExecutive = DWORD:00000001',
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management'
  },

  // --- REGISTRY EDITS ---
  {
    id: 'adv-reg-responsiveness',
    name: 'Set SystemResponsiveness Threshold to 0%',
    category: 'registry',
    description: 'Alters default Windows resource management reserves to ensure 100% of CPU capabilities are granted to gaming executables.',
    explanation: 'Windows keeps a default safety reserve where up to 20% of CPU processing cycles are permanently reserved for system background indexing, telemetry, and updating managers. Forcing this threshold to 0% releases these limits completely.',
    impact: 'High',
    risk: 'When gaming, automatic updates, local network backups, and scheduled search indexers may halt indefinitely or trigger temporary diagnostic lags.',
    valueDescription: 'SystemResponsiveness = DWORD:00000000',
    registryPath: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile'
  },
  {
    id: 'adv-reg-gamedvr',
    name: 'Registry Lock Disable DVR Overlay AppCapture',
    category: 'registry',
    description: 'Completely disables GameDVR and background hooks within registry clusters, removing background recording bottlenecks.',
    explanation: 'Standard Windows game capture logs and captures video logs continuously to catch replay snippets. Disabling these triggers a massive decline in background context switches, boosting frame predictability.',
    impact: 'Medium',
    risk: 'Standard Windows Game Bar features, screenshots, and direct clips capture features (Win + Alt + G) will be completely non-functional.',
    valueDescription: 'AppCaptureEnabled = DWORD:00000000, GameDVR_Enabled = DWORD:00000000',
    registryPath: 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR'
  },
  {
    id: 'adv-reg-tdr',
    name: 'Override Watchdog Timeout (TdrDelay)',
    category: 'registry',
    description: 'Extends display driver fault tolerance timeout ranges from 2 seconds to 10 seconds before a GPU recovery reboot is triggered.',
    explanation: 'If a highly intensive game makes a massive resource loading call that stalls the GPU for consecutive seconds, Windows detects a hang, crashes the game, and restarts the driver. Increasing this threshold saves games from unneeded lockups.',
    impact: 'High',
    risk: 'Defers recovery on actual hardware failure hooks. If the hardware is experiencing genuine thermals or hardware failure, the system will sit frozen for 10 seconds instead of resetting.',
    valueDescription: 'TdrDelay = DWORD:0000000a [10s Delay Rate]',
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers'
  },

  // --- ADVANCED NETWORK CONFIGS ---
  {
    id: 'adv-net-nodelay',
    name: 'Bypass TCP Buffer Delay (TCPNoDelay)',
    category: 'network',
    description: 'Disables Nagle’s consolidation algorithm, instructing the TCP/IP stack to transmit single input ticks instantly.',
    explanation: 'Nagle’s algorithm compiles multiple sub-packet commands into a single bulk buffer before transmitting (waiting up to 200ms). Disabling this bypasses queuing entirely, flashing every single click or keypress directly to competitive game hosts.',
    impact: 'Extreme',
    risk: 'Slightly increases overall packet volume count inside local networks due to tiny packet transmission cycles. Unnoticeable on broadband fiber cables but might cause minor packet load on outdated ADSL channels.',
    valueDescription: 'TCPNoDelay = DWORD:00000001 [Enforced]',
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces'
  },
  {
    id: 'adv-net-autotuning',
    name: 'Optimize TCP Window AutoTuning Level',
    category: 'network',
    description: 'Forces active TCP socket scaling properties to the ultra-optimized "Normal" level, stabilizing fiber throughput speeds.',
    explanation: 'TCP Auto-Tuning automatically adjusts the receive window size based on delay factors. Forcing this state ensures the OS dynamically allocates bandwidth cushions properly, mitigating dynamic latency packet spikes during server congestion.',
    impact: 'Medium',
    risk: 'On certain legacy routers or corporate networks with restrictive firewall policies, dynamic TCP window scaling can fail, triggering accidental socket resets.',
    valueDescription: 'netsh interface tcp set global autotuninglevel=normal',
    registryPath: 'Command Line Stack Execution'
  },
  {
    id: 'adv-net-moderation',
    name: 'Cease NIC Interrupt Moderation',
    category: 'network',
    description: 'Instructs the Ethernet network chip drivers to stop batch-buffering inbound packet ticks.',
    explanation: 'Standard network adapters moderate interrupt triggers to reduce CPU work, buffering packet handshakes dynamically. Turning this off forces the adapter to trigger a hardware callback immediately upon packet arrivals, cutting ping times.',
    impact: 'High',
    risk: 'Slightly elevates CPU usage levels (usually under 1-2% core allocation) as the processor receives instantaneous hardware interrupts. Recommended for multithreaded mid-to-high end processors.',
    valueDescription: 'Interrupt Moderation = Disabled [Advanced Nic Driver Settings]',
    registryPath: 'Device Manager Network Driver Profile'
  }
];

export default function AdvancedTweaks() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeAdvTweaks, setActiveAdvTweaks] = useState<string[]>([]);
  const [selectedTweak, setSelectedTweak] = useState<AdvancedTweakItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'kernel' | 'registry' | 'network'>('all');

  // Load and store advanced tweaks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('frameflow-advanced-tweaks');
      if (stored) {
        setActiveAdvTweaks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed loading advanced tweaks', e);
    }
  }, []);

  const handleToggleTweak = (id: string) => {
    if (!unlocked) return;
    
    let updated: string[];
    if (activeAdvTweaks.includes(id)) {
      updated = activeAdvTweaks.filter(t => t !== id);
    } else {
      updated = [...activeAdvTweaks, id];
    }
    setActiveAdvTweaks(updated);
    localStorage.setItem('frameflow-advanced-tweaks', JSON.stringify(updated));
  };

  const filteredTweaks = ADVANCED_TWEAKS_DATA.filter(t => 
    filterCategory === 'all' || t.category === filterCategory
  );

  return (
    <div className="space-y-6 animate-fade-in" id="advanced-tweaks-tab">
      
      {/* Risk warning and safety unlock banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        unlocked 
          ? 'bg-blue-900/10 border-blue-500/20' 
          : 'bg-rose-950/20 border-rose-900/30 shadow-[0_0_20px_rgba(244,63,94,0.02)]'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-sm font-semibold flex items-center gap-2 tracking-wide uppercase font-mono">
              <ShieldAlert className={`h-5 w-5 ${unlocked ? 'text-blue-400' : 'text-rose-400 animate-pulse'}`} />
              {unlocked ? 'Advanced Tweak Controls Unlocked' : 'Risk & Safety Classification Required'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Advanced adjustments operate directly upon core Windows kernel registers and TCP parameters. Conflicting, outdated, or highly customized hardware stacks can experience stutters or instabilites if configured without verification. Always generate a System Restore Point prior to script deployment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="checkbox-safety-ack"
                type="checkbox"
                checked={unlocked}
                onChange={(e) => setUnlocked(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 cursor-pointer h-4 w-4"
              />
              <span className="text-xs font-mono text-zinc-300">I ACCEPT CORE RISKS</span>
            </label>
            <div className={`p-2 rounded-lg ${unlocked ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-450'}`}>
              {unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>
          </div>
        </div>
      </div>

      {unlocked ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Main Controls List - Col Span 3 */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Filter controls */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-900 justify-between text-xs">
              <button
                id="btn-filter-all"
                onClick={() => setFilterCategory('all')}
                className={`flex-1 py-1 px-2.5 rounded text-center transition-colors font-medium font-sans cursor-pointer ${
                  filterCategory === 'all' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Advanced
              </button>
              <button
                id="btn-filter-kernel"
                onClick={() => setFilterCategory('kernel')}
                className={`flex-1 py-1 px-2.5 rounded text-center transition-colors font-medium font-sans cursor-pointer ${
                  filterCategory === 'kernel' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Kernel Tuning
              </button>
              <button
                id="btn-filter-registry"
                onClick={() => setFilterCategory('registry')}
                className={`flex-1 py-1 px-2.5 rounded text-center transition-colors font-medium font-sans cursor-pointer ${
                  filterCategory === 'registry' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Registry Regs
              </button>
              <button
                id="btn-filter-net"
                onClick={() => setFilterCategory('network')}
                className={`flex-1 py-1 px-2.5 rounded text-center transition-colors font-medium font-sans cursor-pointer ${
                  filterCategory === 'network' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                New Network
              </button>
            </div>

            {/* List cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTweaks.map((tweak) => {
                const isActive = activeAdvTweaks.includes(tweak.id);
                return (
                  <div
                    id={`adv-tweak-card-${tweak.id}`}
                    key={tweak.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-[#003366]/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.05)]' 
                        : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${
                            tweak.category === 'kernel' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' :
                            tweak.category === 'registry' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                          }`}>
                            {tweak.category}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-450 uppercase">
                            IMPACT: {tweak.impact}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-150 tracking-tight leading-snug">{tweak.name}</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">{tweak.description}</p>
                      </div>

                      {/* Switch control */}
                      <button
                        id={`toggle-adv-${tweak.id}`}
                        onClick={() => handleToggleTweak(tweak.id)}
                        className={`h-5 w-9 rounded-full shrink-0 relative transition-all cursor-pointer ${
                          isActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-zinc-700'
                        }`}
                      >
                        <span 
                          className={`h-3 w-3 rounded-full bg-white absolute top-1 transition-all ${
                            isActive ? 'left-5' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10.5px]">
                      <button
                        id={`btn-explain-${tweak.id}`}
                        onClick={() => setSelectedTweak(tweak)}
                        className="text-blue-400 font-medium font-sans hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5" /> Explain Parameters & Risks
                      </button>
                      <span className="text-zinc-500 font-mono text-[9px] uppercase">
                        {tweak.valueDescription.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Deep inspection panel - Col Span 2 */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedTweak ? (
                <motion.div
                  key={selectedTweak.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5 leading-none">
                      <Terminal className="h-4.5 w-4.5 text-blue-400" />
                      Tweak Specifications
                    </h3>
                    <span className="text-[9.5px] font-mono text-zinc-500">{selectedTweak.id.toUpperCase()}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Name & Function</span>
                    <h4 className="text-sm font-bold text-zinc-200">{selectedTweak.name}</h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Underlying Operation</span>
                    <p className="text-xs text-zinc-400 font-mono leading-relaxed bg-black/60 p-2.5 rounded border border-zinc-900">
                      {selectedTweak.valueDescription}
                    </p>
                    {selectedTweak.registryPath && (
                      <div className="text-[10px] font-mono text-zinc-550 truncate mt-1">
                        PATH: {selectedTweak.registryPath}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Detailed Technical Explanation</span>
                    <p className="text-xs text-zinc-450 leading-relaxed">
                      {selectedTweak.explanation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/15 space-y-1 font-sans">
                    <span className="text-[10.5px] font-mono font-bold text-rose-450 uppercase flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> High Classification Risk Warning
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {selectedTweak.risk}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full rounded-xl border border-zinc-900/60 bg-zinc-950/20 flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                  <Terminal className="h-8 w-8 text-zinc-800" />
                  <div className="space-y-1">
                    <p className="text-xs font-sans">Select any advanced modification card</p>
                    <p className="text-[10px] font-mono">TO PREVIEW INTEGRAL REGISTRY VALUES AND CLUSTER RISKS</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      ) : (
        <div className="p-12 rounded-2xl border border-zinc-950/80 bg-zinc-950/40 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 bg-rose-950/30 text-rose-450 rounded-full flex items-center justify-center border border-rose-900/30">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-sm font-semibold text-zinc-200">Advanced Adjustments Locked</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              To proceed, review the Risk & Safety declaration block above and tick "I ACCEPT CORE RISKS" to assert local compatibility configuration clearances.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
