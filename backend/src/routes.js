const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const LoginController = require('./controllers/LoginController');
const HorarioController = require('./controllers/HorarioController');
const UsuarioController = require('./controllers/UsuarioController');

const data_invalida = 'Data inválida. Esperado: aaaa-mm-dd';

const routes = express.Router();

routes.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    login: Joi.string().required().min(2).max(20).label('Digite de 2 a 20 caracteres para o login'),
    senha: Joi.string().required().min(6).max(12).label('A senha precisa ter de 6 a 12 caracteres.')
  })
}), LoginController.logar);

routes.get('/horario/consultar', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string().required().min(6).max(12).label('Não foi informado o ID do usuário.'),
    data: Joi.string().required().label(data_invalida)
  }).unknown()
}), HorarioController.consultar);


routes.post('/horario/cadastrar', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().label('Não foi informado o ID do usuário')
  }).unknown(),
  [Segments.BODY]: Joi.object().keys({
	id: Joi.string().allow(''),  
    data: Joi.string().label(data_invalida),
    entrada: Joi.string().label('Hora de entrada no formato inválido. Esperado: 00:00'),
    almoco: Joi.string().allow(''),
    retorno: Joi.string().allow(''),
    saida: Joi.string().allow(''),
	atraso: Joi.string().allow(''),
	hora_extra: Joi.string().allow(''),
  })
}), HorarioController.cadastrar);

routes.post('/horario/relatorio', celebrate({
  [Segments.BODY]: Joi.object().keys({
    data_inicial: Joi.string().required().label(data_invalida),
    data_final: Joi.string().required().label(data_invalida),
    usuarios_id: Joi.array().items().allow('')
  })
}), HorarioController.relatorio);


routes.post('/usuario/cadastrar', celebrate({
  [Segments.BODY]: Joi.object({
    nome: Joi.string().required().min(2).max(50).label('O nome precisa ter no mínimo 2 caracteres e no máximo 50'),
    login: Joi.string().required().min(2).max(20).label('O login precisa ter no mínimo 2 caracteres e no máximo 20'),
    senha: Joi.string().required().min(6).max(12).label('A senha precisa ter no mínimo 6 caracteres e no máximo 12')
  })
}), UsuarioController.cadastrar);

routes.put('/usuario/editar', celebrate({
  [Segments.BODY]: Joi.object({
    nome: Joi.string().required().min(2).max(50).label('O nome precisa ter no mínimo 2 caracteres e no máximo 50'),
    login: Joi.string().required().min(2).max(20).label('O login precisa ter no mínimo 2 caracteres e no máximo 20'),
    senha: Joi.string().required().min(6).max(12).label('A senha precisa ter no mínimo 6 caracteres e no máximo 12')
  })
}), UsuarioController.editar);

module.exports = routes;
