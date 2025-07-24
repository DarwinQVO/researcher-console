#!/bin/bash

echo "🚂 Railway Deployment Script"
echo "=========================="

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "📦 Install with: brew install railway"
    echo "   or: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

# Initialize project if not linked
if [ ! -f ".railway" ]; then
    echo "🚀 Initializing new Railway project..."
    railway init
fi

# Show current project
echo "📍 Current project:"
railway status

# Deploy
echo "🚀 Deploying to Railway..."
railway up

# Get URL
echo "✅ Deployment complete!"
echo "🌐 Your app URL:"
railway open

echo ""
echo "📊 View logs with: railway logs -f"
echo "🔧 Set variables with: railway variables set KEY=value"