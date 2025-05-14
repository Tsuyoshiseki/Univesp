'''Se ano é divisível por 4, exiba 'Pode ser um ano bissexto.'; caso contrário,
exiba 'Definitivamente não é um ano bissexto.'''

ano = eval(input("Digite o valor do ano: "))

if ano % 4 == 0:
    print("O ano é bissexto")

else:
    print("O ano não é bissexto")