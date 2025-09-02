# Docebo Assignment Grading App

This repository contains a minimal reference implementation of a small backend‑for‑frontend (BFF) and single page application (SPA) to streamline assignment grading within **Docebo**.  The goal is to provide a single screen for Admins or Power Users to review and act on assignments without navigating into each course one at a time.

## High‑Level Architecture

The application is split into two parts:

1. **Backend (BFF)** – A Node.js/Express server that handles OAuth2 authentication against your Docebo tenant and proxies API calls to the Docebo REST endpoints.  This layer keeps secrets off of the client, normalises error handling and avoids CORS issues in the browser.
2. **Front‑end (SPA)** – A React application that fetches assignment data from the BFF and presents a table of submissions to grade.  It allows sorting, filtering and performing actions (approve, reject, etc.) on assignments.  Authentication is handled via an OAuth login redirect to Docebo; the BFF stores the resulting access tokens in an HTTP‑only cookie.

You can embed the SPA inside a Docebo **HTML** or **iFrame** widget on a page accessible only to Admins or Power Users.

## Quick Start

```
git clone <this repo>
cd docebo-grading-app

# install server dependencies
cd server
npm install

# install client dependencies
cd ../client
npm install

# start both server and client concurrently (see concurrently script)
cd ..
npm run dev
```

> **NOTE:** The code uses placeholder configuration values for `clientId`, `clientSecret`, `redirectUri` and `baseUrl`.  You must replace these with values for your Docebo tenant.  See `server/config.js` for details.

## Structure

- **server/** – Node.js backend
  - `index.js` – Express server entry point
  - `auth.js` – OAuth2 helper functions
  - `api.js` – Functions to call Docebo assignment endpoints
  - `config.js` – Configuration for OAuth and base URL

- **client/** – React frontend
  - `src/App.js` – Main application component with assignment table and actions
  - `src/api.js` – Helper functions to call the BFF
  - `src/index.js` – Entry point rendering the app

## Security & Permissions

This example is intentionally minimal and does **not** cover production concerns like CSRF protection, secure cookie handling or token encryption.  It demonstrates how to wire up the OAuth flow and API calls.  You should harden the server and restrict access to the embedded page to authorised roles only.

You must also enable the **API & SSO** app in your Docebo tenant and create an OAuth2 client for this application.  Assign the minimum scopes required (e.g. `assignment.read`, `assignment.update`, `user.read`, etc.) and set the redirect URI to match `config.redirectUri`.

Refer to your **API Browser** within Docebo for the exact endpoints and request/response schemas as they may differ between tenants and Docebo versions.