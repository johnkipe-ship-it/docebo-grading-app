const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { getAuthorizationUrl, exchangeCodeForToken } = require('./auth');
const { listSubmissions, getSubmission, updateSubmission } = require('./api');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: 'change-this-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

/**
 * Generate a random string for the OAuth `state` parameter.
 */
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Middleware that ensures the user is authenticated before accessing
 * protected routes.  It assumes tokens are stored in the session under
 * `session.tokens`.
 */
function ensureAuthenticated(req, res, next) {
  if (req.session.tokens && req.session.tokens.access_token) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

/**
 * GET /login
 *
 * Starts the OAuth2 flow by redirecting the user to Docebo's authorization
 * endpoint.  A CSRF state value is stored in the session and included in
 * the authorization request.
 */
app.get('/login', (req, res) => {
  const state = generateState();
  req.session.oauthState = state;
  const authUrl = getAuthorizationUrl(state);
  res.redirect(authUrl);
});

/**
 * GET /oauth/callback
 *
 * Handles the redirect from Docebo after the user logs in.  It
 * exchanges the code for tokens and stores them in the session.
 */
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send('Missing code or state');
  }
  // Validate state to mitigate CSRF
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state');
  }
  try {
    const tokens = await exchangeCodeForToken(code);
    req.session.tokens = tokens;
    res.redirect('/');
  } catch (err) {
    console.error('Failed to exchange code', err.message);
    res.status(500).send('Authentication failed');
  }
});

/**
 * GET /api/submissions
 *
 * Returns a list of assignment submissions.  Accepts optional query
 * parameters such as `courseId` or `status`.  Requires authentication.
 */
app.get('/api/submissions', ensureAuthenticated, async (req, res) => {
  try {
    const submissions = await listSubmissions(
      req.session.tokens.access_token,
      req.query
    );
    res.json(submissions);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

/**
 * GET /api/submissions/:id
 *
 * Returns details for a single submission.
 */
app.get('/api/submissions/:id', ensureAuthenticated, async (req, res) => {
  try {
    const submission = await getSubmission(
      req.session.tokens.access_token,
      req.params.id
    );
    res.json(submission);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

/**
 * POST /api/submissions/:id
 *
 * Approve or reject a submission.  The request body must include the
 * updated status and any feedback.  The body is passed directly to the
 * Docebo API.
 */
app.post('/api/submissions/:id', ensureAuthenticated, async (req, res) => {
  try {
    const result = await updateSubmission(
      req.session.tokens.access_token,
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// Serve client build if present
const path = require('path');
const clientBuild = path.join(__dirname, '../client/build');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});