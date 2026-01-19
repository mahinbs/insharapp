# Check Supabase Configuration

## Issue
Authentication check hangs at `supabase.auth.getUser()` call.

## Possible Causes

### 1. Missing Environment Variables
Check if `.env.local` file exists with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Verify Environment Variables

**In terminal:**
```bash
cd /Users/mdsahil/Downloads/insharapp
cat .env.local
```

**Or check if they're loaded:**
```bash
# Start dev server and check
npm run dev
# Open browser console and type:
# window.location.href
# Should be running
```

### 3. Create `.env.local` if missing

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - `anon` public key

5. Create `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

6. Restart dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 4. Check Browser Console

Open browser console (F12) and check for errors:
- "Missing Supabase environment variables"
- Network errors
- CORS errors

### 5. Verify Supabase Client

In browser console, type:
```javascript
// Check if supabase is defined
console.log('Supabase:', window.supabase)

// Or import and check
import { supabase } from '@/lib/supabase'
console.log('Supabase URL:', supabase.supabaseUrl)
```

### 6. Test Authentication Manually

In browser console:
```javascript
const { data, error } = await supabase.auth.getUser()
console.log('User:', data.user)
console.log('Error:', error)
```

If this hangs, the issue is with Supabase configuration, not the code.

## Quick Fix Steps

1. **Check if `.env.local` exists:**
   ```bash
   ls -la /Users/mdsahil/Downloads/insharapp/.env.local
   ```

2. **If it doesn't exist, create it:**
   ```bash
   cd /Users/mdsahil/Downloads/insharapp
   touch .env.local
   nano .env.local
   ```

3. **Add your Supabase credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Save and exit** (Ctrl+X, then Y, then Enter)

5. **Restart the dev server:**
   ```bash
   npm run dev
   ```

6. **Try creating an offer again**

## Expected Console Output

After fixing, you should see:
```
Checking authentication...
Supabase client available: true
Calling supabase.auth.getUser()...
Waiting for auth result...
Auth result received: {...}
Auth data: { user: {...} }
Auth error: null
Authentication check passed, user ID: abc-123-def
```

## If Still Hanging

1. Check browser Network tab (F12 → Network)
2. Look for Supabase API calls
3. Check if they're failing (red) or pending (yellow)
4. If pending, it's a network/configuration issue
5. If failing, check the error response

## Need Help?

Share:
1. Browser console logs
2. Network tab screenshot
3. `.env.local` file (without sensitive keys)
4. Any error messages

