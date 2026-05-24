import { apiFetch } from './apiClient';

export const observeAuth = (callback) => {
  let active = true;
  apiFetch('/auth/me')
    .then(({ user }) => {
      if (active) callback(user);
    })
    .catch(() => {
      if (active) callback(null);
    });

  return () => {
    active = false;
  };
};

export const login = ({ email, password }) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

export const signup = ({ name, email, password }) => apiFetch('/auth/signup', {
  method: 'POST',
  body: JSON.stringify({ name, email, password })
});

export const forgotPassword = () => Promise.reject(new Error('Password reset email is not configured for the PHP backend yet.'));

export const logout = () => apiFetch('/auth/logout', { method: 'POST' });
