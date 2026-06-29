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
  .header-badge { margin-left: auto; background: #F5C518; color: #1C1C1E; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
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
  .examples-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .example-chip { background: #E8F5EE; color: #1A6B3C; border: 1px solid #C3E6D0; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 500; cursor: pointer; }
  .result-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin-bottom: 16px; animation: fadeUp 0.35s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .result-header { background: #1A6B3C; padding: 18px 20px; color: white; }
  .result-header-top { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; }
  .savings-amount { font-family: 'Fraunces', serif; font-size: 44px; font-weight: 700; line-height: 1; color: #F5C518; }
  .savings-label { font-size: 14px; opacity: 0.9; font-weight: 500; }
  .result-subtitle { font-size: 13px; opacity: 0.75; }
  .verdict-bar { background: #FEF9E7; border-bottom: 1px solid #FAE9A0; padding: 12px 20px; font-size: 14px; font-weight: 600; color: #7A5F00; display: flex; align-items: center; gap: 8px; }
  .result-body { padding: 18px 20px; }
  .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .store-card { border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 12px; text-align: center; position: relative; }
  .store-card.best { border-color: #1A6B3C; background: #E8F5EE; }
  .store-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #1A6B3C; color: white; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 10px; white-space: nowrap; }
  .store-name { font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 4px 0; }
  .store-price { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: #1C1C1E; }
  .store-card.best .store-price { color: #1A6B3C; }
  .store-diff { font-size: 11px; color: #6B7280; margin-top: 2px; }
  .items-section { margin-bottom: 18px; }
  .items-title { font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .item-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
  .item-row:last-child { border-bottom: none; }
  .item-name { color: #1C1C1E; flex: 1; }
  .item-swap { font-size: 12px; color: #2D8A54; font-weight: 500; background: #E8F5EE; padding: 2px 8px; border-radius: 8px; margin: 0 8px; max-width: 160px; text-align: right; }
  .item-saving { font-size: 12px; font-weight: 600; color: #1A6B3C; white-space: nowrap; }
  .item-ok { font-size: 12px; color: #6B7280; }
  .tip-box { background: #FEF9E7; border: 1px solid #F0D875; border-radius: 12px; padding: 12px 14px; font-size: 13px; color: #6B5000; line-height: 1.5; display: flex; gap: 8px; }
  .tip-icon { font-size: 16px; flex-shrink: 0; }
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
`;const EXAMPLES = [
  "lait, œufs, riz, pâtes, huile, poulet, pommes, yaourts, pain de mie, beurre",
  "couches Pampers T4, lessive Ariel, savon, dentifrice, shampooing",
  "steaks hachés, carottes, courgettes, tomates, fromage râpé, crème fraîche, farine",
];

const SYSTEM_PROMPT = `Tu es RabaList, un assistant expert en courses alimentaires en France.
L'utilisateur te donne une liste de courses. Tu dois :
1. Estimer le coût total du panier dans 4 enseignes françaises : Leclerc, Lidl, Carrefour, Intermarché
2. Proposer des substitutions intelligentes pour économiser
3. Indiquer le meilleur magasin pour ce panier

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "savings": <entier - économie totale en euros>,
  "original_total": <décimal>,
  "optimized_total": <décimal>,
  "verdict": "<phrase courte sur le meilleur magasin>",
  "best_store": "<nom enseigne la moins chère>",
  "stores": [
    {"name": "Leclerc", "price": <décimal>, "diff": <décimal>},
    {"name": "Lidl", "price": <décimal>, "diff": <décimal>},
    {"name": "Carrefour", "price": <décimal>, "diff": <décimal>},
    {"name": "Intermarché", "price": <décimal>, "diff": <décimal>}
  ],
  "items": [
    {"name": "<produit>", "swap": "<substitution ou null>", "saving": <centimes>}
  ],
  "tip": "<conseil pratique>",
  "analysis": "<2-3 phrases d'analyse>"
}
Utilise des prix réalistes français 2024-2025.`;

export default function RabaList() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1500,
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Ma liste de courses : ${input}` },
          ],
        }),
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (err) {
      setError("Impossible d'analyser ton panier. Réessaie.");
    } finally {
      setLoading(false);
    }
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
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex : lait, œufs, riz, pâtes, poulet, couches Pampers T4..."
            />
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

          {loading && (
            <div className="loading-card">
              <div className="loading-basket">🛒</div>
              <div className="loading-text">Comparaison en cours...</div>
              <div className="loading-sub">Leclerc · Lidl · Carrefour · Intermarché</div>
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
                          : <span className="item-ok">✓ Prix OK</span>
                        }
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
        <footer className="footer">RabaList · Estimations indicatives</footer>
      </div>
    </>
  );
}
