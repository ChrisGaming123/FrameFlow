import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Settings, 
  Cpu, 
  Wifi, 
  Zap, 
  Sliders, 
  Check, 
  Info,
  Server,
  Database,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Tweak } from '../types';
import { FPS_TWEAKS, PING_TWEAKS, STABILITY_TWEAKS } from '../data/tweaksData';

interface TweakManagerProps {
  activeTweaks: string[];
  toggleTweak: (id: string) => void;
  toggleMultipleTweaks: (ids: string[], enable: boolean) => void;
}

export default function TweakManager({
  activeTweaks,
  toggleTweak,
  toggleMultipleTweaks,
}: TweakManagerProps) {
  const [activeTab, setActiveTab] = useState<'fps' | 'ping' | 'stability'>('fps');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [focusedRegistryTweak, setFocusedRegistryTweak] = useState<Tweak | null>(null);

  // Map sub-categories for activeTab
  const subCategories = useMemo(() => {
    if (activeTab === 'fps') {
      return [
        { id: 'all', name: 'All FPS Tweaks' },
        { id: 'cpu', name: 'CPU & Power Clocks' },
        { id: 'gpu', name: 'GPU & Display Overlays' },
        { id: 'ram', name: 'RAM Optimization' },
        { id: 'bloatware', name: 'Services & Bloatware' },
        { id: 'disk', name: 'Filesystem Speed' },
        { id: 'visuals', name: 'Visual adjustments' },
      ];
    } else if (activeTab === 'ping') {
      return [
        { id: 'all', name: 'All Ping Tweaks' },
        { id: 'tcp', name: 'TCP/IP Registry Stack' },
        { id: 'dns', name: 'Low Latency DNS Servers' },
        { id: 'nic', name: 'Network Card Buffers' },
        { id: 'qos', name: 'QoS Packet Priority' },
      ];
    } else {
      return [
        { id: 'all', name: 'All Stability Tweaks' }
      ];
    }
  }, [activeTab]);

  // Source list maps
  const sourceList = useMemo(() => {
    if (activeTab === 'fps') return FPS_TWEAKS;
    if (activeTab === 'ping') return PING_TWEAKS;
    return STABILITY_TWEAKS;
  }, [activeTab]);

  // Handle auto categories switch on tab change
  React.useEffect(() => {
    setSelectedSubCategory('all');
  }, [activeTab]);

  const filteredTweaks = useMemo(() => {
    return sourceList.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.registryPath && item.registryPath.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubCategory = 
        selectedSubCategory === 'all' || item.category === selectedSubCategory;

      const matchesImpact = 
        selectedImpact === 'all' || item.impact === selectedImpact;

      return matchesSearch && matchesSubCategory && matchesImpact;
    });
  }, [sourceList, searchQuery, selectedSubCategory, selectedImpact]);

  // Enable/Disable visible tweaks
  const toggleFilteredAll = (enable: boolean) => {
    const ids = filteredTweaks.map((t) => t.id);
    toggleMultipleTweaks(ids, enable);
  };

  const activeFilteredCount = filteredTweaks.filter((item) => activeTweaks.includes(item.id)).length;

  return (
    <div className="space-y-6" id="tweaks-tab">
      {/* Search and Category Control Bar */}
      <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Main Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-lg border border-zinc-800/80 md:col-span-2">
            <button
              id="tab-select-fps"
              onClick={() => setActiveTab('fps')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'fps' 
                  ? 'bg-zinc-800 text-blue-400' 
                  : 'text-zinc-400 hover:text-zinc-150'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              FPS Tweaks (53)
            </button>
            <button
              id="tab-select-ping"
              onClick={() => setActiveTab('ping')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ping' 
                  ? 'bg-zinc-800 text-blue-400' 
                  : 'text-zinc-400 hover:text-zinc-150'
              }`}
            >
              <Wifi className="h-3.5 w-3.5" />
              Low Ping Tweaks (29)
            </button>
            <button
              id="tab-select-stab"
              onClick={() => setActiveTab('stability')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'stability' 
                  ? 'bg-zinc-800 text-blue-400' 
                  : 'text-zinc-400 hover:text-zinc-150'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              System Stability
            </button>
          </div>

          {/* Search bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${sourceList.length} total tweaks...`}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Subcategories Scroll */}
        <div className="flex flex-wrap items-center mt-4 pt-4 border-t border-zinc-800/60 gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase mr-2">Category:</span>
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubCategory(sub.id)}
              className={`px-3 py-1 text-[11px] font-sans font-semibold rounded-full border transition-all cursor-pointer ${
                selectedSubCategory === sub.id
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-855 hover:text-zinc-100 hover:border-zinc-700'
              }`}
            >
              {sub.name}
            </button>
          ))}

          {/* Impact Select */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Impact:</span>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Impact</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tweaks Count and Multi select action */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>Displaying <b>{filteredTweaks.length}</b> matches</span>
          <span>•</span>
          <span><b>{activeFilteredCount}</b> active</span>
        </div>
        <div className="flex items-center gap-2">
          {activeFilteredCount < filteredTweaks.length ? (
            <button
              id="multi-toggle-enable"
              onClick={() => toggleFilteredAll(true)}
              className="px-3 py-1.5 text-[11px] font-mono text-blue-400 hover:underline cursor-pointer"
            >
              Deploy All Listed
            </button>
          ) : (
            <button
              id="multi-toggle-disable"
              onClick={() => toggleFilteredAll(false)}
              className="px-3 py-1.5 text-[11px] font-mono text-rose-450 hover:underline cursor-pointer"
            >
              Deactivate All Listed
            </button>
          )}
        </div>
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTweaks.length === 0 ? (
          <div className="col-span-2 text-center py-12 rounded-xl bg-zinc-900/10 border border-dashed border-zinc-800 space-y-2">
            <AlertCircle className="h-8 w-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-400">No optimizations matched your filter criteria</p>
            <p className="text-xs text-zinc-500">Try modifying search tags or resetting categories</p>
          </div>
        ) : (
          filteredTweaks.map((tweak) => {
            const isInstalled = activeTweaks.includes(tweak.id);
            return (
              <div 
                key={tweak.id}
                onClick={() => toggleTweak(tweak.id)}
                className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isInstalled
                    ? 'bg-blue-600/5 border-blue-500/40 hover:border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.06)] bg-gradient-to-br from-blue-950/5 to-zinc-900/40'
                    : 'bg-zinc-900/15 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-zinc-150 tracking-tight leading-snug group-hover:text-blue-450 transition-colors">
                        {tweak.name}
                      </h4>
                      <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
                        {tweak.description}
                      </p>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      id={`toggle-tweak-${tweak.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTweak(tweak.id);
                      }}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center shrink-0 ${
                        isInstalled ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-zinc-700'
                      }`}
                    >
                      <span 
                        className={`h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          isInstalled ? 'translate-x-[16px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Impact and Stats badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                      tweak.impact === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' :
                      tweak.impact === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' :
                      'bg-zinc-550/15 text-zinc-400 border border-zinc-800'
                    }`}>
                      {tweak.impact} Impact
                    </span>
                    
                    {tweak.fpsGain > 0 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/5 text-blue-400 border border-blue-500/15">
                        +{tweak.fpsGain}% FPS
                      </span>
                    )}

                    {tweak.pingReduction > 0 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/5 text-sky-400 border border-sky-500/15">
                        -{tweak.pingReduction}% Ping
                      </span>
                    )}

                    <span className="text-[9px] font-mono text-zinc-550 ml-auto capitalize">
                      {tweak.category}
                    </span>
                  </div>
                </div>

                {/* Additional controls like inspecting Registry values or terminal equivalent */}
                {(tweak.registryPath || tweak.commandValue) && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
                    <button
                      id={`btn-view-reg-${tweak.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedRegistryTweak(tweak);
                      }}
                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                    >
                      <Eye className="h-3 w-3" /> Inspect Registry / Command Info
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Registry Inspecting Modal popover */}
      {focusedRegistryTweak && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <h3 className="text-xs font-mono text-zinc-400">REGISTRY & SHELL COMPILATION</h3>
              <button 
                onClick={() => setFocusedRegistryTweak(null)}
                className="text-zinc-500 hover:text-zinc-300 font-mono text-xs cursor-pointer"
              >
                [Esc / Close]
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-400">NAME</span>
                <p className="text-sm font-semibold text-zinc-100">{focusedRegistryTweak.name}</p>
              </div>

              {focusedRegistryTweak.registryPath && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500">WINDOWS REGISTRY TARGET</span>
                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono text-xs select-all break-all text-zinc-350">
                    {focusedRegistryTweak.registryPath}
                  </div>
                </div>
              )}

              {focusedRegistryTweak.commandValue && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500">SYSTEM BATCH / POWERSHELL EXECUTION</span>
                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono text-xs select-all break-all text-blue-400">
                    {focusedRegistryTweak.commandValue}
                  </div>
                </div>
              )}

              <div className="p-3 bg-zinc-950/40 rounded border border-zinc-800/60 text-xs text-zinc-400 flex items-start gap-2.5 font-sans">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>
                  This tweak modifies the low-level Windows kernel parameters shown. Registry changes are safe when customized via FrameFlow backups.
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-850 bg-zinc-950 flex justify-end">
              <button
                onClick={() => setFocusedRegistryTweak(null)}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-70 transition-colors text-xs font-semibold text-zinc-200 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
