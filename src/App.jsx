import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAF7; color: #1C1C1E; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: #1A6B3C; color: white; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 8px rgba(26,107,60,0.25); }
  .header-icon { font-size: 26px; }
  .header-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; }
  .header-sub { font-size: 12px; opacity: 0.8; }
  .header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .header-badge { background: #F5C518; color: #1C1C1E; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
  .total-saved { background: rgba(255,255,255,0.2); color: white; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
  .main { flex: 1; padding: 16px; max-width: 600px; margin: 0 auto; width: 100%; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #6B7280; margin-bottom: 10px; }
  .input-area { background: white; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 14px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .input-area textarea { width: 100%; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1C1C1E; background: transparent; resize: none; min-height: 90px; line-height: 1.6; }
  .input-area textarea::placeholder { color: #B0B8C1; }
  .input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #E5E7EB; }
  .char-hint { font-size: 12px; color: #6B7280; }
  .btn-analyze { background: #1A6B3C; color: white; border: none; border-radius: 10px; padding: 11px 22px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
  .btn-analyze:hover:not(:disabled) { background: #2D8A54; }
  .btn-analyze:disabled { background: #A0C4B0; cursor: not-allowed; }
  .btn-new { background: white; color: #1A6B3C; border: 1.5px solid #1A6B3C; border-radius: 10px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 16px; }
  .examples-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .example-chip { background: #E8F5EE; color: #1A6B3C; border: 1px solid #C3E6D0; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 500; cursor: pointer; }
  .history-section { margin-bottom: 20px; }
  .history-title { font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
  .history-clear { font-size: 11px; color: #E8442A; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .history-item { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
  .history-label { font-size: 13px; color: #1C1C1E; font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px; }
  .history-meta { font-size: 11px; color: #6B7280; white-space: nowrap; }
  .history-saving { font-size: 12px; font-weight: 700; color: #1A6B3C; }
  .result-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin-bottom: 16px; animation: fadeUp 0.35s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .result-header { background: #1A6B3C; padding: 18px 20px; color: white; }
  .result-header-top { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; }
  .savings-amount { font-family: 'Fraunces', serif; font-size: 44px; font-weight: 700; line-height: 1; color: #F5C518; }
  .savings-label { font-size: 14px; opacity: 0.9; font-weight: 500; }
  .result-subtitle { font-size: 13px; opacity: 0.75; }
  .verdict-bar { background: #FEF9E7; border-bottom: 1px solid #FAE9A0; padding: 12px 20px; font-size: 14px; font-weight: 600; color: #7A5F00; display: flex; align-items: center; gap: 8px; }
  .share-bar { padding: 12px 20px; border-bottom: 1px solid #E5E7EB; }
  .btn-share { width: 100%; background: #F3F4F6; border: none; border-radius: 8px; padding: 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; color: #1C1C1E; }
  .btn-share.copied { background: #E8F5EE; color: #1A6B3C; }
  .result-body { padding: 18px 20px; }
  .stores-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 18px; }
  .store-card { border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 10px 8px; text-align: center; position: relative; }
  .store-card.best { border-color: #1A6B3C; background: #E8F5EE; }
  .store-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #1A6B3C; color: white; font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 10px; white-space: nowrap; }
  .store-name { font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3px; margin: 4px 0 2px; }
  .store-price { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: #1C1C1E; }
  .store-card.best .store-price { color: #1A6B3C; }
  .store-diff { font-size: 10px; color: #6B7280; margin-top: 1px; }
  .items-section { margin-bottom: 18px; }
  .items-title { font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .item-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
  .item-row:last-child { border-bottom: none; }
  .item-name { color: #1C1C1E; flex: 1; }
  .item-swap { font-size: 11px; color: #2D8A54; font-weight: 500; background: #E8F5EE; padding: 2px 7px; border-radius: 8px; margin: 0 6px; max-width: 150px; text-align: right; }
  .item-saving { font-size: 12px; font-weight: 600; color: #1A6B3C; white-space: nowrap; }
  .item-ok { font-size: 12px; color: #6B7280; }
  .tip-box { background: #FEF9E7; border: 1px solid #F0D875; border-radius: 12px; padding: 12px 14px; font-size: 13px; color: #6B5000; line-height: 1.5; display: flex; gap: 8px; margin-bottom: 14px; }
  .tip-icon { font-size: 16px; flex-shrink: 0; }
  .confidence-box { background: #F8F9FA; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 8px; }
  .confidence-bar-bg { flex: 1; height: 4px; background: #E5E7EB; border-radius: 4px; overflow: hidden; }
  .confidence-bar-fill { height: 100%; background: #1A6B3C; border-radius: 4px; }
  .ai-analysis { background: #F0F4FF; border: 1px solid #D1DAFF; border-radius: 12px; padding: 14px; margin-bottom: 18px; font-size: 14px; line-height: 1.6; color: #2D3A8C; }
  .ai-analysis-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #7B89D4; margin-bottom: 6px; text-transform: uppercase; }
  .loading-card { background: white; border-radius: 16px; padding: 32px 20px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin-bottom: 16px; }
  .loading-basket { font-size: 40px; margin-bottom: 12px; animation: bounce 0.7s ease-in-out infinite alternate; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
  .loading-text { font-size: 15px; color: #6B7280; font-weight: 500; }
  .loading-sub { font-size: 12px; color: #B0B8C1; margin-top: 4px; }
  .progress-bar { width: 180px; height: 4px; background: #E5E7EB; border-radius: 4px; margin: 14px auto 0; overflow: hidden; }
  .progress-fill { height: 100%; background: #1A6B3C; border-radius: 4px; animation: progress 2s ease-in-out infinite; width: 60%; }
  @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
  .error-box { background: #FDEEEC; border: 1px solid #F5BDB5; border-radius: 12px; padding: 14px; font-size: 14px; color: #E8442A; margin-bottom: 16px; }
  .footer { text-align: center; padding: 16px; font-size: 11px; color: #C0C8D0; }
`;
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
  "confidence": <entier 60-95 représentant fiabilité estimation en pourcent>,
  "stores": [
    {"name": "Leclerc", "price": <décimal>, "diff": <décimal, 0 si moins cher>},
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
Prix réalistes France 2024-2025. Aldi et Lidl généralement moins chers que Carrefour et Leclerc.`;

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
  const [totalSaved, setTotalSaved] = useState(() => {
    try { return parseInt(sessionStorage.getItem("rabaList_total") || "0"); }
    catch { return 0; }
  });
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
      const newTotal = totalSaved + (parsed.savings || 0);
      setTotalSaved(newTotal);
      try { sessionStorage.setItem("rabaList_total", String(newTotal)); } catch {}
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
    const text = `🛒 RabaList\n\n🏆 ${result.best_store} est le moins cher\n💰 Économies : -${result.savings}€\n${result.original_total?.toFixed(2)}€ → ${result.optimized_total?.toFixed(2)}€\n\n${result.verdict}\n\nEssaie sur raba-list.vercel.app`;
    try {
      if (navigator.share) { await navigator.share({ title: "RabaList", text }); }
      else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch {}
  };

  const reset = () => { setResult(null); setInput(""); setError(null); };
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
          <div className="header-right">
            {totalSaved > 0 && <span className="total-saved">-{totalSaved}€ économisés</span>}
            <span className="header-badge">IA</span>
          </div>
        </header>

        <main className="main">
          {!result ? (
            <>
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
              {history.length > 0 && (
                <div className="history-section">
                  <div className="history-title">
                    <span>🕐 Paniers récents</span>
                    <button className="history-clear" onClick={() => { setHistory([]); saveHistory([]); }}>Effacer</button>
                  </div>
                  {history.map((entry) => (
                    <div key={entry.id} className="history-item"
                      onClick={() => { setInput(entry.inputFull); setResult(entry.full); }}>
                      <span className="history-label">{entry.label}…</span>
                      <span className="history-meta">
                        <span className="history-saving">-{entry.savings}€</span> · {entry.best} · {entry.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <button className="btn-new" onClick={reset}>← Nouvelle liste</button>
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
                  <div className="stores-grid">
                    {sortedStores.map((store, i) => (
                      <div key={store.name} className={`store-card${i === 0 ? " best" : ""}`}>
                        {i === 0 && <span className="store-badge">MOINS CHER</span>}
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
                  {result.confidence && (
                    <div className="confidence-box">
                      <span>Fiabilité IA</span>
                      <div className="confidence-bar-bg">
                        <div className="confidence-bar-fill" style={{ width: `${result.confidence}%` }} />
                      </div>
                      <span style={{ fontWeight: 700, color: "#1A6B3C" }}>{result.confidence}%</span>
                    </div>
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
