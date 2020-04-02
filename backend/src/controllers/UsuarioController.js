const connection = require('../database/connection');
const generateUniqueId = require('../../utils/generateUniqueId');

module.exports = {

  async cadastrar(req, res) {
    const { nome, login, senha } = req.body;

    try {

      const usuario = await connection('usuario')
        .where('login', login)
        .select('login')
        .first();

      if (usuario) {
        return res.json({ error: 'Usuário já cadastrado com esse login' });
      }

      const id = generateUniqueId();

      await connection('usuario').insert({
        id,
        nome,
        login,
        senha
      });

      return res.json({ 'id': id, 'login': login });

    } catch (err) {
      return res.json({ error: 'Falha ao cadastrar o usuário.', mensage: err })
    }
  },

  async editar(req, res) {
    const id = req.headers.authorization;
    const { nome, login, senha, setor } = req.body;

    try {

      await connection('usuario')
        .where('id', id)
        .update({
          'nome': nome,
          'login': login,
          'senha': senha
        });

      return res.json({ atualizado: id, login: login });

    } catch (err) {
      return res.json({ error: 'Falha ao atualizar o usuário.', message: err })
    }
  }
}