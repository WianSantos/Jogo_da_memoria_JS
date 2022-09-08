class JogoDaMemoria {
  // se mandar um objeto = {tela: 1, idade: 2, etc: 3}
  // vai ignorar o resto das propriedades e pegar somente a propriedade
  // tela
  constructor({ tela, util }) {
    this.tela = tela
    this.util = util
    // caminho do arquivo, sempre relativo ao index html
    this.heroisIniciais = [
      // ao utilizar o ctrl + D eu posso modificar outras palavras iguais a que eu quero alterar (visualCode)
      {
        img: './arquivos/spider.png', // ./arquivos/deadpool.png
        nome: 'spider'
      },
      {
        img: './arquivos/thor.png',
        nome: 'thor'
      },
      {
        img: './arquivos/hawkeye.png',
        nome: 'hawkeye'
      },
      {
        img: './arquivos/deadpool.png',
        nome: 'deadpool'
      }
    ]
    this.iconePadrao = './arquivos/padrao.png'
    this.heroisEscondidos = []
    this.heroisSelecionados = []
  }
  // para usar o this, não podemos usar o static!
  inicializar() {
    //vai pegar todas as funcoes da tela
    this.tela.atualizarImagens(this.heroisIniciais)
    // forçar a tela a usar o THIS de Jogo da memoria.
    this.tela.configurarBotaoJogar(this.jogar.bind(this))
    this.tela.configurarBotaoVerificarSelecao(this.vereficarSelecao.bind(this))
    this.tela.configurarBotaoMostrarTudo(
      this.mostrarHeroisEscondidos.bind(this)
    )
  }

  async embaralhar() {
    const copias = this.heroisIniciais
      //duplicar os itens
      .concat(this.heroisIniciais)
      // dar um id novo
      .map(item => {
        return Object.assign({}, item, { id: Math.random() / 0.5 })
      })
      // ordenar aleatoriamente.
      .sort(() => Math.random() - 0.5)

    //entar em cada item e realizar uma copia
    this.tela.atualizarImagens(copias)
    this.tela.exibirCarregando()

    const idDoIntervalo = this.tela.iniciarContador()
    // vamos esperar 3 segundo para atualizar a tela
    await this.util.timeout(3000)
    this.tela.limparContador(idDoIntervalo)
    this.esconderHerois(copias)
    this.tela.exibirCarregando(false)
  }
  esconderHerois(herois) {
    // vamos trocar a imagem de todos os herois existentes poelo icone padrão
    //usando a sintaxe ({chave: 1 }) estamos falando que vamos retornar
    // o que tiver dentro dos parenteses
    // quando nao usamos : (exemplo do id), o JS entende que o nome
    // é o mesmo do valor. EX. id: id, vira id,
    const heroisOcultos = herois.map(({ nome, id }) => ({
      id,
      nome,
      img: this.iconePadrao
    }))
    //atualizamos a tela com os herois ocultos

    this.tela.atualizarImagens(heroisOcultos)
    //guardamos os herois
    this.heroisEscondidos = heroisOcultos
  }
  exibirHerois(nomeDoheroi) {
    // vamos procurar esse heroi pelo nome em nossos heroisiniciais
    // obter somente a imagem dele
    const { img } = this.heroisIniciais.find(({ nome }) => nomeDoheroi === nome)
    // criando uma funcao na tela,. para exibir soimente o heroi selecionado.
    this.tela.exibirHerois(nomeDoheroi, img)
  }
  vereficarSelecao(id, nome) {
    const item = { id, nome }
    // vamos verificar a quantidade de herois selecionados
    // tomar uma ação, se deu certo ou não
    const heroisSelecionados = this.heroisSelecionados.length
    switch (heroisSelecionados) {
      case 0:
        // adiciona a escolha dentro da lista.
        this.heroisSelecionados.push(item)
        break
      case 1:
        //se a quantidade for 1, o usuario só pode escolher mais um
        const [opcao1] = this.heroisSelecionados
        // zerar item anterior
        this.heroisSelecionados = []
        if (opcao1.nome === item.nome && opcao1.id !== item.id) {
          //verifica se os id são diferentes para o usuario não clicar duas vezes no mesmo.
          this.exibirHerois(item.nome)
          this.tela.exibirMensagem()
          // para a execução
          return
        }

        this.tela.exibirMensagem(false)
        // fim do case
        break
    }
  }
  mostrarHeroisEscondidos() {
    // vamos pegar todos os herois da tela e colocar seu valor correto
    const heroisEscondidos = this.heroisEscondidos
    for (const heroi of heroisEscondidos) {
      const { img } = this.heroisIniciais.find(item => item.nome === heroi.nome)
      heroi.img = img
    }
    this.tela.atualizarImagens(heroisEscondidos)
  }
  jogar() {
    this.embaralhar()
  }
}
