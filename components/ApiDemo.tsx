"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small console that plays requests against the Financify API.
 * Routes, fields, status codes and messages are the real ones from the Financify code;
 * the data is a sample, so nothing here calls a server.
 */
type Call = {
  label: string;
  method: "GET" | "POST";
  path: string;
  body?: string;
  status: string;
  response: string;
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.x4…";

const CALLS: Call[] = [
  {
    label: "Log in",
    method: "POST",
    path: "/login",
    body: `{ "email": "ana@email.com", "senha": "••••••••••••" }`,
    status: "200 OK",
    response: JSON.stringify(
      {
        usuario: { id: 1, nome: "Ana Souza", email: "ana@email.com", demo: false, criado_em: "2026-10-01T09:12:44.000Z" },
        token: TOKEN,
      },
      null,
      2,
    ),
  },
  {
    label: "List expenses",
    method: "GET",
    path: "/transacoes?tipo=saida&limite=2",
    status: "200 OK",
    response: JSON.stringify(
      {
        transacoes: [
          {
            id: 41,
            tipo: "saida",
            descricao: "Rent",
            valor: 95000,
            data: "2026-10-01",
            categoria_id: 3,
            categoria_nome: "Casa",
          },
          {
            id: 38,
            tipo: "saida",
            descricao: "Groceries",
            valor: 6480,
            data: "2026-09-28",
            categoria_id: 4,
            categoria_nome: "Mercado",
          },
        ],
        paginacao: { pagina: 1, limite: 2, total: 43, total_paginas: 22 },
      },
      null,
      2,
    ),
  },
  {
    label: "Monthly statement",
    method: "GET",
    path: "/transacoes/extrato?de=2026-10-01&ate=2026-10-31",
    status: "200 OK",
    response: JSON.stringify(
      {
        periodo: { de: "2026-10-01", ate: "2026-10-31" },
        entrada: 325000,
        saida: 151730,
        saldo: 173270,
        por_categoria: [
          { categoria_id: 14, categoria_nome: "Salário", tipo: "entrada", total: 325000, quantidade: 1 },
          { categoria_id: 3, categoria_nome: "Casa", tipo: "saida", total: 95000, quantidade: 1 },
          { categoria_id: 4, categoria_nome: "Mercado", tipo: "saida", total: 32950, quantidade: 5 },
        ],
      },
      null,
      2,
    ),
  },
  {
    label: "Send a bad amount",
    method: "POST",
    path: "/transacoes",
    body: `{ "descricao": "Coffee", "valor": 3.5, "data": "2026-10-12", "categoria_id": 1, "tipo": "saida" }`,
    status: "400 Bad Request",
    response: JSON.stringify(
      {
        mensagem: "Dados inválidos.",
        erros: { valor: "deve ser um número inteiro maior que zero, em centavos (ex.: 1050 = € 10,50)" },
      },
      null,
      2,
    ),
  },
];

export default function ApiDemo() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(CALLS[0].response.length);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const run = (i: number) => {
    setActive(i);
    if (timer.current) window.clearInterval(timer.current);
    const full = CALLS[i].response.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(full);
      return;
    }
    // the answer streams in, like a response arriving
    let n = 0;
    setShown(0);
    timer.current = window.setInterval(() => {
      n = Math.min(full, n + Math.ceil(full / 40));
      setShown(n);
      if (n >= full && timer.current) {
        window.clearInterval(timer.current);
        timer.current = null;
      }
    }, 16);
  };

  const call = CALLS[active];
  const ok = call.status.startsWith("2");

  return (
    <div className="api">
      <div className="api-head">
        <p className="api-title">Try the API</p>
        <p className="api-note">Real routes and responses from the code. Sample data, no server called.</p>
      </div>
      <div className="api-calls" role="group" aria-label="Requests">
        {CALLS.map((c, i) => (
          <button
            key={c.label}
            type="button"
            className="api-call"
            aria-pressed={i === active}
            onClick={() => run(i)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="api-console" aria-live="polite">
        <p className="api-req">
          <span className="api-method">{call.method}</span> {call.path}
        </p>
        {call.body && <p className="api-body">{call.body}</p>}
        <p className={`api-status${ok ? "" : " bad"}`}>{call.status}</p>
        <pre className="api-res">
          <code>{call.response.slice(0, shown)}</code>
        </pre>
      </div>
    </div>
  );
}
