
import React, { useState } from 'react';
import { AppStep, LogoGenerationResult, MotionPreset } from './types';
import { generateLogo } from './services/geminiService';
import LoadingView from './components/LoadingView';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.DesignInput);
  const [logoPrompt, setLogoPrompt] = useState('');
  const [logoResult, setLogoResult] = useState<LogoGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMotion, setActiveMotion] = useState<MotionPreset>('reveal');

  const handleGenerateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoPrompt.trim()) return;

    setError(null);
    setStep(AppStep.LogoGenerating);
    try {
      const result = await generateLogo(logoPrompt);
      setLogoResult(result);
      setStep(AppStep.LogoResult);
    } catch (err: any) {
      setError('Generation failed. Please try a different description.');
      setStep(AppStep.DesignInput);
    }
  };

  const reset = () => {
    setLogoPrompt('');
    setLogoResult(null);
    setStep(AppStep.DesignInput);
    setError(null);
  };

  const getMotionClass = (preset: MotionPreset) => {
    switch (preset) {
      case 'reveal': return 'animate-reveal';
      case 'float': return 'animate-float';
      case 'pulse': return 'animate-pulse-glow';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <style>{`
        @keyframes reveal {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: blur(10px) brightness(2); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(0); }
          50% { transform: translateY(-15px) rotateX(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.8)); transform: scale(1.02); }
        }
        .animate-reveal { animation: reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; perspective: 1000px; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-bolt-lightning text-white"></i>
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-tight">Lumina <span className="text-indigo-400 font-light">Free</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <span className="text-xs font-bold text-green-500 uppercase flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Unlimited Access
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>{error}</p>
          </div>
        )}

        {step === AppStep.DesignInput && (
          <div className="glass p-8 rounded-3xl space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold text-white">Logo Concept</h2>
              <p className="text-gray-400">Instantly generate professional logos for your brand.</p>
            </div>

            <form onSubmit={handleGenerateLogo} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">What is your company about?</label>
                <textarea
                  value={logoPrompt}
                  onChange={(e) => setLogoPrompt(e.target.value)}
                  placeholder="e.g., A minimalist solar energy startup called 'Helios'. Use orange and charcoal tones with a circular sun motif."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={!logoPrompt.trim()}
                className="btn-gradient w-full py-5 rounded-2xl font-bold text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
              >
                Generate Logo
                <i className="fa-solid fa-wand-magic-sparkles ml-2 group-hover:rotate-12 transition-transform"></i>
              </button>
            </form>
          </div>
        )}

        {step === AppStep.LogoGenerating && <LoadingView />}

        {step === AppStep.LogoResult && logoResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Motion Preview Stage */}
            <div className="relative glass p-12 rounded-3xl text-center space-y-10 overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
              {/* Cinematic Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent -z-10"></div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold text-white">Animated Version</h2>
                <div className="flex justify-center gap-2">
                  {(['reveal', 'float', 'pulse'] as MotionPreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setActiveMotion(preset)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        activeMotion === preset 
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
                          : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Logo with Active Animation */}
              <div className="relative group max-w-sm w-full mx-auto">
                <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${getMotionClass(activeMotion)}`}>
                  <img 
                    src={logoResult.imageUrl} 
                    alt="Generated Logo" 
                    key={activeMotion} // Force animation re-trigger on preset change
                    className="w-full h-auto" 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                 <a 
                  href={logoResult.imageUrl} 
                  download="logo.png" 
                  className="px-6 py-3 glass hover:bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <i className="fa-solid fa-download"></i> Save Logo
                </a>
                <button 
                  onClick={reset}
                  className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all"
                >
                  New Concept
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Input Description</span>
                <p className="text-sm text-gray-300 italic">"{logoPrompt}"</p>
              </div>
              <div className="glass p-6 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Model Info</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-bolt text-green-500 text-xs"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Gemini 2.5 Flash</p>
                    <p className="text-[10px] text-gray-500">Free Tier Access Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Aesthetic Accents */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default App;
