#!/bin/bash
set -e

echo "==> Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "Node not found. Installing via nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  nvm install --lts
fi

echo "==> Node $(node -v) / npm $(npm -v)"

echo "==> Creating React app..."
cd ~/house-price-project
npm create vite@latest frontend -- --template react

echo "==> Installing dependencies..."
cd frontend
npm install

echo "==> Creating folder structure..."
mkdir -p src/pages src/components

touch src/api.js \
      src/pages/EDAPage.jsx \
      src/pages/PredictPage.jsx \
      src/components/MetricCard.jsx \
      src/components/BarChart.jsx \
      src/components/CityTable.jsx

echo "VITE_API_URL=http://localhost:8000" > .env

echo ""
echo "✅ Done! Now run:"
echo "   cd ~/house-price-project/frontend && npm run dev"
