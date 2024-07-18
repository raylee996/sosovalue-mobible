import { v4 as uuidv4 } from "uuid";

export async function generateCodeChallenge() {
    const enc = new TextEncoder();
    const base64url = (buffer: ArrayBuffer) =>
        btoa(String.fromCharCode(...new Uint8Array(buffer)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");

    const sha256 = (str: string) =>
        window.crypto.subtle.digest("SHA-256", enc.encode(str)).then(base64url);
    return sha256(uuidv4());
}