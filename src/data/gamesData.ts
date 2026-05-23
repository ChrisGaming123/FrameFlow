import { Game, HardwareSpec, PingServer } from '../types';

export const GAMES_LIST: Game[] = [
  {
    id: 'gam-01',
    name: 'Valorant',
    category: 'Tactical',
    icon: 'Target',
    baseFpsLowSpec: 110,
    baseFpsHighSpec: 360,
    baseLatencyLowSpec: 25,
    baseLatencyHighSpec: 8
  },
  {
    id: 'gam-02',
    name: 'Fortnite',
    category: 'Battle Royale',
    icon: 'Sword',
    baseFpsLowSpec: 85,
    baseFpsHighSpec: 280,
    baseLatencyLowSpec: 35,
    baseLatencyHighSpec: 12
  },
  {
    id: 'gam-03',
    name: 'Counter-Strike 2 (CS2)',
    category: 'Tactical',
    icon: 'Shield',
    baseFpsLowSpec: 95,
    baseFpsHighSpec: 320,
    baseLatencyLowSpec: 22,
    baseLatencyHighSpec: 6
  },
  {
    id: 'gam-04',
    name: 'Apex Legends',
    category: 'Battle Royale',
    icon: 'Zap',
    baseFpsLowSpec: 75,
    baseFpsHighSpec: 220,
    baseLatencyLowSpec: 40,
    baseLatencyHighSpec: 15
  },
  {
    id: 'gam-05',
    name: 'League of Legends',
    category: 'MOBA',
    icon: 'Flame',
    baseFpsLowSpec: 130,
    baseFpsHighSpec: 420,
    baseLatencyLowSpec: 28,
    baseLatencyHighSpec: 9
  },
  {
    id: 'gam-06',
    name: 'Call of Duty: Warzone',
    category: 'Battle Royale',
    icon: 'Skull',
    baseFpsLowSpec: 60,
    baseFpsHighSpec: 165,
    baseLatencyLowSpec: 48,
    baseLatencyHighSpec: 18
  },
  {
    id: 'gam-07',
    name: 'Cyberpunk 2077',
    category: 'RPG',
    icon: 'Cpu',
    baseFpsLowSpec: 40,
    baseFpsHighSpec: 120,
    baseLatencyLowSpec: 55,
    baseLatencyHighSpec: 24
  }
];

export const CPU_SPECS: HardwareSpec[] = [
  { id: 'cpu-low', name: 'Intel Core i3 / Ryzen 3 (Legacy)', tier: 'low', type: 'cpu', multiplier: 0.7 },
  { id: 'cpu-mid-old', name: 'Intel Core i5 10th Gen / Ryzen 5 3600', tier: 'low', type: 'cpu', multiplier: 0.85 },
  { id: 'cpu-mid', name: 'Intel Core i5 13600K / Ryzen 5 7600X', tier: 'mid', type: 'cpu', multiplier: 1.1 },
  { id: 'cpu-high', name: 'Intel Core i7 14700K / Ryzen 7 5800X3D', tier: 'high', type: 'cpu', multiplier: 1.35 },
  { id: 'cpu-ultra', name: 'Intel Core i9 14900K / Ryzen 7 7800X3D', tier: 'high', type: 'cpu', multiplier: 1.6 }
];

export const GPU_SPECS: HardwareSpec[] = [
  { id: 'gpu-low', name: 'GTX 1050 Ti / RX 570', tier: 'low', type: 'gpu', multiplier: 0.6 },
  { id: 'gpu-mid-old', name: 'GTX 1660 Super / RTX 2060 / RX 5600', tier: 'low', type: 'gpu', multiplier: 0.85 },
  { id: 'gpu-mid', name: 'RTX 3060 Ti / RTX 4060 / RX 6700 XT', tier: 'mid', type: 'gpu', multiplier: 1.15 },
  { id: 'gpu-high', name: 'RTX 4070 Super / RX 7800 XT / RTX 3080', tier: 'high', type: 'gpu', multiplier: 1.45 },
  { id: 'gpu-ultra', name: 'RTX 4080 Super / RTX 4090 / RX 7900 XTX', tier: 'high', type: 'gpu', multiplier: 1.8 }
];

export const SERVER_LIST: PingServer[] = [
  { id: 'srv-01', name: 'NA East (Virginia)', region: 'North America', basePing: 34 },
  { id: 'srv-02', name: 'NA West (Oregon)', region: 'North America', basePing: 52 },
  { id: 'srv-03', name: 'NA Central (Chicago)', region: 'North America', basePing: 22 },
  { id: 'srv-04', name: 'EU West (Frankfurt)', region: 'Europe', basePing: 42 },
  { id: 'srv-05', name: 'EU North (Stockholm)', region: 'Europe', basePing: 58 },
  { id: 'srv-06', name: 'EU East (Warsaw)', region: 'Europe', basePing: 49 },
  { id: 'srv-07', name: 'Asia East (Tokyo)', region: 'Asia Pacific', basePing: 85 },
  { id: 'srv-08', name: 'Asia Southeast (Singapore)', region: 'Asia Pacific', basePing: 74 },
  { id: 'srv-09', name: 'Oceania (Sydney)', region: 'Asia Pacific', basePing: 92 },
  { id: 'srv-10', name: 'SA East (São Paulo)', region: 'South America', basePing: 65 }
];
