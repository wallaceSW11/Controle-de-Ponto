import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';
import { useEffect } from 'react';

export default function Logon() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('usuario_id')) {
      history.push('horarioAutomatico');
    }
  })

  async function logar(e) {
    e.preventDefault();

    await api.post('login', { login, senha })
      .then((response) => {
        localStorage.setItem('usuario_id', response.data.id);
        localStorage.setItem('usuario_login', response.data.login);
        history.push('horarioAutomatico');
      })
      .catch((error) => {
        alert("Falha no login. Mensagem oginal:\n" + error.response.data.message);
      })
  }

  return (
    <div className="login-container">

      <section className="login-form">

        <h1>Controle de ponto</h1>

        <form onSubmit={logar}>
          <input
            autoFocus
            placeholder="Login"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <button className="button" type="submit">Acessar</button>
        </form>
        <span>É novo por aqui?
          <Link className="novo-acesso" to="/novousuario">
            Cadastre se!</Link>
        </span>
      </section>
    </div>

  )
}