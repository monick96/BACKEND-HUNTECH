const pool = require("../dataBase/conexionPostgres");

//este es el único que hice a mano y el único que funciona.
exports.getPortfolioById = async (email) => {
  const q = `SELECT * FROM portfolio where id IN
                (SELECT portfolio_id FROM desarrollador_x_portfolio WHERE desarrollador_email= $1)`;
  const r = await pool.query(q, [email]);
  return r.rows[0];
};

exports.checkIfPorfolioCreated = async (email) => {
  try {
    const query = `
        SELECT EXISTS (SELECT portfolio_id FROM desarrollador_x_portfolio WHERE desarrollador_email = $1)
        AS existe;
    `;

    const values = [email];
    const result = await pool.query(query, values);

    return result.rows[0].existe;

  } catch (error) {
    
    console.error(
      "REPOSITORY - Error al chequear si existe portfolio para ese usuario: " +
      error
    );

    throw Error(error.message);
  }
}


 // para imagenes: 

//titulo1, titulo2, titulo3, descripcion1... imagenes1... cada "imagenes" es un array de hasta 3 strings.
exports.createPortfolio = async (email, portfolio) => {
  const q = `WITH nuevo_portfolio AS (
            INSERT INTO portfolio 
            (titulo1, titulo2, titulo3, descripcion1, descripcion2, descripcion3, imagenes1, imagenes2, imagenes3, repositorio1, repositorio2, repositorio3)
             VALUES ($1, $2, $3, $4, $5, $6, (ARRAY[$7, $8, $9]), (ARRAY[$10, $11, $12]), (ARRAY[$13, $14, $15]), $16, $17, $18) 
             RETURNING
             id, titulo1, titulo2, titulo3, descripcion1, descripcion2, descripcion3, imagenes1, imagenes2, imagenes3, repositorio1, repositorio2, repositorio3, created_at 
            ),
            asociar_desarrollador AS (
            INSERT INTO desarrollador_x_portfolio (desarrollador_email, portfolio_id)
            SELECT $19, id 
            FROM nuevo_portfolio
            )
            select * from nuevo_portfolio;`;
            
  const values = [
    portfolio.titulo1 || "",
    portfolio.titulo2 || "",
    portfolio.titulo3 || "",
    portfolio.descripcion1 || "",
    portfolio.descripcion2 || "",
    portfolio.descripcion3 || "",
    (portfolio.imagenes1 || [])[0] || "",
    (portfolio.imagenes1 || [])[1] || "",
    (portfolio.imagenes1 || [])[2] || "",
    (portfolio.imagenes2 || [])[0] || "",
    (portfolio.imagenes2 || [])[1] || "",
    (portfolio.imagenes2 || [])[2] || "",
    (portfolio.imagenes3 || [])[0] || "",
    (portfolio.imagenes3 || [])[1] || "",
    (portfolio.imagenes3 || [])[2] || "",
    portfolio.repositorio1 || "",
    portfolio.repositorio2 || "",
    portfolio.repositorio3 || "",
    email
  ];

  const r = await pool.query(q, values);
  return email
};

//y de acá en más asumo que todo hay que reescribirlo.

exports.getImageCountForPortfolioForUpdate = async (portfolioId) => {
  // bloquea la row para evitar race conditions
  const q = `SELECT imagenes FROM portfolio WHERE id = $1 FOR UPDATE`;
  const r = await pool.query(q, [portfolioId]);
  const arr = r.rows[0]?.imagenes || [];
  return arr.length;
};

exports.appendImageToPortfolio = async (portfolioId, imageUrl) => {
  const q = `
    UPDATE portfolio
    SET imagenes = array_append(imagenes, $2)
    WHERE id = $1 AND (array_length(imagenes,1) IS NULL OR array_length(imagenes,1) < 3)
    RETURNING imagenes
  `;
  const r = await pool.query(q, [portfolioId, imageUrl]);
  if (r.rowCount === 0)
    throw new Error("Máximo de imagenes alcanzado o no se encontró el usuario");
  return r.rows[0].imagenes;
};

exports.removeImageFromPortfolio = async (portfolioId, imageUrl) => {
  const q = `
    UPDATE portfolio
    SET imagenes = array_remove(imagenes, $2)
    WHERE id = $1
    RETURNING imagenes
  `;
  const r = await pool.query(q, [portfolioId, imageUrl]);
  return r.rows[0]?.imagenes;
};
