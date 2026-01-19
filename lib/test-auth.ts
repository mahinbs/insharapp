import { supabase } from './supabase';

export async function testAuthConnection() {
  console.log('Testing auth connection...');
  
  try {
    // Test 1: Check if we can get session
    console.log('1. Getting session...');
    const startTime = Date.now();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const endTime = Date.now();
    
    console.log(`Session check took ${endTime - startTime}ms`);
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: sessionError };
    }
    
    if (!session) {
      console.log('No active session found');
      return { success: false, error: 'No session' };
    }
    
    console.log('Session found for user:', session.user.email);
    
    // Test 2: Test database connection
    console.log('2. Testing database connection...');
    const dbStartTime = Date.now();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, business_name')
      .eq('id', session.user.id)
      .maybeSingle(); // Use maybeSingle instead of single
    
    const dbEndTime = Date.now();
    console.log(`Database check took ${dbEndTime - dbStartTime}ms`);
    
    if (profileError) {
      console.error('Profile error:', profileError);
    } else if (profile) {
      console.log('Profile found:', profile.business_name);
    } else {
      console.log('No profile found (might be expected for new users)');
    }
    
    return { 
      success: true, 
      session, 
      profile,
      timings: {
        sessionCheck: endTime - startTime,
        dbCheck: dbEndTime - dbStartTime
      }
    };
    
  } catch (error: any) {
    console.error('Auth test failed:', error);
    return { success: false, error: error.message };
  }
}

