export const estaLogado = () => {
  const usuario_id = localStorage.getItem('usuario_id');
  // const ongName = localStorage.getItem('ongName');

  return !!usuario_id;
}

export default estaLogado;