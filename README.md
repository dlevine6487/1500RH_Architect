# Siemens S7-1500 R/H Strategy Architect - Secure Build

This repository contains the **S7-1500 R/H Strategy Architect** tool, a single-file HTML application designed for offline use. It utilizes a robust security mechanism based on Content Security Policy (CSP) hashing to ensure only authorized code executes.

## Files

*   `S71500RH Strategy Architect_v2.html`: The main application file. It is secure, offline-ready, and contains all necessary dependencies (DOMPurify, jsPDF) embedded within.
*   `hash-csp.js`: A Node.js utility script. It calculates SHA-256 hashes for all inline script blocks in the HTML file and automatically updates the CSP meta tag.

## Prerequisites

To maintain the security of this file, you need **Node.js** installed to run the hashing utility.

*   Check if Node.js is installed:
    ```bash
    node -v
    ```
*   If not, download and install it from [nodejs.org](https://nodejs.org/).

## Workflow: Editing and Securing

This application enforces a **"Zero-Trust"** security model for scripts. The browser will strictly refuse to execute any inline script that does not match the specific hashes listed in the CSP meta tag.

### 1. Edit the HTML
Make your desired changes to `S71500RH Strategy Architect_v2.html`. You can modify the HTML structure, CSS styles, or JavaScript logic.

> **Important**: Do not use inline event handlers (e.g., `onclick="myFunction()"`). The strict CSP blocks these. Instead, assign IDs to your elements and bind events using `addEventListener` inside the main script block (see the `attachEventListeners` function in the source code).

### 2. Update Security Hashes
Whenever you modify any content inside a `<script>` tag, the hash of that block changes. You must update the CSP header to match.

Run the included utility script from your terminal in the project directory:

```bash
node hash-csp.js
```

You should see output indicating success:
```text
Found 3 script blocks.
✅ Success! Updated CSP with split policy.
New CSP: default-src 'self' ...
```

### 3. Verify
Open `S71500RH Strategy Architect_v2.html` in your web browser.
*   The application should load and function correctly.
*   Open the Developer Console (F12). You should **not** see errors starting with `Refused to execute inline script...`.

## Security Architecture

*   **Script Security**: The `script-src` directive uses specific **SHA-256 hashes**. The `'unsafe-inline'` keyword is **removed** for scripts, effectively neutralizing potential Cross-Site Scripting (XSS) vectors.
*   **Style Security**: The `style-src` directive allows `'unsafe-inline'` to support the application's single-file nature with embedded CSS.
*   **Offline Privacy**: All libraries (jsPDF, DOMPurify) and assets (icons) are embedded. The application makes no external network requests (CDNs, APIs), ensuring data privacy and offline capability.
