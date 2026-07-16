function layout(title, body) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>
:root {
  --kobot-200: #f6a7be;
  --kobot-300: #f1799b;
  --kobot-400: #eb3d6e;
  --kobot-500: #b91342;
  --kobot-600: #9d1038;
  --ink: #4a3d57;
  --muted: #8b7a99;
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8dced 0%, #e3d6f8 32%, #cfe4fb 68%, #d4f1ef 100%);
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  -webkit-font-smoothing: antialiased;
}
.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(2px);
  animation: float 9s ease-in-out infinite;
}
.blob-1 {
  width: 320px;
  height: 320px;
  top: -120px;
  right: -100px;
  background: radial-gradient(circle, #cfe0f7 0%, rgba(207,224,247,0) 70%);
  animation-delay: 0s;
}
.blob-2 {
  width: 280px;
  height: 280px;
  bottom: -110px;
  left: -90px;
  background: radial-gradient(circle, #e2d4f8 0%, rgba(226,212,248,0) 70%);
  animation-delay: 1.2s;
}
.blob-3 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  right: 6%;
  background: radial-gradient(circle, #ffd7e3 0%, rgba(255,215,227,0) 70%);
  animation-delay: 2.4s;
}
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-16px) scale(1.04); }
}
.card {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: rgba(255,255,255,.95);
  border: 2px dashed rgba(185,19,66,.35);
  border-radius: 24px;
  padding: 40px 35px;
  text-align: center;
  box-shadow: 0 20px 40px -20px rgba(91,74,106,.25), 0 1px 0 rgba(255,255,255,.6) inset;
  animation: card-in .5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(14px) scale(.97); }
  to { opacity: 1; transform: none; }
}
.logo {
  font-size: 48px;
  margin-bottom: 12px;
}
.logo img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 8px 14px rgba(185,19,66,.18));
}
.loading img {
  width: 72px;
  height: 72px;
  object-fit: contain;
}
h1 {
  margin: 0 0 12px;
  font-family: "Outfit", "Inter", sans-serif;
  font-weight: 700;
  font-size: 26px;
  background: linear-gradient(90deg, var(--kobot-200), var(--kobot-500) 60%, var(--kobot-300));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
p {
  color: var(--muted);
  line-height: 1.6;
  font-size: 14.5px;
}
button, .btn {
  background: var(--kobot-500);
  color: white;
  border: none;
  padding: 13px 26px;
  border-radius: 14px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 18px;
  box-shadow: 0 10px 20px -8px rgba(185,19,66,.55);
  transition: background-color .15s ease, transform .15s ease;
}
button:hover, .btn:hover {
  background: var(--kobot-600);
  transform: translateY(-1px);
}
.captcha {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}
.small {
  font-size: 12.5px;
  color: var(--muted);
  opacity: .85;
  margin-top: 22px;
}
a {
  color: var(--kobot-500);
  font-weight: 500;
}
@media (prefers-reduced-motion: reduce) {
  .blob, .card { animation: none; }
}
</style>
</head>
<body>
  <span class="blob blob-1" aria-hidden="true"></span>
  <span class="blob blob-2" aria-hidden="true"></span>
  <span class="blob blob-3" aria-hidden="true"></span>

  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}

module.exports = { layout };
