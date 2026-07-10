function layout(title, body) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<style>
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #050816, #0d1b3d);
  font-family: Arial, sans-serif;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 92%;
  max-width: 460px;
  background: rgba(255,255,255,.09);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 24px;
  padding: 35px;
  text-align: center;
  box-shadow: 0 20px 70px rgba(0,0,0,.55);
}
.logo {
  font-size: 52px;
  margin-bottom: 10px;
}
h1 {
  margin: 0 0 14px;
}
p {
  color: rgba(255,255,255,.82);
  line-height: 1.5;
}
button, .btn {
  background: #0099ff;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 18px;
}
.captcha {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}
.small {
  font-size: 13px;
  opacity: .65;
  margin-top: 20px;
}
</style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}

module.exports = { layout };
