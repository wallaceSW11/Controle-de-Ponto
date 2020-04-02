import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';


export default function Logon() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();


  async function logar(e) {
    e.preventDefault();

    try {
      const res = await api.post('login', { login, senha })
      console.log(res);


      // localStorage.setItem('usuario_id', res.data.id);
      // localStorage.setItem('login', login);

      history.push('horario')

    } catch (err) {
      alert('Falha no login' + err)
    }

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