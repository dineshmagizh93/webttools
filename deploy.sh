#!/bin/bash

# 🚀 Web Tools Vercel Deployment Script
# This script helps automate the deployment process

echo "🚀 Starting Web Tools deployment process..."

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Initialize Git repository (if not already done)
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Web Tools multi-tool application $(date)"

echo ""
echo "🎉 Local preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo "3. Go to https://vercel.com and import your repository"
echo "4. Configure environment variables in Vercel dashboard"
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT_CHECKLIST.md for detailed instructions"
echo "📖 See ADSENSE_SETUP.md for AdSense configuration"
