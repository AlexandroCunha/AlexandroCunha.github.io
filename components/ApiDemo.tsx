"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Try the API": sends real requests to the published Financify API, signed in to a demo
 * account created for the visitor (POST /demo; the API deletes it after 24 hours).
 * If the API can't be reached, it shows a recorded sample of the same request instead, and says so.
 */
const API = "https://financify-api-m2zy.onrender.com";
const WAKE_UP_MS = 2500; // after this, explain that free hosting is waking up
const GIVE_UP_MS = 75_000;

type Call = {
  label: string;
  method: "GET" | "POST";
  path: () => string;
  body?: () => Record<string, unknown>;
  needsLogin: boolean;
  sample: { status: number; body: unknown };
};

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => `${today().slice(0, 7)}-01`;

const CALLS: Call[] = [
  {
    label: "Start a demo",
    method: "POST",
    path: () => "/demo",
    needsLogin: false,
    sample: {
      status: 201,
      body: {
        usuario: { id: 42, nome: "Conta demo", email: "demo-3f9c2a…@financify.invalid", demo: true, criado_em: "2026-11-22T00:41:07.000Z" },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiJ9.x4…",
        expira_em_horas: 24,
      },
    },
  },
  {
    label: "List expenses",
    method: "GET",
    path: () => "/transacoes?tipo=saida&limite=3",
    needsLogin: true,
    sample: {
      status: 200,
      body: {
        transacoes: [
          { id: 52, tipo: "saida", descricao: "Supermercado", valor: 7110, data: "2026-11-18", categoria_id: 4, categoria_nome: "Mercado" },
          { id: 51, tipo: "saida", descricao: "Cinema", valor: 2400, data: "2026-11-16", categoria_id: 8, categoria_nome: "Lazer" },
          { id: 50, tipo: "saida", descricao: "Farmácia", valor: 1850, data: "2026-11-14", categoria_id: 12, categoria_nome: "Saúde" },
        ],
        paginacao: { pagina: 1, limite: 3, total: 40, total_paginas: 14 },
      },
    },
  },
  {
    label: "Monthly statement",
    method: "GET",
    path: () => `/transacoes/extrato?de=${monthStart()}&ate=${today()}`,
    needsLogin: true,
    sample: {
      status: 200,
      body: {
        periodo: { de: "2026-11-01", ate: "2026-11-22" },
        entrada: 370000,
        saida: 143668,
        saldo: 226332,
        por_categoria: [
          { categoria_id: 14, categoria_nome: "Salário", tipo: "entrada", total: 325000, quantidade: 1 },
          { categoria_id: 3, categoria_nome: "Casa", tipo: "saida", total: 95000, quantidade: 1 },
          { categoria_id: 4, categoria_nome: "Mercado", tipo: "saida", total: 27650, quantidade: 4 },
        ],
      },
    },
  },
  {
    label: "Send a bad amount",
    method: "POST",
    path: () => "/transacoes",
    body: () => ({ descricao: "Coffee", valor: 3.5, data: today(), categoria_id: 1, tipo: "saida" }),
    needsLogin: true,
    sample: {
      status: 400,
      body: {
        mensagem: "Dados inválidos.",
        erros: { valor: "deve ser um número inteiro maior que zero, em centavos (ex.: 1050 = € 10,50)" },
      },
    },
  },
];

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
};

type Result = { status: number; text: string; live: boolean };

// The token is long and means nothing to a reader: show its start only.
const shorten = (json: unknown) =>
  JSON.stringify(
    json,
    (key, value) => (key === "token" && typeof value === "string" && value.length > 24 ? `${value.slice(0, 24)}…` : value),
    2,
  );

async function request(method: string, path: string, token?: string, body?: unknown, signal?: AbortSignal) {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

export default function ApiDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [shown, setShown] = useState(0);
  const [busy, setBusy] = useState<"" | "working" | "waking">("");
  const token = useRef<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  const reveal = (text: string) => {
    if (timer.current) window.clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      return;
    }
    let n = 0;
    setShown(0);
    timer.current = window.setInterval(() => {
      n = Math.min(text.length, n + Math.ceil(text.length / 40));
      setShown(n);
      if (n >= text.length && timer.current) {
        window.clearInterval(timer.current);
        timer.current = null;
      }
    }, 16);
  };

  const startDemo = async (signal: AbortSignal) => {
    const r = await request("POST", "/demo", undefined, undefined, signal);
    if (r.status === 201 && (r.data as { token?: string } | null)?.token) {
      token.current = (r.data as { token: string }).token;
    }
    return r;
  };

  const run = async (i: number) => {
    if (busy) return;
    const call = CALLS[i];
    setActive(i);
    setResult(null);
    setShown(0);
    setBusy("working");
    const controller = new AbortController();
    const wake = window.setTimeout(() => setBusy("waking"), WAKE_UP_MS);
    const giveUp = window.setTimeout(() => controller.abort(), GIVE_UP_MS);

    try {
      let r: { status: number; data: unknown };
      if (!call.needsLogin) {
        r = await startDemo(controller.signal);
        if (r.status === 404) throw new Error("demo route not deployed yet");
      } else {
        if (!token.current) {
          const d = await startDemo(controller.signal);
          if (d.status !== 201) throw new Error("demo unavailable");
        }
        r = await request(call.method, call.path(), token.current ?? undefined, call.body?.(), controller.signal);
        if (r.status === 401) {
          // the demo login lasts 2 hours: get a fresh one and try again
          token.current = null;
          const d = await startDemo(controller.signal);
          if (d.status !== 201) throw new Error("demo unavailable");
          r = await request(call.method, call.path(), token.current ?? undefined, call.body?.(), controller.signal);
        }
      }
      const text = shorten(r.data);
      setResult({ status: r.status, text, live: true });
      reveal(text);
    } catch {
      const text = shorten(call.sample.body);
      setResult({ status: call.sample.status, text, live: false });
      reveal(text);
    } finally {
      window.clearTimeout(wake);
      window.clearTimeout(giveUp);
      setBusy("");
    }
  };

  const call = active === null ? null : CALLS[active];
  const ok = result ? result.status < 400 : true;

  return (
    <div className="api">
      <div className="api-head">
        <p className="api-title">Try the API</p>
        <p className="api-note">
          Real requests to the live Financify API, signed in to a demo account made for you. It is deleted after 24
          hours.
        </p>
      </div>
      <div className="api-calls" role="group" aria-label="Requests">
        {CALLS.map((c, i) => (
          <button
            key={c.label}
            type="button"
            className="api-call"
            aria-pressed={i === active}
            disabled={!!busy}
            onClick={() => run(i)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="api-console" aria-live="polite">
        {!call && <p className="api-body">Pick a request. The first one creates your demo account, no sign-up.</p>}
        {call && (
          <>
            <p className="api-req">
              <span className="api-method">{call.method}</span> {call.path()}
            </p>
            {call.body && <p className="api-body">{JSON.stringify(call.body())}</p>}
            {call.needsLogin && <p className="api-body">Authorization: Bearer &lt;your demo token&gt;</p>}
          </>
        )}
        {busy === "working" && <p className="api-status wait">Sending…</p>}
        {busy === "waking" && (
          <p className="api-status wait">
            Waking the API up. It runs on free hosting and sleeps when idle, so the first request can take up to a
            minute.
          </p>
        )}
        {result && (
          <>
            <p className={`api-status${ok ? "" : " bad"}`}>
              {result.status} {STATUS_TEXT[result.status] ?? ""}
              {!result.live && <span className="api-recorded"> · recorded sample, the live API didn&apos;t answer</span>}
            </p>
            <pre className="api-res">
              <code>{result.text.slice(0, shown)}</code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
