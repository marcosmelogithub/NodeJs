/* ---------------------------------------------------------------------------------------------
    Este exercício é para utilizar callback, funções promise com sync e await
    como forma de fatorar o código usando somente callback como foi feito no exercício '02_callbacks'
    tornado o código mais profissional
------------------------------------------------------------------------------------------------ */
const { info } = require('console')
const { promises } = require('fs')
// importa biblioteca util interna do node.js para conseguir declarar funções promise
const util = require('util')

/* ---------------------------------------------------------------------------------------------
    1. declara a função obterInfoUsuario
    2. transforma a função obterInfoUsuario em uma função promise criando uma constante
       chamada obterInfousuarioPromise usando o método 'promisify' da biblioteca interna 'util'
       do node.js
------------------------------------------------------------------------------------------------ */ 
const obterInfoUsuarioPromise = util.promisify(obterInfoUsuario)
function obterInfoUsuario(callback){
    setTimeout(function(){return callback(null, {id: 1, nome: 'MMelo'})},1000)
}

/* ---------------------------------------------------------------------------------------------
    1. declara a função obterTelefoneUsuario
    2. transforma a função obterTelefoneUsuario em uma função promise criando uma constante
       chamada obterTelefoneUsuarioPromise usando o método 'promisify' da biblioteca interna 'util'
       do node.js
------------------------------------------------------------------------------------------------ */ 
const obterTelefoneUsuarioPromise = util.promisify(obterTelefoneUsuario)
function obterTelefoneUsuario(idUsuario, callback){
    setTimeout(function(){return callback(null, {ddd: 31, numtel: 4444})},1000)
}

/* ---------------------------------------------------------------------------------------------
    1. declara a função obterEnderecoUsuario
    2. transforma a função obterEnderecoUsuario em uma função promise criando uma constante
       chamada obterEnderecoUsuarioPromise usando o método 'promisify' da biblioteca interna 'util'
       do node.js
------------------------------------------------------------------------------------------------ */ 
const obterEnderecoUsuarioPromise = util.promisify(obterEnderecoUsuario)
function obterEnderecoUsuario(idUsuario, callback){
    setTimeout(function(){return callback(null, {rua: "nome_da_rua", numrua: 33})},1000)
}

/* ---------------------------------------------------------------------------------------------
    1. declara função main
    2. transforma a função main em uma função promise adicionando o async na frente da declaração da função
    3. executa a função main
------------------------------------------------------------------------------------------------ */ 
main()
async function main(){
    // o bloco try são para as instruções que desejamos executar
    try{
        /* obtém os dados do usuário na constante 'InfoUsuario',
           executando a função promise obterInfoUsuarioPromise precedida pelo recurso await */
        const infoUsuario = await obterInfoUsuarioPromise()
        
        /* --------------------------------------------------------------------------------
            - A execução abaixo, guardando o resultado na const 'outrosDadosUsuarioNaoPrecedentesEntreEles',
              serve para executar funções que não tem precedência entre elas.
            - Ou seja, para obter o endereço do usuário não precisa esperar obter o telefone do usuário primeiro.
            - Assim, as duas funções serão executadas simultaneamente após a função 'obterInfoUsuarioPromise', pois
              é preciso obter o id do usuário primeiro.
            - Mas, após obter o id do usuário, as funções obter telefone e obter endereço não são mais dependentes
              entre si, podendo assim serem executadas simultaneamente.
            - A const 'outrosDadosUsuarioNaoPrecedentesEntreEles' será um array com o resultado por elemento do array
              de quantas funções simultâneas forem executadas.
            - Essa prática é interessante para melhor a performance do retorno dos dados, pois ao invés de ficar
              esperando obter primeiro o telefone para depois obter o endereço, já que são funções independentes,
              os dados são obtidos em paralelo.
        ----------------------------------------------------------------------------------- */
        const outrosDadosUsuarioNaoPrecedentesEntreEles = await Promise.all([
            obterTelefoneUsuarioPromise(infoUsuario.id), obterEnderecoUsuarioPromise(infoUsuario.id)])
        
        /* ---------------------------------------------------------------------------------
            - Após obter o telefone e endereço e guarda-los no array 'outrosDadosUsuarioNaoPrecedentesEntreEles',
              basta guardar cada elemento do array em seu respectivo const, como abaixo
        ------------------------------------------------------------------------------------ */
        const telefoneUsuario = outrosDadosUsuarioNaoPrecedentesEntreEles[0]
        const enderecoUsuario = outrosDadosUsuarioNaoPrecedentesEntreEles[1]
        
        // exibe os dados do usuário, telefone e endereço
        console.log(`
                    Usuário: ${infoUsuario.nome} Id:${infoUsuario.id}
                    Telefone: (${telefoneUsuario.ddd})${telefoneUsuario.numtel}
                    Endereço: ${enderecoUsuario.rua},${enderecoUsuario.numrua}
                    `)
    }
    // o bloco catch é ativado automaticamente se algum erro ocorreu nas instruções do bloco try
    catch(error){
       console.error('Deu erro...',error)
    }
}