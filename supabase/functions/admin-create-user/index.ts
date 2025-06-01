
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Admin create user function started');

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Verify the requesting user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      console.error('Admin access check failed:', profileError?.message);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    const { email, password, plan } = await req.json()
    console.log('Creating user with email:', email);

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // First check if user already exists in auth.users
    const { data: existingAuthUsers, error: authCheckError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authCheckError) {
      console.error('Error checking existing auth users:', authCheckError);
    } else {
      const existingAuthUser = existingAuthUsers.users?.find(u => u.email === email);
      if (existingAuthUser) {
        console.log('User exists in auth.users, checking profile...');
        
        // Check if profile exists
        const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', existingAuthUser.id)
          .maybeSingle();

        if (profileCheckError) {
          console.error('Error checking existing profile:', profileCheckError);
        }

        if (!existingProfile) {
          console.log('Profile missing for existing auth user, creating profile...');
          // Create missing profile
          const { error: createProfileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: existingAuthUser.id,
              email: existingAuthUser.email,
              status: 'active',
              is_admin: false
            });

          if (createProfileError) {
            console.error('Error creating missing profile:', createProfileError);
            return new Response(
              JSON.stringify({ error: 'Failed to create user profile' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log('Missing profile created successfully');
          return new Response(
            JSON.stringify({ 
              user: existingAuthUser,
              message: 'User profile was missing and has been created'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          console.log('User and profile already exist');
          return new Response(
            JSON.stringify({ error: 'A user with this email address has already been registered' }),
            { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Create the user if they don't exist
    console.log('Creating new user...');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { plan: plan || 'free' }
    })

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User created successfully:', newUser.user?.id);

    // Ensure profile is created (the trigger should handle this, but let's be extra sure)
    if (newUser.user) {
      // Wait a moment for the trigger to fire
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if profile was created by trigger
      const { data: triggerProfile, error: triggerProfileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', newUser.user.id)
        .maybeSingle();

      if (triggerProfileError) {
        console.error('Error checking trigger-created profile:', triggerProfileError);
      }

      if (!triggerProfile) {
        console.log('Trigger did not create profile, creating manually...');
        // Create profile manually if trigger failed
        const { error: manualProfileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUser.user.id,
            email: newUser.user.email,
            status: 'active',
            is_admin: false
          });

        if (manualProfileError) {
          console.error('Error creating profile manually:', manualProfileError);
        } else {
          console.log('Profile created manually');
        }
      } else {
        console.log('Profile created by trigger successfully');
      }
    }

    return new Response(
      JSON.stringify({ user: newUser.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in admin-create-user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
