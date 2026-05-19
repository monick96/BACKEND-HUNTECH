const pool = require("../dataBase/conexionPostgres");

//este es el único que hice a mano y el único que funciona.
exports.getPortfolioById = async (id) => {
  const q = `SELECT * FROM portfolio where id IN
                (SELECT 1 FROM desarrollador_x_portfolio WHERE desarrollador_email= $1)`;
  const r = await pool.query(q, [id]);
  return r.rows[0];
}

//A ESTO HAY QUE CAMBIARLE ESOS DOS PARAMETROS POR:
//titulo1, titulo2, titulo3, descripcion1... imagenes1... cada "imagenes" es un array de hasta 3 strings.
exports.createPortfolio = async (titulo, descripcion) => {
  const q = `INSERT INTO portfolio (titulo, descripcion) VALUES ($1, $2) RETURNING id, titulo, descripcion, imagenes, created_at`;
  const r = await pool.query(q, [titulo, descripcion]);
  return r.rows[0];
}

//y de acá en más asumo que todo hay que reescribirlo.
exports.linkDeveloperToPortfolio = async ({ desarrollador_email, portfolio_id }) => {
  const q = `INSERT INTO desarrollador_x_portfolio (desarrollador_email, portfolio_id) VALUES ($1, $2)`;
  await pool.query(q, [desarrollador_email, portfolio_id]);
}

exports.countPortfoliosByDeveloper = async (desarrollador_email) => {
  const q = `SELECT COUNT(*)::int as cnt FROM desarrollador_x_portfolio WHERE desarrollador_email = $1`;
  const r = await pool.query(q, [desarrollador_email]);
  return r.rows[0].cnt;
}

exports.getImageCountForPortfolioForUpdate = async (portfolioId) => {
  // bloquea la row para evitar race conditions
  const q = `SELECT imagenes FROM portfolio WHERE id = $1 FOR UPDATE`;
  const r = await pool.query(q, [portfolioId]);
  const arr = r.rows[0]?.imagenes || [];
  return arr.length;
}

exports.appendImageToPortfolio = async (portfolioId, imageUrl) => {
  const q = `
    UPDATE portfolio
    SET imagenes = array_append(imagenes, $2)
    WHERE id = $1 AND (array_length(imagenes,1) IS NULL OR array_length(imagenes,1) < 3)
    RETURNING imagenes
  `;
  const r = await pool.query(q, [portfolioId, imageUrl]);
  if (r.rowCount === 0) throw new Error('Máximo de imagenes alcanzado o no se encontró el usuario');
  return r.rows[0].imagenes;
}

exports.removeImageFromPortfolio = async (portfolioId, imageUrl) => {
  const q = `
    UPDATE portfolio
    SET imagenes = array_remove(imagenes, $2)
    WHERE id = $1
    RETURNING imagenes
  `;
  const r = await pool.query(q, [portfolioId, imageUrl]);
  return r.rows[0]?.imagenes;
}

