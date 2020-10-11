/* -----------------------------------------------------------------------------
   O objetivo desse exemplo é utilizar a função callback para sincronizar a espera
   resultados de uma função antes de executar a próxima função para evitar o 
   retorno do conteúdo da como undefined.

   Como exercício iremos:
   1. obter o usuário (nome e id)
   2. obter o telefone do usuário (ddd e número) a partir do id do usuário
   3. obter o endereço do usuário (rua e número) a partir do id do usuário
-------------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
A função obterUsuário irá retornar o id e nome de um usuário.
Nesse caso estaremos simulando um acesso a uma fonte externa (DB, site, 
por exemplo), não importando nesse momento a fonte, uma vez que o objetivo é
entender o callback

Entendendo a declaração e funcionamento da função obterUsuario
1. a função obterUsuario esperará o retorno do callback, que é uma função especial do JS, pois isso garantirá que a 
   execução da próxima função, obterTelefone, só ocorra após a função obterUsuario tenha concluido, uma vez que a 
   função obterTelefone precisa do id do usuário. Sem usar esse recurso, enquanto a função obterUsuario está sendo
   executada, e ela pode levar algum tempo para obter os dados do usuário pesquisado, a função obterTelefone seria
   executada independemente e o id estaria ainda com o valor undefined, e não será possível obter o telefone do
   usuário, uma vez que é necessário um id válido
2. a função callback, retorna dois parâmetros:
   - error, caso a tentativa de obter o usuário tenha tido um insucesso
   - os dados do usuário em formato de JSON
3. e, por fim, para simular que estamos acessando alguma fonte externa para obter o usuário, estamos usando a função
   settimeout que fará com que seja aguardado algum tempo para que a função em execução termine, simulando, portanto,
   um "tempo" de acesso e retorno àlguma fonte externa
-------------------------------------------------------------------------------- */
function obterUsuario(callback){
    setTimeout(function(){return callback(null, {id: 1, nome: 'Aladin'})},1000)
}

/* -----------------------------------------------------------------------------
A função obterTelefoneUsuario irá passar a parâmetro idUsuario e a função de callback, retornando o erro como null,
e o ddd e o numero do usuario

É importante destacar que é a função callback é sempre o último parâmetro da função
-------------------------------------------------------------------------------- */
function obterTelefoneUsuario(idUsuario, callback){
    setTimeout(function(){return callback(null, {ddd: 31, numero: 4444})},1000)
}


/* -----------------------------------------------------------------------------
A função obterEnderecoUsuario irá passar a parâmetro idUsuario e a função de callback, retornando o erro como null,
e a rua e o numero

É importante destacar que é a função callback é sempre o último parâmetro da função
-------------------------------------------------------------------------------- */
function obterEnderecoUsuario(idUsuario, callback){
    setTimeout(function(){return callback(null, {rua: 'rua do usuário', numero: 33})},1000)
}


/* -----------------------------------------------------------------------------
Sincronizando a execução das funções obterUsuario, obterTelefone e obterEndereco, usando o recurso de callback
-------------------------------------------------------------------------------- */
obterUsuario(
                function obtemInfoUsuario(erroUsuario,infoUsuario){
                    if(erroUsuario){
                        /* se errousuario = true, ou seja, retorno erro diferente de null por não conseguiu obter o usuário 
                        desejado, apresenta uma mensagem de erro e encerra a execução da função, pois não faz sentido seguir
                        a execução em frente uma vez que para obter o telefone é necessário um id de usuário */
                        console.error('Nao conseguiu obter usuário',erroUsuario)
                        return;
                    }
                    // exibe informações do usuário: nome e id
                    console.log(`Nome: ${infoUsuario.nome} Id: ${infoUsuario.id}`)
                    
                    /* como conseguiu obter um usuário, a sequência é obter o telefone do usuário e para isso a função
                       obterTelefoneUsuario é executada, seguindo os mesmos preceitos da função obterUsuario */
                    obterTelefoneUsuario(infoUsuario.id,
                                            function obtemTelefoneUsuario(erroTelefone,telefoneUsuario){
                                                if(erroTelefone){
                                                    // verifica se retornou algum erro, apresenta mensagem de erro e encerra a execução
                                                    console.error('Não conseguiu obter telefone do usuário',erroTelefone);
                                                    return;
                                                }
                                                // exibe informações do telefone do usuário: ddd e número
                                                console.log(`Telefone: (${telefoneUsuario.ddd})${telefoneUsuario.numero}`)

                                                // Na sequência executar a função obterEndereçoUsuario, usando a mesma lógica do callback
                                                obterEnderecoUsuario(infoUsuario.id,
                                                                        function obtemEnderecoUsuario(erroEndereco,enderecoUsuario){
                                                                            if(erroEndereco){
                                                                                console.error('Não conseguiu obter endereço do usuário',erroEndereco);
                                                                                return;
                                                                            }
                                                                            // exive informações do endereço do usuário: rua e número
                                                                            console.log(`Endereço: ${enderecoUsuario.rua},${enderecoUsuario.numero}`)
                                                                        }
                                                )

                                            }
                                        )
                }
            )