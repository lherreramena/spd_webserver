#!/bin/bash

echo "📦 Instalando dependencias..."
npm install

echo "🔄 Reiniciando PM2..."
pm2 restart sportdisplay || pm2 start index.js --name sportdisplay

echo "✅ Despliegue completo en puerto $PORT"
