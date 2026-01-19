'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import logo_colorful from "@/assetes/Logo3 (1).png";
import { signUpInfluencer, signUpBusiness, signIn, signInWithOAuth } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/supabase-examples';
import { useAuth } from '@/contexts/AuthContext';

function AuthScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [userType, setUserType] = useState<'influencer' | 'business' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Determine redirect based on user type
      const checkUserType = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile?.user_type === 'influencer') {
          router.push('/influencer/dashboard');
        } else if (profile?.user_type === 'business') {
          router.push('/business/home');
        } else {
          router.push('/influencer/dashboard');
        }
      };
      checkUserType();
    }
  }, [user, authLoading, router]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    bio: '',
    username: '',
    avatar: null as File | null,
    avatarPreview: '',
    followersCount: '',
    engagementRate: '',
    niche: '',
    instagramHandle: '',
    tiktokHandle: '',
    websiteUrl: '',
    // Business fields
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    businessLocation: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    businessInstagram: '',
    businessTiktok: '',
    businessLogo: null as File | null,
    businessLogoPreview: ''
  });

  // Check URL params to set login mode and show verification message
  useEffect(() => {
    const loginParam = searchParams.get('login');
    const verifyParam = searchParams.get('verify');
    
    if (loginParam === 'true') {
      setIsLogin(true);
    }
    
    if (verifyParam === 'true') {
      setIsLogin(true);
      // Clear any previous errors and set verification message
      setError(null);
      setTimeout(() => {
        setInfoMessage('Account created successfully! Please check your email to verify your account, then sign in below.');
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="h-full w-full flex flex-col justify-center py-4">
            <img 
              src={logo_colorful.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-xs">Choose your path to collaboration</span>
          </div>

      {/* User type selection */}
      {!userType && (
        <div className="flex-1 px-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            I am a...
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setUserType('influencer')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <i className="ri-user-star-line text-white text-2xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">Influencer</h3>
                  <p className="text-gray-600">Collaborate with brands and get amazing services</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setUserType('business')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="ri-building-line text-white text-2xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">Business Owner</h3>
                  <p className="text-gray-600">Find influencers to promote your business</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Auth form */}
      {userType && (
        <div className="flex-1 px-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue' : 'Join the collaboration revolution'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            {infoMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 text-sm">
                {infoMessage}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />
                </>
              )}

              {!isLogin && userType === 'influencer' && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  <textarea
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800 resize-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Followers Count (e.g., 10K)"
                      value={formData.followersCount}
                      onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="Engagement Rate (e.g., 4.2%)"
                      value={formData.engagementRate}
                      onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Niche (e.g., Fashion, Food, Lifestyle)"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Instagram Handle"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="TikTok Handle"
                      value={formData.tiktokHandle}
                      onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="Website URL (optional)"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.avatarPreview && (
                        <img
                          src={formData.avatarPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, avatar: file });
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, avatarPreview: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center text-sm text-gray-600 hover:border-pink-400 transition-colors">
                          {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {!isLogin && userType === 'business' && (
                <>
                  <input
                    type="text"
                    placeholder="Business Name *"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                  />
                  
                  <select
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                  >
                    <option value="">Select Category *</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Beauty & Spa">Beauty & Spa</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Travel">Travel</option>
                    <option value="Technology">Technology</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>

                  <textarea
                    placeholder="Business Description"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800 resize-none"
                  />

                  <input
                    type="text"
                    placeholder="Business Location"
                    value={formData.businessLocation}
                    onChange={(e) => setFormData({ ...formData, businessLocation: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  <input
                    type="text"
                    placeholder="Business Address"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Business Phone"
                      value={formData.businessPhone}
                      onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                    <input
                      type="email"
                      placeholder="Business Email"
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Instagram Handle"
                      value={formData.businessInstagram}
                      onChange={(e) => setFormData({ ...formData, businessInstagram: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="TikTok Handle"
                      value={formData.businessTiktok}
                      onChange={(e) => setFormData({ ...formData, businessTiktok: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="Business Website"
                    value={formData.businessWebsite}
                    onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />

                  {/* Business Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.businessLogoPreview && (
                        <img
                          src={formData.businessLogoPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, businessLogo: file });
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, businessLogoPreview: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center text-sm text-gray-600 hover:border-pink-400 transition-colors">
                          {formData.businessLogo ? 'Change Logo' : 'Upload Logo'}
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}
              
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                required
                minLength={6}
              />

              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleOAuth('instagram')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <i className="ri-instagram-line text-xl"></i>
                <span>Continue with Instagram</span>
              </button>
              
              <button
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <i className="ri-google-line text-xl"></i>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <button
              onClick={() => {
                setUserType(null);
                setError(null);
                setFormData({
                  fullName: '',
                  email: '',
                  password: '',
                  phone: '',
                  location: '',
                  bio: '',
                  username: '',
                  avatar: null,
                  avatarPreview: '',
                  followersCount: '',
                  engagementRate: '',
                  niche: '',
                  instagramHandle: '',
                  tiktokHandle: '',
                  websiteUrl: '',
                  businessName: '',
                  businessCategory: '',
                  businessDescription: '',
                  businessLocation: '',
                  businessAddress: '',
                  businessPhone: '',
                  businessEmail: '',
                  businessWebsite: '',
                  businessInstagram: '',
                  businessTiktok: '',
                  businessLogo: null,
                  businessLogoPreview: ''
                });
              }}
              className="w-full mt-4 text-gray-500 font-medium"
            >
              ← Back to user type selection
            </button>
          </div>
        </div>
      )}
    </div>
  );

  async function handleAuth() {
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Clear any stale sessions first
        await supabase.auth.signOut();

        // Sign in
        const { data, error } = await signIn({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          setError(error.message || 'Failed to sign in');
          setLoading(false);
          return;
        }

        if (!data || !data.session) {
          setError('No session returned after login');
          setLoading(false);
          return;
        }

        console.log('Login successful, session:', data.session.user.id);

        // Wait for auth state to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.session.user.id)
          .single();

        // Force router refresh
        router.refresh();
        
        if (profile?.user_type === 'influencer') {
          router.push('/influencer/dashboard');
        } else if (profile?.user_type === 'business') {
          router.push('/business/home');
        } else {
          router.push('/influencer/dashboard');
        }
      } else {
        // Sign up
        if (userType === 'influencer') {
          if (!formData.fullName || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
          }

          // Sign up first to get authenticated user
          const { data, error } = await signUpInfluencer({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            username: formData.username
          });

          if (error) {
            setError(error.message || 'Failed to create account');
            setLoading(false);
            return;
          }

          if (!data || !data.user) {
            setError('Failed to create account. Please try again.');
            setLoading(false);
            return;
          }

          // Upload avatar if provided (only if we have a session)
          let avatarUrl = '';
          if (formData.avatar && data.user && data.session) {
            try {
              const uploadResult = await uploadImage(formData.avatar, 'images');
              avatarUrl = uploadResult.publicUrl;
            } catch (uploadError) {
              console.error('Avatar upload error:', uploadError);
              // Continue without avatar if upload fails
            }
          }

          // Update profile with additional details
          // Wait a bit for profile trigger to create profile
          let retries = 0;
          let profileExists = false;
          while (retries < 10 && !profileExists) {
            const { data: profileCheck } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .single();
            
            if (profileCheck) {
              profileExists = true;
            } else {
              await new Promise(resolve => setTimeout(resolve, 200));
              retries++;
            }
          }

          const followersCount = formData.followersCount 
            ? parseInt(formData.followersCount.replace(/[^0-9]/g, '')) || 0
            : 0;
          const engagementRate = formData.engagementRate
            ? parseFloat(formData.engagementRate.replace('%', '')) || 0
            : 0;

          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              username: formData.username,
              full_name: formData.fullName,
              phone: formData.phone,
              avatar_url: avatarUrl,
              bio: formData.bio,
              location: formData.location,
              followers_count: followersCount,
              engagement_rate: engagementRate,
              niche: formData.niche,
              instagram_handle: formData.instagramHandle,
              tiktok_handle: formData.tiktokHandle,
              website_url: formData.websiteUrl
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
            // Try to insert if update failed
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: formData.email,
                user_type: 'influencer',
                username: formData.username,
                full_name: formData.fullName,
                phone: formData.phone,
                avatar_url: avatarUrl,
                bio: formData.bio,
                location: formData.location,
                followers_count: followersCount,
                engagement_rate: engagementRate,
                niche: formData.niche,
                instagram_handle: formData.instagramHandle,
                tiktok_handle: formData.tiktokHandle,
                website_url: formData.websiteUrl
              });
          }

          // If email confirmation is required, redirect to login page
          if (data.user && !data.session) {
            router.push('/auth?verify=true&login=true');
            setLoading(false);
            return;
          }

          router.push('/influencer/dashboard');
        } else if (userType === 'business') {
          if (!formData.businessName || !formData.businessCategory || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
          }

          // Sign up first to get authenticated user
          const { data, error } = await signUpBusiness({
            email: formData.email,
            password: formData.password,
            businessName: formData.businessName,
            businessCategory: formData.businessCategory
          });

          if (error) {
            setError(error.message || 'Failed to create account');
            setLoading(false);
            return;
          }

          if (!data || !data.user) {
            setError('Failed to create account. Please try again.');
            setLoading(false);
            return;
          }

          // Upload business logo if provided (only if we have a session)
          let logoUrl = '';
          if (formData.businessLogo && data.user && data.session) {
            try {
              const uploadResult = await uploadImage(formData.businessLogo, 'images');
              logoUrl = uploadResult.publicUrl;
            } catch (uploadError) {
              console.error('Logo upload error:', uploadError);
              // Continue without logo if upload fails
            }
          }

          // Wait for profile to be created by trigger
          let retries = 0;
          let profileExists = false;
          while (retries < 10 && !profileExists) {
            const { data: profileCheck } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .single();
            
            if (profileCheck) {
              profileExists = true;
            } else {
              await new Promise(resolve => setTimeout(resolve, 200));
              retries++;
            }
          }

          // Update profile with additional details including logo
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              business_name: formData.businessName,
              business_category: formData.businessCategory,
              business_description: formData.businessDescription || null,
              business_location: formData.businessLocation || null,
              business_address: formData.businessAddress || null,
              business_phone: formData.businessPhone || null,
              business_email: formData.businessEmail || null,
              business_website: formData.businessWebsite || null,
              business_instagram: formData.businessInstagram || null,
              business_tiktok: formData.businessTiktok || null,
              business_logo: logoUrl || null,
              phone: formData.phone || null,
              full_name: formData.fullName || null
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
            // Try to insert if update failed (profile might not exist)
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: formData.email,
                user_type: 'business',
                business_name: formData.businessName,
                business_category: formData.businessCategory,
                business_description: formData.businessDescription || null,
                business_location: formData.businessLocation || null,
                business_address: formData.businessAddress || null,
                business_phone: formData.businessPhone || null,
                business_email: formData.businessEmail || null,
                business_website: formData.businessWebsite || null,
                business_instagram: formData.businessInstagram || null,
                business_tiktok: formData.businessTiktok || null,
                business_logo: logoUrl || null,
                phone: formData.phone || null,
                full_name: formData.fullName || null
              });
          }

          // If email confirmation is required, redirect to login page
          if (data.user && !data.session) {
            router.push('/auth?verify=true&login=true');
            setLoading(false);
            return;
          }

          router.push('/business/home');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: 'instagram' | 'google') {
    setLoading(true);
    setError(null);

    try {
      // Instagram is not a valid Supabase provider, use Google instead
      const validProvider = provider === 'instagram' ? 'google' : provider;
      const { error } = await signInWithOAuth(validProvider as 'google' | 'facebook' | 'github' | 'twitter' | 'discord' | 'azure' | 'linkedin' | 'bitbucket' | 'apple' | 'twitch' | 'spotify' | 'slack' | 'notion' | 'twilio' | 'sendgrid' | 'workos' | 'zoom');
      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
        setLoading(false);
      }
      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }
}

export default function AuthScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <AuthScreenContent />
    </Suspense>
  );
}