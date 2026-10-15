import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    onGoogleCredential: ((res: { credential: string }) => void) | undefined;
  }
}

const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? "";

/**
 * Renders the official Google Identity Services button.
 * Hidden automatically when VITE_GOOGLE_CLIENT_ID is not configured.
 */
export default function GoogleButton({
  onCredential,
}: {
  onCredential: (credential: string, name?: string, picture?: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID || !ref.current) return;

    window.onGoogleCredential = (res: { credential: string }) => {
      let name: string | undefined;
      let picture: string | undefined;
      try {
        const payload = JSON.parse(
          atob(res.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        name = payload.name;
        picture = payload.picture;
      } catch {
        /* payload is opaque; the server verifies it anyway */
      }
      cbRef.current(res.credential, name, picture);
    };

    if (window.google?.accounts?.id) {
      init();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);

    function init() {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: window.onGoogleCredential,
      });
      if (ref.current) {
        window.google.accounts.id.renderButton(ref.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: 320,
        });
      }
    }
  }, []);

  if (!CLIENT_ID) return null;
  return <div ref={ref} className="google-btn-host" />;
}

export const googleConfigured = CLIENT_ID.length > 0;
