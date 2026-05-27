import { supabase } from './supabaseClient';

const toPublicUser = (user) => {
  if (!user) return null;

  return {
    uid: user.id,
    id: user.id,
    displayName: user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email,
    email: user.email
  };
};

export const observeAuth = (callback) => {
  supabase.auth.getUser().then(({ data }) => {
    callback(toPublicUser(data.user));
  });

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toPublicUser(session?.user ?? null));
  });

  return () => {
    data.subscription.unsubscribe();
  };
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: toPublicUser(data.user) };
};

export const signup = async ({ name, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name
      }
    }
  });
  if (error) throw error;
  return { user: toPublicUser(data.user) };
};

export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });
  if (error) throw error;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
