const connection = require('../database/connection');
const generateUniqueId = require('../../utils/generateUniqueId');

module.exports = {

  // function calcularHoraExtraAtraso() {
  //   const hora = almoco.substr(0, 2);
  //   const minuto = almoco.substr(3, 2);
  //   const hora1 = entrada.substr(0, 2);
  //   const minuto1 = entrada.substr(3, 2);
  //   const hora2 = saida.substr(0, 2);
  //   const minuto2 = saida.substr(3, 2);
  //   const hora3 = retorno.substr(0, 2);
  //   const minuto3 = retorno.substr(3, 2);
  //   const calc = hmh.diff(`${hora1}h ${minuto1}m`, `${hora}h ${minuto}m`);
  //   const calc1 = hmh.diff(`${hora3}h ${minuto3}m`, `${hora2}h ${minuto2}m`);
  //   const total = hmh.sum(calc + calc1);
  //   const final = hmh.diff('8h 0m ', `${total.h}h ${total.m}m`);
  //   const formatado = (!final.h ? '00' : final.h) + ':' + final.m;

  //   console.log('he: ' + hora_extra + ' f: ' + formatado);

  //   if (final.isNegative) {
  //     setAtraso(formatado);
  //     console.log('setei atraso: ' + atraso);

  //   } else {
  //     setHora_extra(formatado);
  //     console.log('setei hora extra: ' + hora_extra + ' formatado: ' + formatado);
  //   }
  // }




  async consultar(req, res) {
    const usuario_id = req.headers.authorization;
    const data = req.headers.data;

    const horario = await connection('horario')
      .where('usuario_id', usuario_id)
      .andWhere('data', data)
      .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
      .first();

    return res.json(horario);
    // if (!horario) {
    //   return res.json({ erro: 'Horário não localizado.' });
    // } else {
    //   return res.json(horario);
    // }
  },


  async cadastrar(req, res) {
    const { data, entrada, almoco, retorno, saida } = req.body;
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
            'atraso': '00:00',
            'hora_extra': '00:00'
          });
        return res.json(horario);
      }
    } catch (err) {
      return res.json({ error: 'Falha na consulta do horário.', message: err.message })
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
          'atraso': '00:00',
          'hora_extra': '00:00'
        });

      const horario_cadastrado = await connection('horario')
        .where('id', horario_id)
        .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
        .first();

      return res.json({ status: 'cadastrado', horario: horario_cadastrado });
    }
    catch (err) {
      return res.json({ error: 'Falha no cadastro do horário.', message: err.message })
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
      return res.json({ error: 'Falha na consulta do relatório.', message: err.message })
    }
  }
}


