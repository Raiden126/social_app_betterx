const API_BASE = import.meta.env.VITE_REACT_APP_API_ENDPOINT + '/api/users';

export const oauthService = {
  googleLogin: () => {
    window.location.href = `${API_BASE}/google`;
  },
  githubLogin: () => {
    window.location.href = `${API_BASE}/github`;
  },
};
