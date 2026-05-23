import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad, 
  Save, 
  Trash2, 
  ChevronRight, 
  Play, 
  Check, 
  Plus, 
  Sparkles, 
  Award, 
  Info, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { ALL_TWEAKS } from '../data/tweaksData';

interface GameProfilesProps {
  activeTweaks: string[];
  setActiveTweaks: (tweaks: string[]) => void;
  allTweaks: typeof ALL_TWEAKS;
}

interface CustomProfile {
  id: string;
  name: string;
  baseGame: string;
  tweakIds: string[];
  createdAt: string;
}

const POPULAR_COMPETITIVE_GAMES = [
  {
    id: 'gam-val',
    name: 'Valorant',
    category: 'Tactical Shooter',
    estimatedFpsBoost: '+22%',
    estimatedLatencyReduction: '-15ms',
    color: 'from-rose-600/20 to-red-600/5',
    borderColor: 'border-rose-500/25 hover:border-rose-500/50',
    iconColor: 'text-rose-400',
    tweakIds: [
      'cpu-01', 'cpu-02', 'cpu-05', 'cpu-07', 'cpu-09',
      'gpu-01', 'gpu-03', 'gpu-04', 'gpu-08', 'gpu-10',
      'ram-01', 'ram-02', 'ram-04',
      'bloat-01', 'bloat-02',
      'tcp-01', 'tcp-02', 'tcp-03',
      'dns-02',
      'nic-01', 'nic-04',
      'qos-02', 'qos-03'
    ],
    summary: 'Prioritizes raw single-thread CPU execution frequencies and zero sub-millisecond core scheduling delays for ultra-crisp pointer tracking and highest sustained tick processing.'
  },
  {
    id: 'gam-cs2',
    name: 'Counter-Strike 2',
    category: 'Tactical Shooter',
    estimatedFpsBoost: '+25%',
    estimatedLatencyReduction: '-18ms',
    color: 'from-amber-600/20 to-yellow-600/5',
    borderColor: 'border-amber-500/25 hover:border-amber-500/50',
    iconColor: 'text-amber-400',
    tweakIds: [
      'cpu-01', 'cpu-02', 'cpu-05', 'cpu-07', 'cpu-08', 'cpu-11',
      'gpu-01', 'gpu-03', 'gpu-04', 'gpu-08', 'gpu-09',
      'ram-01', 'ram-02', 'ram-04', 'ram-07',
      'bloat-01', 'bloat-04',
      'tcp-01', 'tcp-02', 'tcp-03',
      'dns-01',
      'nic-01', 'nic-04',
      'stab-01', 'stab-04'
    ],
    summary: 'Blocks HPET processing loops and overrides standard Windows delayed TCP handshakes completely. Maximizes exclusive rendering queue timings to optimize target click confirmation.'
  },
  {
    id: 'gam-fn',
    name: 'Fortnite',
    category: 'Battle Royale',
    estimatedFpsBoost: '+19%',
    estimatedLatencyReduction: '-12ms',
    color: 'from-blue-600/20 to-sky-600/5',
    borderColor: 'border-blue-500/25 hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    tweakIds: [
      'cpu-01', 'cpu-05', 'cpu-07', 'cpu-09',
      'gpu-01', 'gpu-02', 'gpu-03', 'gpu-04', 'gpu-10',
      'ram-01', 'ram-02', 'ram-03',
      'bloat-01', 'bloat-02', 'bloat-06',
      'tcp-01',
      'dns-02',
      'nic-01', 'nic-02',
      'qos-02'
    ],
    summary: 'Optimizes dynamic asset VRAM cache bounds to dramatically limit dynamic rendering stutters. Enables aggressive telemetry-stripping to unlock CPU frame generation capacity.'
  },
  {
    id: 'gam-apex',
    name: 'Apex Legends',
    category: 'Battle Royale',
    estimatedFpsBoost: '+20%',
    estimatedLatencyReduction: '-14ms',
    color: 'from-red-600/20 to-orange-600/5',
    borderColor: 'border-red-500/25 hover:border-red-500/50',
    iconColor: 'text-red-400',
    tweakIds: [
      'cpu-01', 'cpu-02', 'cpu-08', 'cpu-09',
      'gpu-01', 'gpu-03', 'gpu-04', 'gpu-08',
      'ram-01', 'ram-02', 'ram-04',
      'bloat-01', 'bloat-02',
      'tcp-01', 'tcp-02',
      'nic-01', 'nic-02', 'nic-04',
      'qos-02',
      'stab-04'
    ],
    summary: 'Forces hardware-level priority locks on the GPU display pipeline, expands memory caches for fast resource loading across massive map areas, and eliminates TCP congestion stalls.'
  },
  {
    id: 'gam-lol',
    name: 'League of Legends',
    category: 'MOBA',
    estimatedFpsBoost: '+30%',
    estimatedLatencyReduction: '-10ms',
    color: 'from-violet-600/20 to-purple-600/5',
    borderColor: 'border-purple-500/25 hover:border-purple-500/50',
    iconColor: 'text-purple-400',
    tweakIds: [
      'cpu-01', 'cpu-03', 'cpu-05', 'cpu-07',
      'gpu-01', 'gpu-03', 'gpu-10',
      'ram-01', 'ram-04', 'ram-06',
      'bloat-01', 'bloat-03',
      'tcp-01', 'tcp-04',
      'dns-02',
      'nic-01', 'nic-02',
      'qos-02'
    ],
    summary: 'Adjusts processor responsiveness factors directly and focuses on clean network frame transitions. Highly effective for reducing input latency on high refresh-rate monitors.'
  }
];

export default function GameProfiles({
  activeTweaks,
  setActiveTweaks,
  allTweaks
}: GameProfilesProps) {
  const [customProfiles, setCustomProfiles] = useState<CustomProfile[]>([]);
  const [profileName, setProfileName] = useState('');
  const [baseGame, setBaseGame] = useState('General Gaming');
  const [selectedRecommended, setSelectedRecommended] = useState<typeof POPULAR_COMPETITIVE_GAMES[0]>(POPULAR_COMPETITIVE_GAMES[0]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load custom profiles from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('frameflow-custom-profiles');
      if (stored) {
        setCustomProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed loading custom profiles', e);
    }
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Apply a set of tweak IDs to the application state
  const handleApplyProfile = (tweakIds: string[], gameName: string) => {
    // Collect only valid tweak ids that actually exist in current pool
    const validIds = tweakIds.filter(id => allTweaks.some(t => t.id === id));
    setActiveTweaks(validIds);
    showNotification(`Profile "${gameName}" successfully compiled. ${validIds.length} tweaks activated.`);
  };

  // Sane save current active state as profile
  const handleSaveCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    if (activeTweaks.length === 0) {
      showNotification('Cannot save an empty layout. Please enable some tweaks first!');
      return;
    }

    const payload: CustomProfile = {
      id: `profile-${Date.now()}`,
      name: profileName.trim(),
      baseGame: baseGame,
      tweakIds: [...activeTweaks],
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [payload, ...customProfiles];
    setCustomProfiles(updated);
    localStorage.setItem('frameflow-custom-profiles', JSON.stringify(updated));
    
    setProfileName('');
    showNotification(`Active performance configuration saved as "${payload.name}".`);
  };

  // Delete saved profile
  const handleDeleteProfile = (id: string, name: string) => {
    const updated = customProfiles.filter(p => p.id !== id);
    setCustomProfiles(updated);
    localStorage.setItem('frameflow-custom-profiles', JSON.stringify(updated));
    showNotification(`Custom profile "${name}" deleted.`);
  };

  return (
    <div className="space-y-6" id="game-profiles-tab">
      
      {/* Toast Notification Alert Banner */}
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

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 space-y-2">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Gamepad className="h-5 w-5 text-blue-400" />
          Game-Specific Optimization Profiles
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Quickly switch between discrete configurations tailored for specific games. Loading a profile replaces your active settings index with custom selections optimized for that game’s engine bottleneck.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Game recommendation carousel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              Recommended Competitive Profiles
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">5 MATCHING PRESETS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POPULAR_COMPETITIVE_GAMES.map((game) => {
              const worksWithActive = game.tweakIds.every(id => activeTweaks.includes(id)) && activeTweaks.length === game.tweakIds.length;
              const isSelected = selectedRecommended.id === game.id;
              
              return (
                <div
                  id={`recommended-game-${game.id}`}
                  key={game.id}
                  onClick={() => setSelectedRecommended(game)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-zinc-900/50 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.06)]' 
                      : 'bg-zinc-900/10 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl" />
                  
                  <div className="space-y-1.5 relative z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{game.category}</span>
                      {worksWithActive && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/25">
                          ACTIVE preset
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-150">{game.name}</h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-xs relative z-10">
                    <div className="flex gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/5 text-blue-400 font-mono border border-blue-500/10">
                        {game.estimatedFpsBoost} FPS
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/5 text-emerald-400 font-mono border border-emerald-500/10">
                        {game.estimatedLatencyReduction} Ping
                      </span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-zinc-500 transition-transform ${isSelected ? 'transform translate-x-1 text-blue-400' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Preview block for selected recommended game */}
          <AnimatePresence mode="wait">
            <motion.div
              layoutId="preset-preview-block"
              key={selectedRecommended.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5 font-sans">
                    {selectedRecommended.name} Optimization Settings
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    PROFILED: {selectedRecommended.tweakIds.length} HIGH-IMPACT HARDWARE CODES
                  </p>
                </div>

                <button
                  id={`btn-apply-recommended-${selectedRecommended.id}`}
                  onClick={() => handleApplyProfile(selectedRecommended.tweakIds, selectedRecommended.name)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 font-sans cursor-pointer transition-all active:scale-95"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Load Presets Configuration
                </button>
              </div>

              <p className="text-[11.5px] text-zinc-400 leading-relaxed font-sans mt-2">
                {selectedRecommended.summary}
              </p>

              {/* Tweak Details mapping */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">INCLUDED ADJUSTMENT CLUSTERS</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>CPU Scheduling Quantum: Priority Lock</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Nagle TCPAck Delay Bypass: Active</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Exclusive Graphics Render: Active</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Intelligent RAM Standby Purge: Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Custom Profile Creators */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom profile save panel */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Save className="h-4 w-4 text-blue-400" />
              Save Active Tweak Layout
            </h3>

            <form onSubmit={handleSaveCustomProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-500">PROFILE NAME</label>
                <input
                  id="input-profile-name"
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g., CS2 Premium Competitive"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-500">TARGET MATCH TITLE</label>
                <select
                  id="select-base-game"
                  value={baseGame}
                  onChange={(e) => setBaseGame(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                >
                  <option value="General Gaming">General Gaming / Default</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Apex Legends">Apex Legends</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
                  <option value="Cyberpunk 2077">Cyberpunk 2077</option>
                </select>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-[10.5px] leading-relaxed text-zinc-400 font-sans flex gap-2">
                <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  This triggers snapshot caching of your <span className="text-blue-400 font-semibold">{activeTweaks.length} enabled tweaks</span>. You can load this snap configuration back anytime.
                </p>
              </div>

              <button
                id="btn-save-custom-profile"
                type="submit"
                disabled={activeTweaks.length === 0}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-blue-400 border border-blue-500/20 disabled:border-zinc-850 disabled:opacity-50 transition-all font-sans cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Capture & Save Configuration
              </button>
            </form>
          </div>

          {/* Saved Layouts list */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">YOUR SAVED CONFIGURATIONS</h4>
            
            {customProfiles.length === 0 ? (
              <div className="p-6 rounded-xl border border-zinc-900/60 bg-zinc-950/20 text-center text-zinc-500 space-y-1">
                <p className="text-xs font-sans">No saved layout snapshots found.</p>
                <p className="text-[10px] font-mono">ACTIVE SESS LOGS WILL SHOW CACHING SLOTS HERE</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {customProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <h5 className="font-semibold text-zinc-250 truncate">{p.name}</h5>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{p.baseGame} • {p.tweakIds.length} Codes • {p.createdAt}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        id={`btn-load-custom-${p.id}`}
                        onClick={() => handleApplyProfile(p.tweakIds, p.name)}
                        className="px-2.5 py-1.5 text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-md font-sans font-medium transition-colors cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        id={`btn-delete-custom-${p.id}`}
                        onClick={() => handleDeleteProfile(p.id, p.name)}
                        className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
