"use client";

import { useState } from "react";
import IdeaForm from "@/components/IdeaForm";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import TaskBoard from "@/components/TaskBoard";
import { Sparkles, ArrowLeft, Layers, CheckCircle2, Cpu, Download, Loader2 } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const downloadBoilerplate = async () => {
    if (!result) return;
    try {
      const response = await fetch("/api/generate-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectName: result.projectName, 
          suggestedStack: result.suggestedStack 
        }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.projectName}_Boilerplate.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed. Server is busy.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-32">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-8">
            <Sparkles size={16} />
            <span>AI Architect Engine 3.1</span>
          </div>
          
          <h1 className="text-6xl font-extrabold tracking-tight lg:text-7xl">
            Pulse <span className="text-blue-500">Architect</span>
          </h1>
        </div>

        <div className="mt-8">
          {isAnalyzing ? (
            /* PHASE 7: Loading State UI */
            <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                  <Loader2 size={80} className="text-blue-500 animate-spin" />
               </div>
               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Architecting Solution...</h2>
                  <p className="text-slate-500">Mapping nodes, generating tasks, and preparing boilerplate.</p>
               </div>
            </div>
          ) : !result ? (
            <IdeaForm onStart={() => setIsAnalyzing(true)} onResult={(data) => {
              setResult(data);
              setIsAnalyzing(false);
            }} />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <button 
                  onClick={() => setResult(null)}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800"
                >
                  <ArrowLeft size={16} />
                  New Project
                </button>
                
                <div className="flex items-center gap-4">
                    <button 
                      onClick={downloadBoilerplate}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                      <Download size={18} />
                      Download Boilerplate
                    </button>
                    <div className="hidden sm:flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
                      <Cpu size={14} className="text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400">{result.suggestedStack}</span>
                    </div>
                </div>
              </div>

              {/* Result View */}
              <div className="space-y-20">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Layers size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-bold">System Architecture</h2>
                  </div>
                  <ArchitectureDiagram data={result.architecture} />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                    <h2 className="text-2xl font-bold">Implementation Roadmap</h2>
                  </div>
                  <TaskBoard tasks={result.tasks} />
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}