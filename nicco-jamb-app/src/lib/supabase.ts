import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://tacofzyrfjhperfprxig.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNmODY3MTdhLTZiNGQtNDcxYS04YTEwLTljYmJkZjRhYjlhNSJ9.eyJwcm9qZWN0SWQiOiJ0YWNvZnp5cmZqaHBlcmZwcnhpZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc5NTY2MzIyLCJleHAiOjIwOTQ5MjYzMjIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.-mmDZlAt1oTfMBnrnsDEkmx_u4Y0qWbXbGdt2X4GhIc';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Persist the session so the user stays logged in across reloads.
    persistSession: true,
    // Keep the access token fresh automatically. This is important for the
    // email-verification flow: when the token is refreshed AFTER the user
    // confirms their email, the new JWT carries the updated `email_confirmed_at`
    // claim, which clears the "infinite verification loop".
    autoRefreshToken: true,
    // Parse auth tokens out of the URL when the user is redirected back from the
    // verification / magic link. Without this, clicking the verify link does not
    // establish a fresh, verified session in the browser.
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});


export { supabase };
