/*
 * tls-fix.js – Force TLS 1.2 for MongoDB Atlas compatibility
 * ----------------------------------------------------------
 * Node 20's OpenSSL negotiates TLS 1.3 by default, but the
 * Atlas free-tier cluster only supports TLS 1.2. This preload
 * script patches tls.connect so every outbound TLS socket caps
 * at TLS 1.2.
 *
 * Usage (automatic via NODE_OPTIONS or --require):
 *   node --require ./tls-fix.js server.js
 */

const tls = require("tls");

// Set default TLS max version to 1.2
tls.DEFAULT_MAX_VERSION = "TLSv1.2";

const origConnect = tls.connect;

tls.connect = function patchedConnect(options, ...rest) {
  if (typeof options === "object" && options !== null) {
    options.maxVersion = "TLSv1.2";
  }
  return origConnect.call(this, options, ...rest);
};
