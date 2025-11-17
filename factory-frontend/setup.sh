#!/bin/bash

# Factory Frontend Setup Script
# This script helps you set up the factory-frontend project

echo "🏭 Factory Frontend - Setup Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Setup environment file
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
else
    echo "ℹ️  .env.local already exists (skipping)"
fi

echo ""
echo "=================================="
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Login with one of these accounts:"
echo "   - admin/123456 (Full access)"
echo "   - manager/123456 (Manage access)"
echo "   - worker/123456 (View only)"
echo ""
echo "📚 For more information, see README.md"
echo "=================================="
