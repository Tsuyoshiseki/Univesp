'''Se o nome está na lista ['Musial', 'Aaraon', 'Williams', 'Gehrig', 'Ruth'],
exiba 'Um dos 5 maiores jogadores de beisebol de todos os tempos!'oi
.'''

lista = ['Musial', 'Aaraon', 'Williams', 'Gehrig', 'Ruth']

nome = input("Escreva um nome: ")

if nome in lista:
    print("Um dos 5 maiores jogadores de beisebol de todos os tempos!")

else:
    print("Este nome não está na lista.")