const hmh = require('hmh');

function obterHora(horario) {
  return horario.substr(0, 2);
}

function obterMinuto(horario) {
  return horario.substr(3, 2);
}

function obterHoraFormatada(horario) {
  return (!horario.h ? '00' : (horario.h.toString().length == 1 ? '0' + horario.h : horario.h))
    + ':' + (horario.m.toString().length == 1 ? '0' + horario.m : horario.m);
}

function ObterHoraParaCalculo(horarioFormatado) {
  return hmh.sum('0m' + `${obterHora(horarioFormatado)}h ${obterMinuto(horarioFormatado)}m'`);
}

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


module.exports = {

  obterCargaHoraria(horarios) {

    const cargaManha =
      hmh.diff(`${obterHora(horarios.entrada)}h ${obterMinuto(horarios.entrada)}m`,
        `${obterHora(horarios.almoco)}h ${obterMinuto(horarios.almoco)}m`, 'minutes');

    const cargaTarde =
      hmh.diff(`${obterHora(horarios.retorno)}h ${obterMinuto(horarios.retorno)}m`,
        `${obterHora(horarios.saida)}h ${obterMinuto(horarios.saida)}m`);

    const cargaHoraria = hmh.sum(cargaManha + cargaTarde);

    return obterHoraFormatada(cargaHoraria);
  },


  obterHoraExtra(cargaHorariaFormatada) {
    const cargaHoraria = ObterHoraParaCalculo(cargaHorariaFormatada);
    const diferencaMinutos = hmh.diff('8h 0m', `${cargaHoraria.h}h ${cargaHoraria.m}m`, 'minutes');
    const horaExtra = hmh.sum('0m' + diferencaMinutos);

    if ((diferencaMinutos.isNegative) || (parseInt(diferencaMinutos) < 12)) {
      return '00:00';
    } else {
      return obterHoraFormatada(horaExtra);
    }
  },

  obterAtraso(cargaHorariaFormatada) {
    const cargaHoraria = ObterHoraParaCalculo(cargaHorariaFormatada);
    const diferencaMinutos = hmh.diff('8h 0m', `${cargaHoraria.h}h ${cargaHoraria.m}m`, 'minutes');
    const atraso = hmh.sum('0m' + diferencaMinutos);

    if ((diferencaMinutos.isNegative) && (parseInt(diferencaMinutos) < -12)) {
      return obterHoraFormatada(atraso);
    } else {
      return '00:00';
    }
  }
}