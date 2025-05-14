'''Implemente um programa que comece pedindo ao usuário para digitar uma identificação
de login (ou seja, uma string). O programa, então, verifica se a identificação
informada pelo usuário está na lista ['joe', 'sue', ' hani', 'sophie' ] de usuários
válidos. Dependendo do resultado, uma mensagem apropriada deverá ser impressa. Não
importando o resultado, sua função deverá exibir 'Fim.' antes de terminar.
Aqui está um exemplo de um login bem-sucedido:
  
>>>
Login: joe
Você entrou!
Fim.

E aqui está um que não tem sucesso:

>>>
Login: john
Usuário desconhecido.
Fim.'''

lista = ['joe', 'sue', ' hani', 'sophie' ]

nome = input("Insira o login: ")

if nome in lista:
    print("Você está autorizado")

else:
    print("Você é mlk")

print("Fim")