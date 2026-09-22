import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // No build (GitHub Pages) o app é servido em https://<user>.github.io/ciclaPlus/,
  // então os assets precisam do prefixo. No dev server continua na raiz ("/")
  // pra não quebrar o `npm run dev` em http://localhost:5173/.
  base: command === 'build' ? '/ciclaPlus/' : '/',
  plugins: [
    react(),
    {
      // O GitHub Pages responde 404 pra qualquer rota interna do SPA digitada
      // direto na URL ou recarregada (ex.: /ciclaPlus/app/chat). Servindo o
      // index.html como 404.html, a página carrega e o react-router (com
      // basename) continua cuidando da rota real.
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
}))
