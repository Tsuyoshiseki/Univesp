'''Se pelo menos uma das variáveis booleanas norte, sul, leste e oeste for True,
exiba 'Posso escapar.'.'''

# Solicitar ao usuário que insira os valores
norte = bool(int(input("Digite 1 para 'True' ou 0 para 'False' para 'norte': ")))
sul = bool(int(input("Digite 1 para 'True' ou 0 para 'False' para 'sul': ")))
leste = bool(int(input("Digite 1 para 'True' ou 0 para 'False' para 'leste': ")))
oeste = bool(int(input("Digite 1 para 'True' ou 0 para 'False' para 'oeste': ")))

def verificar_escapar(norte, sul, leste, oeste):
    if norte or sul or leste or oeste:
        return 'Posso escapar.'
    else:
        return 'Não posso escapar.'

# Verificar se é possível escapar
resultado = verificar_escapar(norte, sul, leste, oeste)
print(resultado)