# Portfólio — Alex

Next.js + TypeScript, exportado como site estático e publicado no GitHub Pages.
Os projetos são buscados da API do GitHub (`AlexandroCunha`) a cada build.

## Rodar localmente
```bash
npm install
npm run dev
```

## Personalizar
Edite `lib/config.ts` (nome, bio, skills, links, repositórios em destaque).

## Publicar no GitHub Pages
1. Crie o repositório **`AlexandroCunha.github.io`** (assim o site fica na raiz, sem `basePath`).
2. Envie este projeto para a branch `main`.
3. Em *Settings → Pages*, escolha **Source: GitHub Actions**.
4. Cada push (e toda segunda-feira) reconstrói e publica o site.

> Se usar outro nome de repositório, adicione `basePath: "/nome-do-repo"` em `next.config.mjs`.
