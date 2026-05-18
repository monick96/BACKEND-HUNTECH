// Debe reemplazarse por tu auth real (JWT, session, etc).
export async function requireAuth(req, res, next) {
  try {
    // Ejemplo: req.headers.authorization = "Bearer <token>"
    // Decodificar token y setear req.user = { email: 'dev@example.com' }
    // Aquí asumimos que el email viene en header para simplificar:
    const email = req.headers['x-user-email'];
    if (!email) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { email };
    next();
  } catch (err) {
    next(err);
  }
}