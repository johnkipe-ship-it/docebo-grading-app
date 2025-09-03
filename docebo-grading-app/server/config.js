/*
 * Configuration for the Docebo Assignment Grading BFF.
 *
 * This file reads configuration from environment variables:
 * - DOCEBO_BASE_URL: base URL of your Docebo tenant (e.g., https://company.docebosaas.com)
 * - DOCEBO_CLIENT_ID: OAuth client ID from the API & SSO app
 * - DOCEBO_CLIENT_SECRET: OAuth client secret from the API & SSO app
 * - DOCEBO_REDIRECT_URI: redirect URI configured for your OAuth client
 * - DOCEBO_SCOPES: comma-separated list of scopes (optional; defaults to assignment:read,assignment:update,user:read)
 *
 * It falls back to sensible defaults if some variables are not set.
 */

const baseUrl = process.env.DOCEBO_BASE_URL || 'https://docebo70.docebosaas.com';
const clientId = process.env.DOCEBO_CLIENT_ID || 'local-assignment-grader';
const clientSecret = process.env.DOCEBO_CLIENT_SECRET || 'a538f5455e98b33b80cf2c859756e78fd0c37d63fff158a48aaf6405cd053b6c';
const redirectUri = process.env.DOCEBO_REDIRECT_URI || 'http://localhost:5000/oauth/callback';
const scopesEnv = process.env.DOCEBO_SCOPES || 'assignment:read,assignment:update,user:read';
const scopes = scopesEnv.split(',').map((s) => s.trim());

module.exports = {
  baseUrl,
  clientId,
  clientSecret,
  redirectUri,
  scopes,
};
