# 🧪 Testing Guide - Supabase Integration

## Prerequisites

1. ✅ Supabase project created
2. ✅ Database migration run successfully
3. ✅ Environment variables set in `.env.local`
4. ✅ Dependencies installed (`@supabase/supabase-js`)

---

## 🧪 Test Scenarios

### Test 1: Influencer Signup ✅

**Steps:**
1. Go to `/auth`
2. Click "Influencer"
3. Fill form:
   - Full Name: "Test Influencer"
   - Username: "testinfluencer" (optional)
   - Email: "influencer@test.com"
   - Password: "password123"
4. Click "Create Account"

**Expected:**
- ✅ Account created
- ✅ Redirected to `/influencer/dashboard`
- ✅ Profile created in `profiles` table with `user_type='influencer'`

**Verify in Supabase:**
```sql
SELECT * FROM profiles WHERE email = 'influencer@test.com';
```

---

### Test 2: Influencer Login ✅

**Steps:**
1. Go to `/auth`
2. Click "Influencer"
3. Enter credentials:
   - Email: "influencer@test.com"
   - Password: "password123"
4. Click "Sign In"

**Expected:**
- ✅ Login successful
- ✅ Redirected to `/influencer/dashboard`
- ✅ Session created

---

### Test 3: View Offers on Dashboard ✅

**Prerequisites:**
- At least one offer in database with `status='active'`

**Steps:**
1. Login as influencer
2. Go to `/influencer/dashboard`
3. Wait for offers to load

**Expected:**
- ✅ Loading spinner appears initially
- ✅ Offers displayed in sections
- ✅ Images load correctly
- ✅ Business names and locations shown

**Verify:**
- Check browser console for errors
- Verify offers are from database

---

### Test 4: Search Offers ✅

**Steps:**
1. On dashboard, type in search bar
2. Try searching for:
   - Business name
   - Category
   - Location

**Expected:**
- ✅ Offers filter in real-time
- ✅ Search works correctly

---

### Test 5: View Offer Details ✅

**Steps:**
1. Click on any offer from dashboard
2. Should navigate to `/offer-details/[id]`

**Expected:**
- ✅ Offer details load
- ✅ Business info displayed
- ✅ Requirements shown
- ✅ Images displayed
- ✅ "Book Service" button visible

**Verify in Supabase:**
```sql
SELECT * FROM offers WHERE id = '[offer-id]';
```

---

### Test 6: Apply to Offer ✅

**Steps:**
1. Go to offer details page
2. Click "Book Service"
3. Fill form:
   - Number of people: 2
   - Select month
   - Select date
   - Select time
4. Click "Continue"
5. Accept all conditions
6. Click "Accept & Continue"

**Expected:**
- ✅ Application created
- ✅ Status shows "Booking Pending..."
- ✅ Application saved in database

**Verify in Supabase:**
```sql
SELECT * FROM applications WHERE offer_id = '[offer-id]';
```

---

### Test 7: View Collaborations ✅

**Steps:**
1. Go to `/collaborations`
2. View all sections

**Expected:**
- ✅ Pending applications shown
- ✅ Approved collaborations shown
- ✅ Completed collaborations shown
- ✅ Expired collaborations shown

**Verify:**
- Check that data comes from database
- Status badges correct

---

### Test 8: Submit Content Proof ✅

**Prerequisites:**
- Have an accepted collaboration

**Steps:**
1. Go to offer details page for accepted collaboration
2. Scroll to "Content Delivery Hub"
3. Upload video
4. Add social media post URL
5. Check boxes for tagging and collaboration request
6. Click "Submit content proof"

**Expected:**
- ✅ Content saved to database
- ✅ Success message shown
- ✅ Collaboration updated

**Verify in Supabase:**
```sql
SELECT * FROM collaborations WHERE id = '[collab-id]';
-- Check content_video_url, social_media_post_url, etc.
```

---

### Test 9: QR Code Check-in ✅

**Prerequisites:**
- Have an approved collaboration
- QR code exists for business

**Steps:**
1. Go to `/collaborations`
2. Find approved collaboration
3. Click "Scan QR"
4. Scan QR code

**Expected:**
- ✅ Check-in recorded
- ✅ On-time status calculated
- ✅ Collaboration updated

**Verify in Supabase:**
```sql
SELECT checked_in_at, is_on_time FROM collaborations WHERE id = '[collab-id]';
```

---

### Test 10: OAuth Authentication ✅

**Steps:**
1. Go to `/auth`
2. Select "Influencer"
3. Click "Continue with Google" or "Continue with Instagram"
4. Complete OAuth flow

**Expected:**
- ✅ Redirects to OAuth provider
- ✅ After authorization, redirects back
- ✅ Session created
- ✅ Profile created/updated

**Note:** Requires OAuth providers configured in Supabase Dashboard

---

## 🐛 Common Issues & Solutions

### Issue: "Not authenticated" error
**Cause:** User not logged in or session expired
**Solution:** 
- Check if user is logged in
- Try logging out and back in
- Check browser console for errors

### Issue: No offers showing
**Cause:** No active offers in database
**Solution:**
- Create test offers in Supabase:
```sql
INSERT INTO offers (business_id, title, description, category, location, status, requirements)
VALUES (
  '[business-profile-id]',
  'Test Offer',
  'Test description',
  'Restaurant',
  'Paris',
  'active',
  ARRAY['Requirement 1', 'Requirement 2']
);
```

### Issue: Application not submitting
**Cause:** RLS policy blocking insert
**Solution:**
- Check RLS policies in Supabase
- Verify user is authenticated
- Check browser console for specific error

### Issue: OAuth redirect not working
**Cause:** Callback URL not configured
**Solution:**
- Add redirect URL in Supabase Dashboard → Authentication → URL Configuration
- Add: `http://localhost:3000/auth/callback` (for dev)

---

## ✅ Verification Checklist

After integration, verify:

- [ ] Can sign up as influencer
- [ ] Can login
- [ ] Dashboard shows offers
- [ ] Can view offer details
- [ ] Can apply to offer
- [ ] Application appears in database
- [ ] Collaborations page works
- [ ] Can submit content proof
- [ ] QR code scanning works (if implemented)
- [ ] OAuth works (if configured)
- [ ] No console errors
- [ ] Loading states work
- [ ] Error messages display correctly

---

## 📊 Database Verification Queries

Run these in Supabase SQL Editor to verify data:

```sql
-- Check profiles
SELECT id, email, user_type, full_name, username FROM profiles;

-- Check offers
SELECT id, title, status, business_id FROM offers WHERE status = 'active';

-- Check applications
SELECT id, offer_id, influencer_id, status FROM applications;

-- Check collaborations
SELECT id, offer_id, influencer_id, business_id, status FROM collaborations;

-- Check if user is authenticated (run in app, not SQL)
-- Use browser DevTools → Application → Local Storage → supabase.auth.token
```

---

## 🎯 Success Criteria

✅ All pages load without errors
✅ Data is fetched from Supabase
✅ Forms submit successfully
✅ Data persists in database
✅ Authentication works
✅ User can navigate between pages
✅ Loading states show
✅ Error messages display

---

## 🚀 Ready for Production

Once all tests pass:
1. Test with real data
2. Add error boundaries
3. Add loading skeletons
4. Optimize queries
5. Add caching if needed
6. Set up monitoring

---

**All influencer-side pages are now fully integrated with Supabase!** 🎉



