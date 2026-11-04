#!/usr/bin/env node
/*
  Local half of connecting the owner's Square account. Never deployed.

    node scripts/square-connect.mjs keygen
      Once. Makes the RSA key pair. The PRIVATE key goes to
      C:\Users\aliha\iqan-secrets\ (outside every repo). The PUBLIC key is
      written to .env.local as SQUARE_CONNECT_PUBLIC_KEY, and the same value
      must be set in Vercel. Refuses to overwrite an existing private key:
      a new pair would make any code already sealed unopenable.

    node scripts/square-connect.mjs open <sealed-code | path-to-file>
      Unseals the code the owner sent from /shop/connected and writes the
      production values (refresh token, location id) to
      C:\Users\aliha\iqan-secrets\nabils-square-production.env.
      Prints only what is safe to see: merchant, locations, token length.
*/

import { constants, createDecipheriv, generateKeyPairSync, privateDecrypt } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SECRETS = process.env.IQAN_SECRETS_DIR ?? "C:\\Users\\aliha\\iqan-secrets";
const PRIVATE_KEY = join(SECRETS, "square-connect-private.pem");
const PRODUCTION_ENV = join(SECRETS, "nabils-square-production.env");

function upsertEnv(file, name, value) {
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  writeFileSync(file, pattern.test(text) ? text.replace(pattern, line) : `${text.trimEnd()}\n${line}\n`);
}

function keygen() {
  if (existsSync(PRIVATE_KEY)) {
    console.error(`Refusing: ${PRIVATE_KEY} already exists.`);
    process.exit(1);
  }
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 3072,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  mkdirSync(SECRETS, { recursive: true });
  writeFileSync(PRIVATE_KEY, privateKey, { mode: 0o600 });
  const publicB64 = Buffer.from(publicKey).toString("base64");
  upsertEnv(join(SITE, ".env.local"), "SQUARE_CONNECT_PUBLIC_KEY", publicB64);
  console.log(`private key: ${PRIVATE_KEY}`);
  console.log(`public key written to .env.local as SQUARE_CONNECT_PUBLIC_KEY (${publicB64.length} chars)`);
}

function open(input) {
  const sealed = (existsSync(input) ? readFileSync(input, "utf8") : input).trim().replace(/^.*#/, "");
  const buffer = Buffer.from(sealed, "base64url");
  const keyLength = buffer.readUInt16BE(0);
  let at = 2;
  const wrapped = buffer.subarray(at, (at += keyLength));
  const iv = buffer.subarray(at, (at += 12));
  const tag = buffer.subarray(at, (at += 16));
  const data = buffer.subarray(at);

  const key = privateDecrypt(
    { key: readFileSync(PRIVATE_KEY, "utf8"), padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    wrapped,
  );
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const payload = JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8"));

  const active = payload.locations.filter((location) => location.status === "ACTIVE");
  console.log(`merchant ${payload.merchant_id}, connected ${payload.connected_at}`);
  console.log(`refresh token: ${payload.refresh_token ? `${payload.refresh_token.length} chars` : "MISSING"}`);
  for (const location of payload.locations) {
    console.log(`location ${location.id}  ${location.name}  ${location.status}  ${location.currency}`);
  }

  mkdirSync(SECRETS, { recursive: true });
  upsertEnv(PRODUCTION_ENV, "SQUARE_REFRESH_TOKEN", payload.refresh_token);
  if (active.length === 1) upsertEnv(PRODUCTION_ENV, "SQUARE_LOCATION_ID", active[0].id);
  console.log(`written: ${PRODUCTION_ENV}`);
  if (active.length !== 1) {
    console.log(`${active.length} active locations: choose SQUARE_LOCATION_ID by hand.`);
  }
}

const [command, argument] = process.argv.slice(2);
if (command === "keygen") keygen();
else if (command === "open" && argument) open(argument);
else {
  console.error("usage: node scripts/square-connect.mjs keygen | open <sealed-code | file>");
  process.exit(1);
}
