"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./ShopCart.module.css";

/*
  Shows the owner the sealed connection code from the URL fragment, with one
  button to copy it. The code is unreadable without IQAN's private key, which
  is why it is safe to send over WhatsApp.
*/

type View = { kind: "loading" } | { kind: "failed" } | { kind: "sealed"; code: string };

export function ConnectedCode({
  label,
  titleClassName,
  ledeClassName,
}: {
  label: ReactNode;
  titleClassName: string;
  ledeClassName: string;
}) {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = window.location.hash.slice(1);
    setView(code ? { kind: "sealed", code } : { kind: "failed" });
  }, []);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard blocked: the code is selectable in the box below instead.
    }
  }

  if (view.kind === "loading") return null;

  if (view.kind === "failed") {
    return (
      <>
        {label}
        <h1 id="connected-title" className={titleClassName}>
          That didn&apos;t connect.
        </h1>
        <p className={ledeClassName}>
          Nothing was changed. Open the link Ali sent you again and press Allow
          on the Square page. If it keeps happening, tell Ali.
        </p>
      </>
    );
  }

  return (
    <>
      {label}
      <h1 id="connected-title" className={titleClassName}>
        Square is connected.
      </h1>
      <p className={ledeClassName}>
        One last step: copy this code and send it to Ali on WhatsApp. It&apos;s
        locked, so only Ali can use it.
      </p>
      <textarea
        readOnly
        value={view.code}
        aria-label="Connection code"
        className={styles.sealed}
        onFocus={(event) => event.currentTarget.select()}
      />
      <button type="button" className={styles.checkout} onClick={() => copy(view.code)}>
        {copied ? "Copied — now paste it to Ali" : "Copy code"}
      </button>
    </>
  );
}
