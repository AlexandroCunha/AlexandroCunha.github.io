"use client";

import { useState } from "react";

/**
 * Contact form with no server: on send it opens the visitor's own email app with
 * everything filled in, addressed to Alexandro. Nothing is stored or sent by this site.
 */
type Kind = "role" | "project";

const KINDS: { value: Kind; label: string; prompt: string; subject: string }[] = [
  { value: "role", label: "A job opportunity", prompt: "Tell me about the role and the team", subject: "Job opportunity" },
  { value: "project", label: "A project idea", prompt: "Describe your idea and who it is for", subject: "Project idea" },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactForm({ to }: { to: string }) {
  const [kind, setKind] = useState<Kind>("project");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const current = KINDS.find((k) => k.value === kind)!;

  const clear = (field: keyof Errors) => setErrors((e) => ({ ...e, [field]: undefined }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!email.trim()) next.email = "Enter your email, so I can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "That email doesn't look right. Check it and try again.";
    if (message.trim().length < 10) next.message = "Write a little more, at least a sentence.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    const subject = `${current.subject} from ${name.trim()}`;
    const lines = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].filter((l, i, all) => l !== "" || (i > 0 && all[i - 1] !== ""));
    const body = lines.join("\n");

    setSent({ subject, body });
    setCopied(false);
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${to}\nSubject: ${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const err = (field: keyof Errors) =>
    errors[field] ? (
      <p className="cf-error" id={`cf-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <fieldset className="cf-kinds">
        <legend className="cf-legend">This is about</legend>
        {KINDS.map((k) => (
          <label key={k.value} className="cf-kind">
            <input
              type="radio"
              name="kind"
              value={k.value}
              checked={kind === k.value}
              onChange={() => setKind(k.value)}
            />
            <span>{k.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clear("name");
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
          />
          {err("name")}
        </div>
        <div className="cf-field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clear("email");
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
          />
          {err("email")}
        </div>
      </div>

      <div className="cf-field">
        <label htmlFor="cf-message">{current.prompt}</label>
        <textarea
          id="cf-message"
          rows={3}
          maxLength={1500}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clear("message");
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
        />
        {err("message")}
      </div>

      <div className="cf-send">
        <button type="submit" className="btn contact-cta">
          Send
        </button>
        <p className="cf-note">Sending opens your email app with everything filled in. Nothing is stored on this site.</p>
      </div>

      {sent && (
        <div className="cf-sent" role="status">
          <p>Your email app should open now, ready to send. If it didn&apos;t, copy the message and send it from any email account.</p>
          <button type="button" className="btn alt" onClick={copy}>
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
      )}
    </form>
  );
}
