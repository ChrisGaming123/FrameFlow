# FrameFlow - OS Optimization Utility

A beautifully crafted, modern utility designed to guide Windows gamers and professionals through OS alignment, registry tuning, latency diagnostics, and power scheme deployment.

## 📥 How to Download & Run FrameFlow

Since FrameFlow is a professional web-based utility app, you can download the entire source bundle as a ZIP file and run it offline on your PC with a single click.

### Step 1: Download the Web App Bundle
1. Go to the **Settings Menu** (represented by the cog icon gear in the top-right corner of Google AI Studio).
2. Click **Export as ZIP** (this compiles the real, latest source files directly into a download).
3. Extract the downloaded `.zip` file into any folder on your computer.

### Step 2: Run with 1-Click (`run.bat`)
To make running FrameFlow as easy as running a native Windows launcher, we have included a **`run.bat`** script at the root:
1. Double-click the **`run.bat`** file.
2. The launcher will automatically verify if you have Node.js installed, download packages if needed, start the local server, and open the app in your browser at **http://localhost:3000**!

---

## 🚀 Manual Installation Guide (For Developers)

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
