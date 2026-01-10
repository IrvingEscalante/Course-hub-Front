const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = path.join(__dirname, 'dist', 'proyect', 'browser');

// Servir archivos estáticos
app.use(express.static(DIST_FOLDER, {
  maxAge: '1y',
  etag: false
}));

// Rewrite de rutas Angular (SPA)
app.use((req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
