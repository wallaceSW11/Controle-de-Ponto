import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

export default function Horario() {
  const [dataAtualizacao, setDataAtualizacao] = useState('');
  const [data, setData] = useState('');
  const [entrada, setEntrada] = useState('-----');
  const [almoco, setAlmoco] = useState('-----');
  const [retorno, setRetorno] = useState('-----');
  const [saida, setSaida] = useState('-----');
  const [atraso, setAtraso] = useState('00:00');
  const [hora_extra, setHora_extra] = useState('00:00');

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
        setData(dataAtual());
        setAtraso('00:00');
        setHora_extra('00:00');
      })
  }, [entrada, usuario_id]);

  async function cadastrar(e) {
    e.preventDefault();

    if (!entrada) {
      return alert('Por favor, informe o horário de entrada.')
    }

    const horarios = {
      data: dataInvertida(data),
      entrada,
      almoco,
      retorno,
      saida
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

  /*   ----- HTML ------- */

  return (
    <div className="horarioAutomatico-container">
      <header>
        <h1>Controle de ponto</h1>
      </header>
      <section>
        <div className="quadroHorarios">

          <div className="dataHorario">
            <h3>Data: {data}</h3>
          </div>

          <div className="horarios">
            <div className="entrada">Entrada: {entrada}</div>
            <div className="almoco">Almoço: {almoco}</div>
            <div className="retorno">Retorno: {retorno}</div>
            <div className="saida">Saída: {saida}</div>
          </div>

          <div className="dadosComplementares">
            <div className="intervaloAlmoco">Intervalo almoço: 01:12 </div>
            <div className="cargaHoraria">Carga horária: 08:12</div>
            <div className="atraso">Atraso: {atraso}</div>
            <div className="horaExtra">Hora extra: {hora_extra}</div>
          </div>
        </div>
        <section>
          <div className="marcarPonto">
            <button className="button" type="submit">Marcar ponto</button>
          </div>
          <div className="editarPonto">
            <a href="#">Editar ponto</a>
          </div>
        </section>


      </section>

    </div>
  )
}


{/* <header>
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
          <input
            id="horarioEntrada"
            name="horarioEntrada"
            autoFocus
            placeholder="Entrada"
            value={entrada}
            onChange={e => setEntrada(e.target.value)}
          />

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

          <button className="button">Cadastrar</button>

        </form>


      </div>
      <div className="resumo-dia">
        <div className="hora-extra-dia">
          <p>Hora extra: {hora_extra}</p>
        </div>
        <div className="atraso-dia">
          <p>Atraso: {atraso}</p>
        </div>

      </div> */}

