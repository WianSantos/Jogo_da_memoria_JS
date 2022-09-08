function onLoad() {
  //console.log('Carregou a tela!!', Tela, JogoDaMemoria)
  const dependencias = {
    tela: Tela,
    util: Util
  }
  // incializamos o jogo da memoria
  const jogoDaMemoria = new JogoDaMemoria(dependencias)
  jogoDaMemoria.inicializar()
}

window.onload = onLoad
