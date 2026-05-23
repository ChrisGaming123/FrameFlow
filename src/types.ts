export interface Tweak {
  id: string;
  name: string;
  description: string;
  category: 'cpu' | 'gpu' | 'ram' | 'bloatware' | 'disk' | 'visuals' | 'tcp' | 'dns' | 'nic' | 'qos' | 'stability';
  type: 'fps' | 'ping' | 'stability';
  impact: 'High' | 'Medium' | 'Low';
  fpsGain?: number; // estimated percentage or flat boost influence
  pingReduction?: number; // estimated percentage reduction
  registryPath?: string;
  commandValue?: string;
  unsafe?: boolean; // if it requires user validation
}

export interface Game {
  id: string;
  name: string;
  category: 'FPS' | 'Battle Royale' | 'Tactical' | 'MOBA' | 'RPG';
  icon: string;
  baseFpsLowSpec: number;
  baseFpsHighSpec: number;
  baseLatencyLowSpec: number; // ms
  baseLatencyHighSpec: number; // ms
}

export interface HardwareSpec {
  id: string;
  name: string;
  tier: 'low' | 'mid' | 'high';
  type: 'cpu' | 'gpu';
  multiplier: number; // speed or efficiency multiplier
}

export interface PingServer {
  id: string;
  name: string;
  region: string;
  basePing: number;
  currentPing?: number;
}
