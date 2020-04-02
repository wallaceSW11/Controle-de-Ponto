import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';



export default function Horario() {
  const [entrada, setEntrada] = useState('');
  const [almoco, setAlmoco] = useState('');
  const [retorno, setRetorno] = useState('');
  const [saida, setSaida] = useState('');
  const history = useHistory();

  const login = localStorage.getItem('usuario_login');
  const data = RetornaDataHoraAtual();

  async function cadastrar(e) {
    return true
  }

  function logout() {
    localStorage.clear();
    history.push('/');
  }

  function RetornaDataHoraAtual() {
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear();
    return localdate;
  }

  return (
    <div className="horario-container">
      <header>
        <h1>Controle de ponto</h1>
        <button onClick={logout}>Sair</button>
        <span>{login}</span>
      </header>

      <span id="dt">Data: {data}</span>

      <div className="horario-inputs">
        <input
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
      </div>
      <button onClick={() => cadastrar}>Cadastrar</button>

    </div>
  )
}

