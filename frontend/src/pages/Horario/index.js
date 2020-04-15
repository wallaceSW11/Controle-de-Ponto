import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';
import hmh from 'hmh';

export default function Horario() {
  const [dataAtualizacao, setDataAtualizacao] = useState('');
  const [data, setData] = useState('');
  const [entrada, setEntrada] = useState('');
  const [almoco, setAlmoco] = useState('');
  const [retorno, setRetorno] = useState('');
  const [saida, setSaida] = useState('');
  const [atraso, setAtraso] = useState('');
  const [hora_extra, setHora_extra] = useState('');

  const history = useHistory();

  const login = localStorage.getItem('usuario_login');
  const usuario_id = localStorage.getItem('usuario_id');

  useEffect(() => {
    api.get('horario/consultar', {
      headers: {
        Authorization: usuario_id,
        data: dataParaConsulta(),
      }
    })
      .then((response) => {
        setData(dataFormatada(response.data.data));
        setEntrada(response.data.entrada);
        setAlmoco(response.data.almoco);
        setRetorno(response.data.retorno);
        setSaida(response.data.saida);
        setAtraso(response.data.atraso);
        setHora_extra(response.data.hora_extra);
      })
      .catch((response) => {
        setData(dataAtual())
        setDataAtualizacao('Atualizado em: ' + dataAtualComHorario())
      })
  }, [entrada, usuario_id]);

  async function cadastrar(e) {
    e.preventDefault();

    const hora = almoco.substr(0, 2);
    const minuto = almoco.substr(3, 2);
    const hora1 = entrada.substr(0, 2);
    const minuto1 = entrada.substr(3, 2);
    const hora2 = saida.substr(0, 2);
    const minuto2 = saida.substr(3, 2);
    const hora3 = retorno.substr(0, 2);
    const minuto3 = retorno.substr(3, 2);
    const calc = hmh.diff(`${hora1}h ${minuto1}m`, `${hora}h ${minuto}m`);
    const calc1 = hmh.diff(`${hora3}h ${minuto3}m`, `${hora2}h ${minuto2}m`);
    const total = hmh.sum(calc + calc1);
    const final = hmh.diff('8h 0m ', `${total.h}h ${total.m}m`);
    const formatado = (!final.h ? '00' : final.h) + ':' + final.m;

    setAtraso('');
    setHora_extra('');

    if (final.isNegative) {
      setAtraso(formatado);
    } else {
      setHora_extra(formatado)
    }

    const horarios = {
      data: dataInvertida(data),
      entrada,
      almoco,
      retorno,
      saida,
      atraso,
      hora_extra
    };

    await api.post('horario/cadastrar', horarios, {
      headers: {
        Authorization: usuario_id,
      }
    })
      .then((response) => {
        setDataAtualizacao('Atualizado em: ' + dataAtualComHorario())
      })
      .catch((error => {
        alert('Falha ao realizar o cadastro.\n' + error.response)
      }))
  }

  function logout() {
    localStorage.clear();
    history.push('/');
  }

  // function dataAtualHorario() {
  //   var hoje = new Date();
  //   var datacompleta = hoje.getDate() + '/' + (hoje.getMonth() + 1) + '/' + hoje.getFullYear() + ' - ' +
  //     hoje.getHours() + ':' + hoje.getMinutes() + ':' + hoje.getSeconds();
  //   return datacompleta;
  // }

  function dataParaConsulta() {
    const hoje = new Date()
    const ano = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(hoje)
    const mes = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(hoje)
    const dia = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(hoje)
    return `${ano}-${mes}-${dia}`;
  }

  function dataAtual() {
    const hoje = new Date()
    const ano = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(hoje)
    const mes = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(hoje)
    const dia = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(hoje)
    return `${dia}/${mes}/${ano}`;
  }

  function dataAtualComHorario() {
    const hoje = new Date()
    const ano = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(hoje)
    const mes = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(hoje)
    const dia = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(hoje)
    const hora = new Intl.DateTimeFormat('br', { hour: '2-digit' }).format(hoje)
    const minuto = new Intl.DateTimeFormat('br', { minute: '2-digit' }).format(hoje)
    const segundo = new Intl.DateTimeFormat('br', { second: '2-digit' }).format(hoje)
    return `${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
  }

  function dataInvertida(data) {
    return data.substr(6, 4) + '-' + data.substr(3, 2) + '-' + data.substr(0, 2);
  }
  function dataFormatada(data) {
    return data.substr(8, 2) + '/' + data.substr(5, 2) + '/' + data.substr(0, 4);
  }

  return (
    <div className="horario-container">
      <header>
        <div className="header-titulo">
          <h1>Controle de ponto</h1>
        </div>
        <div className="header-login">
          <span>{login}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <div className="dados">
        <span>Data: {data} </span>
        <span>{dataAtualizacao}</span>
      </div>

      <div className="horario-inputs">

        <form onSubmit={cadastrar}>

          {/* <input
            placeholder="Data"
            value={data}
            onChange={e => setData(e.target.value)}
            readOnly
          /> */}
          <label>Entrada:
          <input
              name="horarioEntrada"
              autoFocus
              placeholder="Entrada"
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
            />
          </label>
          <input
            placeholder="Almoço"
            value={almoco}
            onChange={e => setAlmoco(e.target.value)}
          />
          <input
            placeholder="Retorno"
            value={retorno}
            onChange={e => setRetorno(e.target.value)}
          />
          <input
            placeholder="Saída"
            value={saida}
            onChange={e => setSaida(e.target.value)}
          />
          {/* <input
            placeholder="Atraso"
            value={atraso}
            onChange={e => setAtraso(e.target.value)}
          />
          <input
            placeholder="Hora extra"
            value={hora_extra}
            onChange={e => setHora_extra(e.target.value)}
          /> */}

          <button className="button">Cadastrar</button>

        </form>
      </div>
    </div>
  )
}

