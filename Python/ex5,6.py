'''Se a lista bilhete é igual à lista loteria, exiba 'Você ganhou!'; se não, exiba
'Melhor sorte da próxima vez…'.'''

bilhete = [1, 2, 3, 4, 5, 6]  # Substitua pelos números do bilhete
loteria = [6, 5, 4, 3, 2, 1]  # Substitua pelos números sorteados na loteria

if bilhete == loteria:
    print('Você ganhou!')
else:
    print('Melhor sorte da próxima vez…')