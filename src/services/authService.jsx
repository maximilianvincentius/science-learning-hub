let accessToken = null;
let tokenExpiry = null;

const setAccessToken = (token, expiresIn) => {
  accessToken = token;
  tokenExpiry = expiresIn;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('tokenExpiry', tokenExpiry);
};

const clearAccessToken = () => {
  accessToken = null;
  tokenExpiry = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiry');
};

const getAccessToken = () => {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
    tokenExpiry = Number(localStorage.getItem('tokenExpiry'));
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (!accessToken || nowInSeconds > tokenExpiry) {
    return null;
  }

  return accessToken;
};

const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: decoded.id,
      fullName: decoded.fullName || decoded.name || '',
      email: decoded.email || ''
    };
  } catch {
    return null;
  }
};

export default { setAccessToken, clearAccessToken, getAccessToken, getUserFromToken };
