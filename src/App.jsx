import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAF7; color: #1C1C1E; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: #1A6
  const EXAMPLES = [
  "lait, œufs, riz, pâtes, huile, poulet, pommes, yaourts, pain de mie, beurre",
  "couches Pampers T4, lessive Ariel, savon, dentifrice, shampooing",
  "steaks hachés, carottes, courgettes, tomates, fromage râpé, crème fraîche, farine",
];

const SYSTEM_PROMPT = `Tu es RabaList, expert en courses alimentaires en France.
L'utilisateur te donne une liste de courses. Tu dois :
1. Estimer le coût dans 5 enseignes : Leclerc, Lidl, Aldi, Carrefour, Intermarché
2. Proposer des substitutions intelligentes pour économiser
3. Indiquer le meilleur magasin

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "savings": <entier euros>,
  "original_total": <décimal>,
  "optimized_total": <décimal>,
  "verdict": "<phrase courte>",
  "best_store": "<enseigne moins chère>",
  "stores": [
    {"name": "Leclerc", "price": <décimal>, "diff": <décimal>},
    {"name": "Lidl", "price": <décimal>, "diff": <décimal>},
    {"name": "Aldi", "price": <décimal>, "diff": <décimal>},
    {"name": "Carrefour", "price": <décimal>, "diff": <décimal>},
    {"name": "Intermarché", "price": <décimal>, "diff": <décimal>}
  ],
  "items": [
    {"name": "<produit>", "swap": "<substitution ou null>", "saving": <centimes>}
  ],
  "tip": "<conseil pratique>",
  "analysis": "<2-3 phrases>"
}
Prix réalistes France 2024-2025. Aldi et Lidl généralement moins chers.`;

function loadHistory() {
  try { return JSON.parse(sessionStorage.getItem("rabaList_history") || "[]"); }
  catch { return []; }
}
function saveHistory(h) {
  try { sessionStorage.setItem("rabaList_history", JSON.stringify(h)); } catch {}
}

export default function RabaList() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(loadHistory);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1800, temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Ma liste : ${input}` },
          ],
        }),
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      const entry = {
        id: Date.now(),
        label: input.slice(0, 60),
        savings: parsed.savings,
        best: parsed.best_store,
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        full: parsed, inputFull: input,
      };
      const newH = [entry, ...history].slice(0, 5);
      setHistory(newH); saveHistory(newH);
    } catch { setError("Impossible d'analyser ton panier. Réessaie."); }
    finally { setLoading(false); }
  };

  const shareResult = async () => {
    if (!result) return;
    const text = `🛒 RabaList\n\n🏆 Meilleur magasin : ${result.best_store}\n💰 Économies : -${result.savings}€\n${result.original_total?.toFixed(2)}€ → ${result.optimized_total?.toFixed(2)}€\n\n${result.verdict}\n\nraba-list.vercel.app`;
    try {
      if (navigator.share) { await navigator.share({ title: "RabaList", text }); }
      else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch {}
  };

  const sortedStores = result ? [...result.stores].sort((a, b) => a.price - b.price) : [];
  const articleCount = input.split(",").filter((s) => s.trim()).length;
    return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <span className="header-icon">🛒</span>
          <div>
            <div className="header-title">RabaList</div>
            <div className="header-sub">Compare, économise, décide vite</div>
          </div>
          <span className="header-badge">IA</span>
        </header>

        <main className="main">
          <div className="section-label">Ta liste de courses</div>
          <div className="input-area">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ex : lait, œufs, riz, pâtes, poulet, couches Pampers T4..." />
            <div className="input-footer">
              <span className="char-hint">{articleCount} article{articleCount !== 1 ? "s" : ""}</span>
              <button className="btn-analyze" onClick={analyze} disabled={loading || !input.trim()}>
                {loading ? "⏳ Analyse..." : "✨ Optimiser mon panier"}
              </button>
            </div>
          </div>

          <div className="section-label" style={{ marginBottom: 8 }}>Exemples rapides</div>
          <div className="examples-row">
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="example-chip" onClick={() => { setInput(ex); setResult(null); }}>
                {i === 0 ? "🥛 Panier semaine" : i === 1 ? "🧴 Hygiène & bébé" : "🥩 Panier cuisiné"}
              </button>
            ))}
          </div>

          {history.length > 0 && !result && (
            <div className="history-section">
              <div className="history-title">
                <span>🕐 Paniers récents</span>
                <button className="history-clear" onClick={() => { setHistory([]); saveHistory([]); }}>Effacer</button>
              </div>
              {history.map((entry) => (
                <div key={entry.id} className="history-item"
                  onClick={() => { setInput(entry.inputFull); setResult(entry.full); setError(null); }}>
                  <span className="history-label">{entry.label}…</span>
                  <span className="history-meta">
                    <span className="history-saving">-{entry.savings}€</span> · {entry.best} · {entry.date}
                  </span>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="loading-card">
              <div className="loading-basket">🛒</div>
              <div className="loading-text">Comparaison en cours...</div>
              <div className="loading-sub">Leclerc · Lidl · Aldi · Carrefour · Intermarché</div>
              <div className="progress-bar"><div className="progress-fill" /></div>
            </div>
          )}

          {error && <div className="error-box">⚠️ {error}</div>}

          {result && (
            <div ref={resultRef}>
              <div className="result-card">
                <div className="result-header">
                  <div className="result-header-top">
                    <span className="savings-amount">-{result.savings}€</span>
                    <span className="savings-label">d'économies possibles</span>
                  </div>
                  <div className="result-subtitle">
                    {result.original_total?.toFixed(2)}€ → {result.optimized_total?.toFixed(2)}€ avec substitutions
                  </div>
                </div>
                <div className="verdict-bar"><span>🏆</span><span>{result.verdict}</span></div>
                <div className="share-bar">
                  <button className={`btn-share${copied ? " copied" : ""}`} onClick={shareResult}>
                    {copied ? "✅ Copié !" : "📤 Partager mon résultat"}
                  </button>
                </div>
                <div className="result-body">
                  <div className="section-label" style={{ marginBottom: 10 }}>Prix par enseigne</div>
                  <div className="comparison-grid">
                    {sortedStores.map((store, i) => (
                      <div key={store.name} className={`store-card${i === 0 ? " best" : ""}`}>
                        {i === 0 && <span className="store-badge">LE MOINS CHER</span>}
                        <div className="store-name">{store.name}</div>
                        <div className="store-price">{store.price?.toFixed(2)}€</div>
                        {store.diff > 0 && <div className="store-diff">+{store.diff?.toFixed(2)}€</div>}
                      </div>
                    ))}
                  </div>
                  {result.analysis && (
                    <div className="ai-analysis">
                      <div className="ai-analysis-label">🤖 Analyse IA</div>
                      {result.analysis}
                    </div>
                  )}
                  <div className="items-section">
                    <div className="items-title"><span>📦</span> Produit par produit</div>
                    {result.items?.map((item, i) => (
                      <div className="item-row" key={i}>
                        <span className="item-name">{item.name}</span>
                        {item.swap
                          ? <><span className="item-swap">→ {item.swap}</span>{item.saving > 0 && <span className="item-saving">-{(item.saving/100).toFixed(2)}€</span>}</>
                          : <span className="item-ok">✓ Prix OK</span>}
                      </div>
                    ))}
                  </div>
                  {result.tip && (
                    <div className="tip-box"><span className="tip-icon">💡</span><span>{result.tip}</span></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
        <footer className="footer">RabaList · Estimations indicatives · Prix susceptibles de varier</footer>
      </div>
    </>
  );
    }
