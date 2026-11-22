"use client";

import { useState } from "react";

/**
 * The real app, inside the portfolio. It loads only when the visitor asks for it,
 * so a demo account is created for people who want one, not for every page view.
 */
export default function LiveDemo({ src, title, note }: { src: string; title: string; note: string }) {
  const [open, setOpen] = useState(false);
  const host = new URL(src).host;

  return (
    <div className="embed">
      <div className="embed-bar">
        <span className="embed-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="embed-url">{host}</span>
        <a className="embed-out" href={src} target="_blank" rel="noopener noreferrer">
          Open in a new tab
        </a>
      </div>

      {open ? (
        <iframe
          className="embed-frame"
          src={src}
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="embed-start">
          <p className="embed-title">Try {title} here</p>
          <p className="embed-note">{note}</p>
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            Open the live demo
          </button>
        </div>
      )}
    </div>
  );
}
