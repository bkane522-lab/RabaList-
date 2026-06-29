# 🛒 RabaList

**Compare ton panier alimentaire et économise avec l'IA**

RabaList analyse ta liste de courses et compare les prix chez Leclerc, Lidl, Carrefour et Intermarché. Il propose des substitutions intelligentes pour réduire ta facture.

## Stack
- React + Vite
- PWA (installable sur mobile)
- Claude API (Anthropic)

## Lancer en local

```bash
npm install
cp .env.example .env
# Ajouter ta clé Anthropic dans .env
npm run dev
```

## Déployer sur Vercel

1. Push sur GitHub
2. Importer le repo sur Vercel
3. Ajouter `VITE_ANTHROPIC_API_KEY` dans les variables d'environnement
4. Deploy ✅

## Auteur
DJ Kizomba Galactic × bkane522-lab
