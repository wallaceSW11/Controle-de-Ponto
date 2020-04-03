import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';


export default function Logon() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();


  async function logar(e) {
    e.preventDefault();

    await api.post('login', { login, senha })
      .then((response) => {
        localStorage.setItem('usuario_id', response.data.id);
        localStorage.setItem('usuario_login', response.data.login);
        history.push('horario');
      })
      .catch((error) => {
        alert("Falha no login. Mensagem oginal:\n" + error.response.data.message);
      })
  }

  return (
    <div className="login-container">
      <section className="login-form">
        <form onSubmit={logar}>
          <input
            placeholder="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <button className="button" type="submit">Acessar</button>

          <span>É novo por aqui ?
          <Link className="novo-acesso" to="/novousuario">
              Cadastre se!</Link>
          </span>
        </form>
      </section>
    </div>

  )
}