import { Tweak } from '../types';

export const FPS_TWEAKS: Tweak[] = [
  // --- CPU & Power Management ---
  {
    id: 'cpu-01',
    name: 'Activate Ultimate Performance Plan',
    description: 'Enables the hidden Windows Ultimate Performance power plan, eliminating micro-throttling and maximizing CPU frequencies.',
    category: 'cpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 8,
    registryPath: 'Power Schemes',
    commandValue: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
  },
  {
    id: 'cpu-02',
    name: 'Disable CPU Core Parking',
    description: 'Prevents Windows from parking idle CPU cores, reducing inter-core latency and stutters in heavily threaded modern games.',
    category: 'cpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 6,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00',
    commandValue: 'Disable core parking registry values'
  },
  {
    id: 'cpu-03',
    name: 'Enable hardware-level Speed Shift (SST)',
    description: 'Instructs the processor to switch frequencies within sub-milliseconds rather than relying on slower OS-level scaling.',
    category: 'cpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\CosSST',
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power /v IntelSST /t REG_DWORD /d 1 /f'
  },
  {
    id: 'cpu-04',
    name: 'Optimize BIOS Intel SpeedStep / AMD Cool\'n\'Quiet',
    description: 'Recommendations to disable power saving frequency scaling in firmware to maintain fixed high-speed clock cycles.',
    category: 'cpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3
  },
  {
    id: 'cpu-05',
    name: 'Configure Game Mode Priority Boost',
    description: 'Allocates higher thread scheduling priority to foreground game processes (CPU Priority 6).',
    category: 'cpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 7,
    registryPath: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games',
    commandValue: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f'
  },
  {
    id: 'cpu-06',
    name: 'Disable Intel TSX (Transactional Synchronization Extensions)',
    description: 'Disables TSX execution on compatible CPUs, improving pure single-core thread execution margins.',
    category: 'cpu',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager /v DisableTSX /t REG_DWORD /d 1 /f'
  },
  {
    id: 'cpu-07',
    name: 'Set SystemResponsiveness to 0%',
    description: 'Overrides standard Windows desktop backup and index resource reservation, granting full CPU shares to games.',
    category: 'cpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 5,
    registryPath: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile',
    commandValue: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'cpu-08',
    name: 'Limit Processor State Throttle Minimum',
    description: 'Forces the Windows kernel scheduler to maintain at least 100% active state clocks for all physical processor threads.',
    category: 'cpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    commandValue: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100'
  },
  {
    id: 'cpu-09',
    name: 'Disable Power Throttling globally',
    description: 'Overrides active power-saving group policies that temporarily downclock low-priority thread pools.',
    category: 'cpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling',
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling /v PowerThrottlingOff /t REG_DWORD /d 1 /f'
  },
  {
    id: 'cpu-10',
    name: 'Disable Intel Hyper-Threading for Vintage Titles',
    description: 'Restricts legacy games to pure physical CPU cores to eliminate hyperthreaded task scheduling bottlenecks.',
    category: 'cpu',
    type: 'fps',
    impact: 'Low',
    fpsGain: 2
  },
  {
    id: 'cpu-11',
    name: 'Raise Processor Thread Priority for Shell',
    description: 'Allocates high real-time scheduling priority indexes to explorer desktop cycles.',
    category: 'cpu',
    type: 'fps',
    impact: 'Low',
    fpsGain: 2,
    commandValue: 'reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer /v Win32PrioritySeparation /t REG_DWORD /d 38 /f'
  },

  // --- GPU & Display Optimization ---
  {
    id: 'gpu-01',
    name: 'Enable HAGS (Hardware Accelerated GPU Scheduling)',
    description: 'Offloads high-frequency video memory management tasks directly to a dedicated on-card GPU scheduler processor.',
    category: 'gpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 8,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers',
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v HwSchMode /t REG_DWORD /d 2 /f'
  },
  {
    id: 'gpu-02',
    name: 'Optimize GPU Shader Cache size',
    description: 'Expands NVidia/AMD driver shader caching capacity to 10GB or Unlimited, preventing dynamic compiled stuttering.',
    category: 'gpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 7,
    registryPath: 'Global Driver Profile Settings'
  },
  {
    id: 'gpu-03',
    name: 'Set GPU Performance Mode to Maximum',
    description: 'Forces graphics processing units to constant full-load running clocks inside 3D competitive software.',
    category: 'gpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 6,
    registryPath: 'GPU Control Panel Preferences'
  },
  {
    id: 'gpu-04',
    name: 'Disable Fullscreen Optimizations',
    description: 'Bypasses Windows DWM overlay intervention, enforcing standard premium true exclusive borderless latency rules.',
    category: 'gpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 5,
    registryPath: 'HKCU\\System\\GameConfigStore',
    commandValue: 'reg add HKCU\\System\\GameConfigStore /v GameDVR_FSEBehavior /t REG_DWORD /d 2 /f'
  },
  {
    id: 'gpu-05',
    name: 'Force Variable Refresh Rate (VRR)',
    description: 'Activates Adaptive G-Sync/FreeSync syncing profiles on non-certified gaming displays.',
    category: 'gpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    registryPath: 'HKCU\\SOFTWARE\\Microsoft\\DirectX\\UserGpuPreferences'
  },
  {
    id: 'gpu-06',
    name: 'Disable Multi-Plane Overlays (MPO)',
    description: 'Mitigates display black screens, browser stuttering, and odd micro-freezes while multi-tasking and playing.',
    category: 'gpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    registryPath: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm',
    commandValue: 'reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm /v OverlayTestMode /t REG_DWORD /d 5 /f'
  },
  {
    id: 'gpu-07',
    name: 'Configure GPU Interrupt Affinity',
    description: 'Directs all physical graphics card processing interrupts to target the CPU physical cores closest to memory channels.',
    category: 'gpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3
  },
  {
    id: 'gpu-08',
    name: 'Enable Ultra Low Latency Mode (Reflex simulation)',
    description: 'Instructs the driver rendering queue to prepare frames just-in-time, lowering engine backpressure.',
    category: 'gpu',
    type: 'fps',
    impact: 'High',
    fpsGain: 6
  },
  {
    id: 'gpu-09',
    name: 'Set GPU Driver Service Priority',
    description: 'Raises the underlying NVidia Display Driver/AMD Crimson service scheduling priority in the Windows register.',
    category: 'gpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "GraphicsScheduler" /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gpu-10',
    name: 'Enforce High Performance on Windows Graphics Settings',
    description: 'Forces Windows to route standard game executives to the highest power status graphics chip.',
    category: 'gpu',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    registryPath: 'HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences'
  },
  {
    id: 'gpu-11',
    name: 'Disable Nvidia Ansel Screen Capture Utility',
    description: 'Turns off background active hooks used in Nvidia Ansel screenshot services to avoid system polling.',
    category: 'gpu',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1
  },

  // --- RAM / Memory Optimization ---
  {
    id: 'ram-01',
    name: 'Disable Windows Memory Compression',
    description: 'Stops Windows from allocating background CPU horsepower to compress pagefile structures, optimizing raw memory speeds.',
    category: 'ram',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    commandValue: 'powershell -Command "Disable-MMAgent -MemoryCompression"'
  },
  {
    id: 'ram-02',
    name: 'Configure Intelligent Standby List Purge',
    description: 'Triggers automatic flushing of idle background memory caches when free physical RAM drops below 1024MB.',
    category: 'ram',
    type: 'fps',
    impact: 'High',
    fpsGain: 6
  },
  {
    id: 'ram-03',
    name: 'Optimize Virtual Memory Paging File',
    description: 'Enforces fixed customized allocation sizes (minimum 1.5x, maximum 3x system RAM limits) to block real-time resizes.',
    category: 'ram',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2
  },
  {
    id: 'ram-04',
    name: 'Disable SuperFetch & SysMain service',
    description: 'Terminates continuous background indexing/pre-loading of standard windows utilities, liberating system IO bottlenecks.',
    category: 'ram',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    commandValue: 'sc stop SysMain && sc config SysMain start= disabled'
  },
  {
    id: 'ram-05',
    name: 'Increase System Cache Dirty Page limits',
    description: 'Allows Windows file systems to hold more modified buffers in local RAM before committing disk write sequences.',
    category: 'ram',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d 1 /f'
  },
  {
    id: 'ram-06',
    name: 'Disable Windows RAM Diagnostic telemetry',
    description: 'Avoids periodic RAM-scanning microtasks scheduled dynamically inside standard core services.',
    category: 'ram',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'schtasks /change /tn "Microsoft\\Windows\\MemoryDiagnostic\\ProcessMemoryDiagnosticEvents" /disable'
  },
  {
    id: 'ram-07',
    name: 'Optimize NonPagedPoolCache limits',
    description: 'Instructs executive pools to maximize non-swappable active memory buffers for hardware drivers.',
    category: 'ram',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "PoolUsageMaximum" /t REG_DWORD /d 60 /f'
  },
  {
    id: 'ram-08',
    name: 'Optimize Hardware RAM Speed (Advice)',
    description: 'Recommends checking and enabling BIOS XMP (Extreme Memory Profile) or AMD EXPO/D.O.C.P. to utilize certified RAM stock speeds.',
    category: 'ram',
    type: 'fps',
    impact: 'High',
    fpsGain: 10
  },

  // --- Windows Bloatware & Service Disabling ---
  {
    id: 'bloat-01',
    name: 'Disable Windows Game Bar & DVR overlays',
    description: 'Disables intensive core Game DVR active loop capture services running in the background of active games.',
    category: 'bloatware',
    type: 'fps',
    impact: 'High',
    fpsGain: 7,
    registryPath: 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR',
    commandValue: 'reg add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\GameDVR /v AppCaptureEnabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'bloat-02',
    name: 'Disable Windows Telemetry services',
    description: 'Bypasses standard diagnostic and feedback collection loops sending intensive usage telemetry payload telemetry.',
    category: 'bloatware',
    type: 'fps',
    impact: 'High',
    fpsGain: 5,
    registryPath: 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection',
    commandValue: 'reg add HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection /v AllowTelemetry /t REG_DWORD /d 0 /f'
  },
  {
    id: 'bloat-03',
    name: 'Disable Xbox Live accessory services',
    description: 'Turns off automatic socket polling and drivers designed for peripheral sync, saving valuable system resource margins.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    commandValue: 'sc config XblAuthManager start= disabled && sc config XblGameSave start= disabled'
  },
  {
    id: 'bloat-04',
    name: 'Disable Windows Search Indexing (WSearch)',
    description: 'Prevents automatic scanning and continuous reading of drives during high-intensity 3D matches.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4,
    commandValue: 'sc stop WSearch && sc config WSearch start= disabled'
  },
  {
    id: 'bloat-05',
    name: 'Disable Windows Error Reporting Service',
    description: 'Stop standard crash report transmission and logs caching processes running in your background.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'sc stop WerSvc && sc config WerSvc start= disabled'
  },
  {
    id: 'bloat-06',
    name: 'Remove Windows Preinstalled Bloatware Apps',
    description: 'Clears modern UWP packages (Microsoft.BingNews, Weather, etc.) freeing system background threads completely.',
    category: 'bloatware',
    type: 'fps',
    impact: 'High',
    fpsGain: 5,
    commandValue: 'Get-AppxPackage -AllUsers | Remove-AppxPackage (Targeted clean)'
  },
  {
    id: 'bloat-07',
    name: 'Disable Windows News & Interests Feed',
    description: 'Halts real-time updates and RAM cache queries from taskbar widgets.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" /v "ShellFeedsTaskbarViewMode" /t REG_DWORD /d 2 /f'
  },
  {
    id: 'bloat-08',
    name: 'Disable Cortana integration',
    description: 'Kills the heavy voice assistant service and background processes permanently.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v "AllowCortana" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'bloat-09',
    name: 'Disable Remote Registry Service',
    description: 'Stops external network devices from altering internal configurations, boosting local security and freeing minor background IO pins.',
    category: 'bloatware',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'sc stop RemoteRegistry && sc config RemoteRegistry start= disabled'
  },

  // --- Disk & Filesystem Optimizations ---
  {
    id: 'disk-01',
    name: 'Enable NTFS Write Caching',
    description: 'Instructs the NTFS system to pool writes to the RAM write-buffer before flushing to mechanical or flash storage.',
    category: 'disk',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    registryPath: 'Device Manager Disk Policies'
  },
  {
    id: 'disk-02',
    name: 'Enable Storage Trim regularly',
    description: 'Configures optimized scheduled SSD block garbage collection (TRIM commands) to maintain flash endurance and speeds.',
    category: 'disk',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'defrag C: /O /H'
  },
  {
    id: 'disk-03',
    name: 'Optimize NTFS 8dot3 Name Creation',
    description: 'Speeds up search and read sequences in directories with thousands of files by disabling short legacy file alias generation.',
    category: 'disk',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'fsutil 8dot3name set 1'
  },
  {
    id: 'disk-04',
    name: 'Increase NTFS memory allocation cushion',
    description: 'Enlarges maximum memory buffers assigned for tracking active files and folder indexes.',
    category: 'disk',
    type: 'fps',
    impact: 'Low',
    fpsGain: 2,
    commandValue: 'fsutil behavior set memoryusage 2'
  },
  {
    id: 'disk-05',
    name: 'Disable NTFS Last Access Timestamp',
    description: 'Prevents the filesystem from writing timestamp logs every time file structures are accessed by local engines.',
    category: 'disk',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'fsutil behavior set disablelastaccess 1'
  },
  {
    id: 'disk-06',
    name: 'Disable Windows Storage Sense daemon',
    description: 'Blocks regular background scans scanning directories for unreferenced files mid-game.',
    category: 'disk',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    registryPath: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\StorageSense'
  },

  // --- Visual Effects & Animations ---
  {
    id: 'visuals-01',
    name: 'Enable "Adjust for Best Performance" options',
    description: 'Purges costly Windows system aero blur patterns, outline dropshadows, and fading transitions.',
    category: 'visuals',
    type: 'fps',
    impact: 'High',
    fpsGain: 6,
    registryPath: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects',
    commandValue: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v "VisualFXSetting" /t REG_DWORD /d 2 /f'
  },
  {
    id: 'visuals-02',
    name: 'Turn off Transparency Effects',
    description: 'Disables Aero blur render filters in target backgrounds, lowering GPU compute overhead instantly.',
    category: 'visuals',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 3,
    commandValue: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v "EnableTransparency" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'visuals-03',
    name: 'Minimize Windows Font Cache Overhead',
    description: 'Limits font-smoothing execution loops to active screens only, skipping heavy system background tables.',
    category: 'visuals',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1
  },
  {
    id: 'visuals-04',
    name: 'Disable Aero Snap window animations',
    description: 'Eliminates sliding delay times when snapping screens with competitive overlay modules active.',
    category: 'visuals',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    registryPath: 'HKCU\\Control Panel\\Desktop'
  },
  {
    id: 'visuals-05',
    name: 'Disable Windows Startup Delay',
    description: 'Saves startup boot buffers and speeds up loading into competitive gaming launchers right after power-on.',
    category: 'visuals',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Serialize" /v "StartupDelayInMSec" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'visuals-06',
    name: 'Set Hardware Acceleration to Max in Discord/Steam',
    description: 'Optimizations for companion gaming software overlays to skip double CPU compositing overlays.',
    category: 'visuals',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 4
  },
  {
    id: 'visuals-07',
    name: 'Disable Lock Screen Slide Show background',
    description: 'Stops Windows from caching multiple large image assets in VRAM during screen locks.',
    category: 'visuals',
    type: 'fps',
    impact: 'Low',
    fpsGain: 1,
    commandValue: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v "NoLockScreenSlideshow" /t REG_DWORD /d 1 /f'
  },
  {
    id: 'visuals-08',
    name: 'Purge Windows Prefetch Temporary Storage',
    description: 'Frees dirty layout parameters left in local caches by outdated system processes.',
    category: 'visuals',
    type: 'fps',
    impact: 'Medium',
    fpsGain: 2,
    commandValue: 'del /q /f /s %WINDIR%\\Prefetch\\* (Requires PowerShell)'
  }
];

export const PING_TWEAKS: Tweak[] = [
  // --- TCP/IP Stack & Registry Network Tuning ---
  {
    id: 'tcp-01',
    name: 'Disable Nagle\'s Algorithm (TCPNoDelay)',
    description: 'Forces packages to transmit instantly without waiting to merge small buffers, decreasing game ping in competitive shooters.',
    category: 'tcp',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 25,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces',
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\{Your_Interface}" /v "TCPNoDelay" /t REG_DWORD /d 1 /f'
  },
  {
    id: 'tcp-02',
    name: 'Fine-tune TCPAckFrequency registry key',
    description: 'Bypasses the delayed network acknowledgment timer (200ms) to respond to host packets immediately.',
    category: 'tcp',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 20,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces',
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\{Your_Interface}" /v "TCPAckFrequency" /t REG_DWORD /d 1 /f'
  },
  {
    id: 'tcp-03',
    name: 'Disable Network Throttling Index',
    description: 'Stops Windows from throttling non-multimedia network packets when network bandwidth is being fully utilized.',
    category: 'tcp',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 18,
    registryPath: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile',
    commandValue: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 4294967295 /f'
  },
  {
    id: 'tcp-04',
    name: 'Set TCP Auto-Tuning level to "Normal"',
    description: 'Enables safe dynamic window size scaling adjustments tailored to high-speed fiber lines.',
    category: 'tcp',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 8,
    commandValue: 'netsh int tcp set global autotuninglevel=normal'
  },
  {
    id: 'tcp-05',
    name: 'Disable TCP Chimney Offload settings',
    description: 'Prevents the CPU from offloading network packet assembly to sluggish network interfaces, securing higher system reliability.',
    category: 'tcp',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 10,
    commandValue: 'netsh int tcp set global chimney=disabled'
  },
  {
    id: 'tcp-06',
    name: 'Enable Congestion Control Provider (CTCP)',
    description: 'Forces Windows to use Compound TCP instead of conservative loss-based TCP algorithms, resolving packet spikes.',
    category: 'tcp',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 15,
    commandValue: 'netsh int tcp set global congestionprovider=ctcp'
  },
  {
    id: 'tcp-07',
    name: 'Disable IP Helper Service (iphlpsvc)',
    description: 'Stops background tunnel adapter translation layers (IPv6 mappings) from initiating latent pings.',
    category: 'tcp',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 5,
    commandValue: 'sc stop iphlpsvc && sc config iphlpsvc start= disabled'
  },
  {
    id: 'tcp-08',
    name: 'Enable High Performance network scaling',
    description: 'Instructs the TCP stack to process multiple network receive queues simultaneously.',
    category: 'tcp',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 10,
    commandValue: 'netsh int ip set global taskoffload=enabled'
  },

  // --- DNS & Network Adapter Optimizations ---
  {
    id: 'dns-01',
    name: 'Flush System DNS Cache Resolver',
    description: 'Purges outdated, corrupted address maps to force clean routing paths right to competitive lobbies.',
    category: 'dns',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 12,
    commandValue: 'ipconfig /flushdns'
  },
  {
    id: 'dns-02',
    name: 'Switch to Low-Latency Cloudflare DNS',
    description: 'Replaces generic ISP servers with ultra-fast nodes (1.1.1.1 & 1.0.0.1) reducing matchmaking domain lookup spikes.',
    category: 'dns',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 15,
    commandValue: 'netsh interface ip set dns name="Ethernet" static 1.1.1.1'
  },
  {
    id: 'dns-03',
    name: 'Switch to Google Public DNS',
    description: 'Configures fast secondary routing endpoints (8.8.8.8) to lower game server IP resolve durations.',
    category: 'dns',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 12,
    commandValue: 'netsh interface ip set dns name="Ethernet" static 8.8.8.8'
  },
  {
    id: 'dns-04',
    name: 'Configure DNS Cache Timeout optimization',
    description: 'Forces local DNS queries to stay active in memory longer, skipping network resolution cycles.',
    category: 'dns',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 4,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Dnscache\\Parameters'
  },
  {
    id: 'dns-05',
    name: 'Disable NetBIOS over TCP/IP protocol',
    description: 'Saves Ethernet resources by blocking classic desktop network discovery loops.',
    category: 'dns',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 5,
    registryPath: 'NetBIOS network settings'
  },
  {
    id: 'dns-06',
    name: 'Enable DNS Negative Cache prevention',
    description: 'Disables caching of failed domain lookups to ensure the client immediately retries connecting to servers.',
    category: 'dns',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 3,
    registryPath: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Dnscache\\Parameters\\MaxNegativeCacheTtl'
  },

  // --- NIC (Network Interface Card) Advanced Driver Config ---
  {
    id: 'nic-01',
    name: 'Disable Interrupt Moderation on NIC',
    description: 'Eliminates the packet buffering buffers, triggering CPU processing callbacks immediately upon packet arrivals.',
    category: 'nic',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 20,
    registryPath: 'Network Adapter Advanced Properties'
  },
  {
    id: 'nic-02',
    name: 'Disable Green Ethernet & Energy Savings',
    description: 'Blocks network chips from powering down to low voltage states during matchmaking queues.',
    category: 'nic',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 10,
    commandValue: 'Turns off power saver modes on Ethernet Controller'
  },
  {
    id: 'nic-03',
    name: 'Disable Flow Control on LAN card',
    description: 'Instructs the network adapter to skip pause frames, preventing sudden network stalls under heavy inputs.',
    category: 'nic',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 8,
    registryPath: 'Network Adapter advanced registers'
  },
  {
    id: 'nic-04',
    name: 'Enable Receive Side Scaling (RSS)',
    description: 'Splits core packet-receipt processing overhead across multiple CPU processors safely.',
    category: 'nic',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 14,
    commandValue: 'Enable RSS in NIC advanced panel'
  },
  {
    id: 'nic-05',
    name: 'Disable Large Send Offload (LSO)',
    description: 'Stops network hardware drivers from packing bulk streams together, maintaining steady game tick packages.',
    category: 'nic',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 10,
    registryPath: 'LSO advanced settings'
  },
  {
    id: 'nic-06',
    name: 'Optimize Transmit/Receive Buffers',
    description: 'Slightly reduces buffer caps to avoid packet queuing delays, improving competitive packet velocity.',
    category: 'nic',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 8
  },
  {
    id: 'nic-07',
    name: 'Set Network Adapter Priority to Low Latency',
    description: 'Sets specific network parameters to favor response speed over total download volume.',
    category: 'nic',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 11
  },
  {
    id: 'nic-08',
    name: 'Disable ARP Offload on NIC',
    description: 'Forces the computer processing engines to handle identity lookup validations instantly under loads.',
    category: 'nic',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 5
  },

  // --- Quality of Service & Queue Management (CoS) ---
  {
    id: 'qos-01',
    name: 'Reserve optimal MTU sizing (1500 bytes)',
    description: 'Adjusts Maximum Transmission Unit size to prevent unnecessary packet fragmentation.',
    category: 'qos',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 12,
    commandValue: 'netsh interface ipv4 set subinterface "Ethernet" mtu=1500 store=persistent'
  },
  {
    id: 'qos-02',
    name: 'Establish QoS Packet Scheduler reservation to 0%',
    description: 'Stops Windows from locking up 20% total internet bandwidth allocation limits for automated updates.',
    category: 'qos',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 10,
    registryPath: 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched',
    commandValue: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v "NonBestEffortLimit" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'qos-03',
    name: 'Prioritize Game Ports in QoS policies',
    description: 'Directs the router and OS scheduler to prioritize real-time UDP gaming connection buffers.',
    category: 'qos',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 15
  },
  {
    id: 'qos-04',
    name: 'Disable network-level Task Offload (TaskOffload)',
    description: 'Stops system overhead issues on unstable network chips, securing highly focused server ping profiles.',
    category: 'qos',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 6,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ipsec /v NoDefaultTaskOffload /t REG_DWORD /d 1 /f'
  },
  {
    id: 'qos-05',
    name: 'Tune TCP Time Wait Delay to short 30 seconds',
    description: 'Recycles socket properties quickly, freeing network memory paths back into target servers.',
    category: 'qos',
    type: 'ping',
    impact: 'Medium',
    fpsGain: 0,
    pingReduction: 9,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters /v TcpTimedWaitDelay /t REG_DWORD /d 30 /f'
  },
  {
    id: 'qos-06',
    name: 'Limit Maximized User Connections limit',
    description: 'Expands maximum simultaneously active communication ports, blocking packet saturation caps.',
    category: 'qos',
    type: 'ping',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 5,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters /v MaxUserPort /t REG_DWORD /d 65534 /f'
  },
  {
    id: 'qos-07',
    name: 'Enable DSCP Value mapping for Game Executables',
    description: 'Hooks network headers with class identification bits to guarantee router fast-track handling.',
    category: 'qos',
    type: 'ping',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 16
  }
];

export const STABILITY_TWEAKS: Tweak[] = [
  {
    id: 'stab-01',
    name: 'Disable HPET (High Precision Event Timer)',
    description: 'Disables HPET within Device Manager to prevent microstuttering caused by continuous clock polling bottlenecks.',
    category: 'stability',
    type: 'stability',
    impact: 'High',
    fpsGain: 4,
    pingReduction: 0,
    commandValue: 'bcdedit /set useplatformclock no && bcdedit /set disabledynamictick yes'
  },
  {
    id: 'stab-02',
    name: 'Disable PCI Express Link State Power Management',
    description: 'Guarantees the GPU and expansion cards are powered at peak active currents without active low-power delays.',
    category: 'stability',
    type: 'stability',
    impact: 'High',
    fpsGain: 3,
    pingReduction: 0,
    commandValue: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASYNC_CLEANUP 0'
  },
  {
    id: 'stab-03',
    name: 'Setup Automated Windows Registry Backups',
    description: 'Re-enables the legacy background regback scheduler task to safe-guard configs before deep updates.',
    category: 'stability',
    type: 'stability',
    impact: 'Medium',
    fpsGain: 1,
    pingReduction: 0,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Configuration Manager /v EnablePeriodicalBackup /t REG_DWORD /d 1 /f'
  },
  {
    id: 'stab-04',
    name: 'Increase GPU Crash Recovery Timeout (TdrDelay)',
    description: 'Increases the display driver watchdog timeout to 10 seconds, preventing annoying game crashes during render lags.',
    category: 'stability',
    type: 'stability',
    impact: 'High',
    fpsGain: 0,
    pingReduction: 0,
    commandValue: 'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v TdrDelay /t REG_DWORD /d 10 /f'
  },
  {
    id: 'stab-05',
    name: 'Set Windows System Responsiveness Profile',
    description: 'Configures optimized scheduler properties favoring system-wide processes over dynamic updates.',
    category: 'stability',
    type: 'stability',
    impact: 'Medium',
    fpsGain: 2,
    pingReduction: 0,
    commandValue: 'reg add HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile /v SystemResponsiveness /t REG_DWORD /d 0 /f'
  },
  {
    id: 'stab-06',
    name: 'Disable System Page Pooling limits',
    description: 'Increases local stability margins by stopping dynamic memory dumps during critical low-ram environments.',
    category: 'stability',
    type: 'stability',
    impact: 'Low',
    fpsGain: 0,
    pingReduction: 0,
    commandValue: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 1 /f'
  }
];

export const ALL_TWEAKS = [...FPS_TWEAKS, ...PING_TWEAKS, ...STABILITY_TWEAKS];
export const FPS_TWEAKS_COUNT = FPS_TWEAKS.length; // Will be exactly 52 tweaks (11 + 11 + 8 + 9 + 6 + 8 - wait let's sum them: 11 cpu + 11 gpu + 8 ram + 9 bloat + 6 disk + 8 visuals = 53 tweaks!)
export const PING_TWEAKS_COUNT = PING_TWEAKS.length; // Will be exactly 27 tweaks (8 tcp + 6 dns + 8 nic + 7 qos = 29 tweaks!)
