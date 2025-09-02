/*
 * Configuration for the Docebo Assignment Grading BFF.
 *
 * Replace the placeholders below with values specific to your Docebo tenant.
 * You can find your `baseUrl` by logging into Docebo and copying the
 * hostname (e.g. "acme.docebosaas.com").  The `clientId` and
 * `clientSecret` are created when you register an OAuth2 client under
 * the API & SSO app in Docebo.  Set `redirectUri` to a URL hosted by
 * this server (e.g. `http://localhost:5000/oauth/callback`).  The
 * `scopes` array should include the permissions your app needs (see
 * Docebo documentation for available scopes).
 */

module.exports = {
  /**
   * Base URL of your Docebo tenant.  This application is configured to
   * talk to the test instance at docebo70.docebosaas.com.  If you
   * deploy against a different tenant update this value accordingly.
   */
  baseUrl: 'https://docebo70.docebosaas.process.env.DOCEBO_BASE_URL || 'https://docebo70.docebosaas.com',com',

  /**
   * OAuth client ID issued by Docebo.  Replace with the client ID you
   * create in the API & SSO app.
   */
  clientId: 'REPLACE_WITH_CLIENT_ID',

  /**
   * OAuth client secret issued by Docebo.  Replace with the client secret.
   */
  clientSecret: 'REPLACE_WITH_CLIENT_SECRET',

  /**
   * Redirect URI configured for your OAuth client.  This URL must
   * resolve to the callback route on this server.  If you change the
   * hostname or port of the server, update this value and the
   * corresponding redirect URI in Docebo.
   */
  redirectUri: 'http://localhost:5000/oauth/callback',

  /**
   * Scopes required to call Docebo APIs.  These values correspond to
   * permissions listed in the API Browser.  Adjust as needed.
   */
  scopes: ['assignment:read', 'assignment:update', 'user:read']
};
