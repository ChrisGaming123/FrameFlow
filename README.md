# FrameFlow - OS Optimization Utility

A beautifully crafted, modern utility designed to guide Windows gamers and professionals through OS alignment, registry tuning, latency diagnostics, and power scheme deployment.

<p align="center">
  <a href="https://github.com/christian-zeigler101013/FrameFlow/archive/refs/heads/main.zip">
    <img src="https://img.shields.io/badge/Download_FrameFlow-Direct_ZIP_Download-0052FF?style=for-the-badge&logo=github&logoColor=white" alt="Download ZIP" height="40" />
  </a>
</p>

---

## 📥 How to Download FrameFlow

You can download and run this application on your local computer using two different methods:

### Option A: Direct Download (Easiest)
1. Click the **Download FrameFlow** badge above (or go to the **Settings Menu** in Google AI Studio and click **Export as ZIP**).
2. Extract the downloaded `.zip` file into any folder on your computer.

### Option B: Clone via GitHub
If you have exported this project to your own GitHub repository, clone it instantly:
```bash
git clone <your-repository-url>
cd <project-directory>
```

---

## 🚀 Local Installation Guide

To run this application locally on your computer, follow these simple steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine. We recommend using the LTS version (Node 18+).

### 2. Download or Clone the Repository
If you downloaded this project as a ZIP file, extract it to a directory of your choice. If you exported it to GitHub, clone it in your terminal:
```bash
git clone <your-repository-url>
cd <project-directory>
```

### 3. Install Dependencies
Initialize and install the necessary npm packages by running:
```bash
npm install
```

### 4. Configure Your Environment Variables
The application utilizes environment configurations. Create a file named `.env.local` or `.env` in the root directory (the same folder as `package.json`).

Copy the template from `.env.example` or paste the following into your `.env.local` file:
```env
# Your Gemini API Key for running AI features
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# The local development URL
APP_URL="http://localhost:3000"
```

> **How to get a Gemini API Key:** 
> Go to the [Google AI Studio Secrets Panel](https://aistudio.google.com/) or the developer console, generate an API key, and paste it here.

### 5. Launch the Development Server
Run the local dev server:
```bash
npm run dev
```

Once started, open your browser and navigate to the local host address:
- **URL**: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Project Technical Stack

- **Framework**: [React](https://react.dev/) 19 (TypeScript)
- **Bundler & Fast HMR**: [Vite](https://vite.dev/) 6
- **Styles**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Codebase Directory Outline

- `src/App.tsx` - The core application shell containing the layout and main view router.
- `src/components/` - High-fidelity subcomponents:
  - `Optimizations` (TweakManager) - Interactive toggles for OS parameters.
  - `Overclocker` (AdvancedTweaks) - Controls for thread states and hardware parameters.
  - `PowerPlan` - Windows custom power scheme registry deployment instructions.
  - `Performance Details` (TelemetryDashboard) - Interactive monitoring simulations.
  - `Latency Diagnostic` - Simulated network & interrupt testing utility.
  - `FPS Calculator` - Real-time competitive FPS predictor metrics.
