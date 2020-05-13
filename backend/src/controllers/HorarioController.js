const connection = require('../database/connection');
const generateUniqueId = require('../../utils/generateUniqueId');
const horarioUtils = require('../../utils/horarioUtils');

function consultarHorario(usuario_id, data) {
  return connection('horario')
    .where('usuario_id', usuario_id)
    .andWhere('data', data)
    .select(['id', 'data', 'entrada', 'almoco', 'retorno', 'saida', 'atraso', 'hora_extra'])
    .first();
}

module.exports = {
  async consultar(req, res) {
    const usuario_id = req.headers.authorization;
    const data = req.headers.data;

    return res.json(await consultarHorario(usuario_id, data));
  },

  async cadastrar(req, res) {
    const { data, entrada, almoco, retorno, saida } = req.body;
    const usuario_id = req.headers.authorization;

    let horariosParaCadastrar = {
      entrada,
      almoco,
      retorno,
      saida,
      atraso: '00:00',
      hora_extra: '00:00',
      previsao_saida: '00:00',
      intervalo_almoco: '00:00'
    };

    if (!!entrada && !!almoco && !!retorno) {
      horariosParaCadastrar.previsao_saida = horarioUtils.obterPrevisaoSaida(horariosParaCadastrar);
    }

    if (!!entrada && !!almoco && !!retorno && !!saida) {
      const cargaHoraria = horarioUtils.obterCargaHoraria(horariosParaCadastrar);
      horariosParaCadastrar.atraso = horarioUtils.obterAtraso(cargaHoraria);
      horariosParaCadastrar.hora_extra = horarioUtils.obterHoraExtra(cargaHoraria);
    }



    try {
      const horarioDoBanco = await connection('horario')
        .where({
          'usuario_id': usuario_id,
          'data': data
        })
        .first('id', 'data');

      if (horarioDoBanco) {
        await connection('horario')
          .where('id', '=', horarioDoBanco.id)
          .update({
            entrada,
            almoco,
            retorno,
            saida,
            'atraso': horariosParaCadastrar.atraso,
            'hora_extra': horariosParaCadastrar.hora_extra
          });

        return res.json(await consultarHorario(usuario_id, data));
      }
    } catch (err) {
      return res.json({ error: 'Falha na atualização do horário.', message: err.message })
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
          'atraso': horariosParaCadastrar.atraso,
          'hora_extra': horariosParaCadastrar.hora_extra
        });

      return res.json(await consultarHorario(usuario_id, data));
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


