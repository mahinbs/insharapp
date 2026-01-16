#!/bin/bash

# Script to fix Next.js build and port issues

echo "🔧 Fixing Next.js build issues..."

# Kill any process on port 3000
echo "1. Checking for processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Found process on port 3000, killing it..."
    lsof -ti:3000 | xargs kill -9
    sleep 1
else
    echo "   ✓ Port 3000 is free"
fi

# Clear Next.js cache
echo "2. Clearing .next directory..."
rm -rf .next
echo "   ✓ Cleared .next directory"

# Clear node_modules/.cache if it exists
if [ -d "node_modules/.cache" ]; then
    echo "3. Clearing node_modules cache..."
    rm -rf node_modules/.cache
    echo "   ✓ Cleared node_modules cache"
fi

echo ""
echo "✅ Cleanup complete! You can now run:"
echo "   npm run build  (for production build)"
echo "   npm run dev    (for development server)"

