const axios = require('axios');
const config = require('./config');

/**
 * Helper to call Docebo API with authentication.
 *
 * All requests include the Bearer token in the Authorization header.  If
 * the API returns a 401 response, callers should refresh the token and
 * retry.
 *
 * @param {string} method HTTP method (GET, POST, etc.)
 * @param {string} path API path beginning after the base URL, e.g. '/assignment/v1/submissions'
 * @param {string} token OAuth2 access token
 * @param {object} [data] Optional request body
 * @param {object} [params] Optional query string parameters
 */
async function apiRequest(method, path, token, { data, params } = {}) {
  const url = `${config.baseUrl}${path}`;
  const res = await axios({
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data,
    params
  });
  return res.data;
}

/**
 * Fetch a list of assignment submissions.
 *
 * @param {string} token OAuth2 access token
 * @param {object} options Optional filtering (e.g. courseId, status)
 */
async function listSubmissions(token, options = {}) {
  // The path here may vary by tenant/version.  Use the API Browser to confirm.
  const path = '/assignment/v1/submissions';
  return await apiRequest('GET', path, token, { params: options });
}

/**
 * Get a specific submission.
 *
 * @param {string} token OAuth2 access token
 * @param {string} submissionId The ID of the submission
 */
async function getSubmission(token, submissionId) {
  const path = `/assignment/v1/submissions/${submissionId}`;
  return await apiRequest('GET', path, token);
}

/**
 * Approve or reject a submission.
 *
 * @param {string} token OAuth2 access token
 * @param {string} submissionId The ID of the submission to update
 * @param {object} body The payload containing status and optional comments/score
 *
 * Example body: `{ status: 'approved', feedback: 'Great job!', score: 100 }`
 */
async function updateSubmission(token, submissionId, body) {
  const path = `/assignment/v1/submissions/${submissionId}`;
  return await apiRequest('PUT', path, token, { data: body });
}

module.exports = {
  listSubmissions,
  getSubmission,
  updateSubmission
};