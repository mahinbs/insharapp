# 🚀 Supabase Quick Start Guide

## Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created (~2 minutes)
5. Go to Settings → API
6. Copy your:
   - Project URL
   - `anon` public key

## Step 2: Install & Setup (2 minutes)

```bash
npm install @supabase/supabase-js
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run Database Migration (5 minutes)

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase_migration.sql`
3. Copy all contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify all 11 tables are created ✅

## Step 4: Setup Storage (2 minutes)

1. Go to Storage in Supabase Dashboard
2. Create bucket: `images` (public)
3. Create bucket: `videos` (public)
4. Storage policies are already in migration script

## Step 5: Test Authentication (5 minutes)

Update `/app/auth/page.tsx`:

```typescript
import { supabase } from '@/lib/supabase'

// In your signup handler:
const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        user_type: userType, // 'influencer' or 'business'
        full_name: fullName
      }
    }
  })
  
  if (error) {
    console.error('Signup error:', error)
    return
  }
  
  // Redirect based on user type
  if (userType === 'influencer') {
    router.push('/influencer/dashboard')
  } else {
    router.push('/business/home')
  }
}
```

## Step 6: Replace Mock Data (Ongoing)

Start replacing localStorage and mock data:

1. **Offers**: Use `getOffers()` from `lib/supabase-examples.ts`
2. **Applications**: Use `applyToOffer()` from examples
3. **Collaborations**: Use `getInfluencerCollaborations()` from examples
4. **Messages**: Use `sendMessage()` from examples

## 📋 Checklist

- [ ] Supabase project created
- [ ] Environment variables added
- [ ] Database migration run successfully
- [ ] Storage buckets created
- [ ] Auth page updated
- [ ] Test signup/login works
- [ ] Start migrating data operations

## 🆘 Common Issues

**Issue**: "Missing Supabase environment variables"
- **Fix**: Make sure `.env.local` exists and has correct values

**Issue**: "Row Level Security policy violation"
- **Fix**: Check RLS policies in migration script are applied

**Issue**: "Profile not created on signup"
- **Fix**: Verify `handle_new_user()` trigger is created

## 📚 Next Steps

1. Read `SUPABASE_SUMMARY.md` for overview
2. Read `SUPABASE_INTEGRATION_GUIDE.md` for details
3. Use `lib/supabase-examples.ts` for code examples
4. Gradually replace all mock data with Supabase calls

## 🎯 Priority Order

1. ✅ Authentication (signup/login)
2. ✅ Offers (create/view)
3. ✅ Applications (apply/accept/decline)
4. ✅ Collaborations (check-in, content submission)
5. ✅ Messages (chat)
6. ✅ Notifications
7. ✅ File uploads (images/videos)

---

**You're ready to start!** Begin with authentication, then gradually migrate other features.



