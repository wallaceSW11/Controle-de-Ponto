const connection = require('../database/connection');
const generateUniqueId = require('../../utils/generateUniqueId');

module.exports = {
  async consultar(req, res) {
    const usuario_id = req.headers.authorization;
    const data = req.headers.data;

    const horario = await connection('horario')
      .where('usuario_id', usuario_id)
      .andWhere('data', data)
      .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
      //.count('id', { as: 'qt' });
	  .first();

	if (!horario) {
	  return res.status(400).json({ error: 'Horário não localizado.' });
	} else {
      return res.json(horario);
	} 
    },
    //if (horarios[0].qt === 0) {
    //  return res.status(400).json({ error: 'Horário não localizado.' });
    //} else {
     // return res.json(horarios);
    //}
  

  async cadastrar(req, res) {
    const { data, entrada, almoco, retorno, saida, atraso, hora_extra } = req.body;
    const usuario_id = req.headers.authorization;	

    try {
      const horario = await connection('horario')
        .where({
          'usuario_id': usuario_id,
          'data': data
        })
        .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
        .first();

      if (horario) {
        await connection('horario')
          .where('id', '=', horario.id)
          .update({
            'entrada': entrada,
            'almoco': almoco,
            'retorno': retorno,
            'saida': saida,
			'atraso': atraso,
			'hora_extra': hora_extra
          });

        //return res.json({ status: 'atualizado', 'horario': horario });
		return res.json(horario);
      }

    } catch (err) {
      return res.json({ error: 'Falha na consulta do horário.', message: err })
    }

    try {

      const horario_id = generateUniqueId();

      await connection('horario')
        .insert({
          'id': horario_id,
          usuario_id,
          data,
          entrada,
          almoco,
          retorno,
          saida,
		  atraso,
		  hora_extra
        });

      const horario_cadastrado = await connection('horario')
        .where('id', horario_id)
        .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
        .first();

      return res.json({ status: 'cadastrado', horario: horario_cadastrado });
    }
    catch (err) {
      return res.json({ error: 'Falha no cadastro do horário.', message: err })
    }
  },

  async relatorio(req, res) {
    const { data_inicial, data_final, usuarios_id } = req.body;
    const { page = 1 } = req.query;

    try {
      const [count] = await connection('horario')
        .join('usuario', 'usuario.id', '=', 'horario.usuario_id')
        .where('data', '>=', data_inicial)
        .andWhere('data', '<=', data_final)
        .andWhere(function () {
          if (!usuarios_id) {
            this.where('horario.usuario_id', '<>', '')
          } else {
            this.where('horario.usuario_id', 'in', [usuarios_id])
          }
        })
        .count();

      const relatorio = await connection('horario')
        .limit(5)
        .offset((page - 1) * 5)
        .join('usuario', 'usuario.id', '=', 'horario.usuario_id')
        .where('data', '>=', data_inicial)
        .andWhere('data', '<=', data_final)
        .andWhere(function () {
          if (!usuarios_id) {
            this.where('horario.usuario_id', '<>', '')
          } else {
            this.where('horario.usuario_id', 'in', [usuarios_id])
          }
        })
        .select([
          'usuario.login',
          'horario.id',
          'horario.data',
          'horario.entrada',
          'horario.almoco',
          'horario.retorno',
          'horario.saida',
          'horario.atraso',
          'horario.hora_extra',
        ]);

      res.header('X-Total-Count', count['count(*)']);
      return res.json(relatorio);

    } catch (err) {
      return res.json({ error: 'Falha na consulta do relatório.', message: err })
    }
  }
}


