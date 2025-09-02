const axios = require('axios');
const querystring = require('querystring');
const config = require('./config');

/**
 * Build the URL that users should be redirected to for Docebo OAuth2 login.
 *
 * Docebo uses the Authorization Code Grant.  When the user visits this URL
 * they will be prompted to log in and then redirected back to the
 * application with a `code` parameter.
 *
 * @param {string} state Random string to prevent CSRF attacks
 * @returns {string} The full authorization URL
 */
function getAuthorizationUrl(state) {
  const base = `${config.baseUrl}/oauth2/authorize`;
  const params = querystring.stringify({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    state
  });
  return `${base}?${params}`;
}

/**
 * Exchange an authorization code for access and refresh tokens.
 *
 * @param {string} code The code returned by the OAuth2 callback
 * @returns {Promise<object>} Tokens and expiry information
 */
async function exchangeCodeForToken(code) {
  const tokenUrl = `${config.baseUrl}/oauth2/token`;
  const payload = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret
  };
  const res = await axios.post(tokenUrl, querystring.stringify(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
}

/**
 * Refresh an access token using a refresh token.
 *
 * @param {string} refreshToken The refresh token issued by Docebo
 * @returns {Promise<object>} New tokens and expiry information
 */
async function refreshAccessToken(refreshToken) {
  const tokenUrl = `${config.baseUrl}/oauth2/token`;
  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret
  };
  const res = await axios.post(tokenUrl, querystring.stringify(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data;
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken
};