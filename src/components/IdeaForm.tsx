"use client";
import { useState } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";

interface IdeaFormProps {
  onResult: (data: any) => void;
  onStart: () => void;
}

export default function IdeaForm({ onResult, onStart }: IdeaFormProps) {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    setLoading(true);
    onStart(); // Trigger the parent's loading UI

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: idea }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      onResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("AI limit reached or connection lost. Try again.");
      onResult(null); // Reset parent state
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-2 transition-all hover:border-blue-500/50 shadow-2xl">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={loading}
          placeholder="Describe your hackathon idea (e.g., A mobile app for tracking stray dogs and reporting them to vets)..."
          className="h-32 w-full resize-none bg-transparent p-4 text-lg outline-none placeholder:text-slate-600 disabled:opacity-50"
          required
        />
        
        <div className="flex items-center justify-between border-t border-slate-800 p-2">
          <p className="px-2 text-xs text-slate-500 italic">
            {loading ? "AI is processing nodes and tasks..." : "Be specific about features for better results."}
          </p>
          <button
            type="submit"
            disabled={loading || !idea}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Analyze Idea
                <SendHorizontal size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}