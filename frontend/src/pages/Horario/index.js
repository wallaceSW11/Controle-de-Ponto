import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

export default function Horario() {
  const [entrada, setEntrada] = useState('');
  const [almoco, setAlmoco] = useState('');
  const [retorno, setRetorno] = useState('');
  const [saida, setSaida] = useState('');
  const { data, setData } = useState('');

  async function cadastrar(e) {
    return (e => setData("i"))
  }



  return (
    <div className="horario-container">
      <header>
        <h1>Controle de ponto</h1>
      </header>

      <span id="dt">Data: {data}</span>

      <div className="horario-inputs">
        <input
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

