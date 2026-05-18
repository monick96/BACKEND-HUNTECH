const pool = require("../dataBase/conexionPostgres");

export async function createPortfolio(client, { titulo, descripcion }) {
  const q = `INSERT INTO portfolio (titulo, descripcion) VALUES ($1, $2) RETURNING id, titulo, descripcion, imagenes, created_at`;
  const r = await client.query(q, [titulo, descripcion]);
  return r.rows[0];
}

export async function linkDeveloperToPortfolio(client, { desarrollador_email, portfolio_id }) {
  const q = `INSERT INTO desarrollador_x_portfolio (desarrollador_email, portfolio_id) VALUES ($1, $2)`;
  await client.query(q, [desarrollador_email, portfolio_id]);
}

export async function countPortfoliosByDeveloper(client, desarrollador_email) {
  const q = `SELECT COUNT(*)::int as cnt FROM desarrollador_x_portfolio WHERE desarrollador_email = $1`;
  const r = await client.query(q, [desarrollador_email]);
  return r.rows[0].cnt;
}

export async function getPortfolioById(client, id) {
  const q = `SELECT * FROM portfolio WHERE id = $1`;
  const r = await client.query(q, [id]);
  return r.rows[0];
}

export async function getImageCountForPortfolioForUpdate(client, portfolioId) {
  // bloquea la row para evitar race conditions
  const q = `SELECT imagenes FROM portfolio WHERE id = $1 FOR UPDATE`;
  const r = await client.query(q, [portfolioId]);
  const arr = r.rows[0]?.imagenes || [];
  return arr.length;
}

export async function appendImageToPortfolio(client, portfolioId, imageUrl) {
  const q = `
    UPDATE portfolio
    SET imagenes = array_append(imagenes, $2)
    WHERE id = $1 AND (array_length(imagenes,1) IS NULL OR array_length(imagenes,1) < 3)
    RETURNING imagenes
  `;
  const r = await client.query(q, [portfolioId, imageUrl]);
  if (r.rowCount === 0) throw new Error('Máximo de imagenes alcanzado o no se encontró el usuario');
  return r.rows[0].imagenes;
}

export async function removeImageFromPortfolio(client, portfolioId, imageUrl) {
  const q = `
    UPDATE portfolio
    SET imagenes = array_remove(imagenes, $2)
    WHERE id = $1
    RETURNING imagenes
  `;
  const r = await client.query(q, [portfolioId, imageUrl]);
  return r.rows[0]?.imagenes;
}

