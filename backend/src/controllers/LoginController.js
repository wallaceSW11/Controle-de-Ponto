const connection = require('../database/connection');

module.exports = {
  async logar(req, res) {
    const { login, senha } = req.body;

    const usuario = await connection('usuario')
      .where({
        'login': login,
        'senha': senha
      })
      .select('id', 'login')
      .first();

    if (!usuario) {
      return res.status(400).json({ error: 'Login ou senha inválidos.' });
    }

    return res.json({ 'id': usuario.id, 'login': usuario.login });
  }
}