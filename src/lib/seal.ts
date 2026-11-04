import { constants, createCipheriv, publicEncrypt, randomBytes } from "node:crypto";

/*
  Seals the Square connect result with IQAN's public key, so it can travel
  through a browser and WhatsApp unreadable. `scripts/square-connect.mjs open`
  is the only thing that opens it, with the private key kept in iqan-secrets.
  No path aliases here: the round-trip test runs this file with plain Node.

  Format (base64url): [2-byte key length][RSA-OAEP-SHA256 wrapped AES key]
  [12-byte IV][16-byte GCM tag][AES-256-GCM ciphertext of the JSON payload].
*/
export function seal(payload: object, publicKeyPem: string) {
  const key = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const wrapped = publicEncrypt(
    { key: publicKeyPem, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    key,
  );
  const length = Buffer.alloc(2);
  length.writeUInt16BE(wrapped.length);
  return Buffer.concat([length, wrapped, iv, cipher.getAuthTag(), data]).toString("base64url");
}
