# GenBI Business Dashboard

A professional, eye-catching React dashboard that lets you upload your product CSV and get instant business analysis.

## Features
- 📊 8 mean/median and categorical distribution charts auto-generated
- 💡 5 business insights (mean/median-based)
- 🧠 5 actionable business strategies
- 💪 Strengths & Weaknesses analysis
- Modern, mobile-friendly, deployable to Vercel

## How To Use

1. **Install Dependencies**
```bash
npm install
```

2. **Run Locally**
```bash
npm start
```
Visit `http://localhost:3000` in your browser.

3. **Deploy to Vercel**
   - Either push this folder to a GitHub repo and connect Vercel,
   - **OR** [Import Project](https://vercel.com/new) from this folder (drag and drop or use cli)

## CSV Format
- Upload a CSV (no size limit for most browsers)
- **Required columns** (case insensitive):
    - product_id, product_n, category, discounte, actual_pri, discount_r, rating, rating_cou, about_pro, user_id, user_name, review_id, review_tit, review_co, img_link, product_link
- The dashboard is robust to missing/extra columns; analytics use only the known ones.

## Project Structure
- `/src/App.tsx` — Dashboard app entry, CSV upload and routing
- `/src/components/ChartsGrid.tsx` — Chart grid (recharts)
- `/src/components/InsightsSection.tsx` — Summarized business insights
- `/src/components/StrengthWeakness.tsx` — Strengths & weaknesses
- `/src/components/StrategiesSection.tsx` — Business strategies

## License
MIT
