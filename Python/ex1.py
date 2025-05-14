altura = input("Digite a sua altura:")
sexo = input("Digite seu sexo (m) para masculino e (f) para feminino")

alt = float(altura)

if sexo == 'm':
    peso = (72.7 * alt) - 58

else:
    peso = (62.1 * alt) - 44.7


print("O seu peso ideal é ",peso)