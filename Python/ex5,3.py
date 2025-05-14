'''Se golpes é maior que 10 e defesas é 0, exiba 'Você está morto…'.'''

golpes = eval(input("Escreva o valor do golpe: "))

defesa = eval(input("Escreva o valor da defesa: "))

if golpes > 10 and defesa == 0:
    print("Você está morto…")

else:
    print("Você está vivo")