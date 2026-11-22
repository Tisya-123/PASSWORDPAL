PasswordPal - folder layout
  index.html   page markup
  style.css    styles
  script.js    all the suffering
  api/login.js optional serverless endpoint (Vercel). Without it, script.js uses built-in errors.
Deploy: Netlify Drop / GitHub Pages / Cloudflare Pages (static) or Vercel (static + api).
Local test: serve the folder (e.g. python3 -m http.server) or just open index.html.
