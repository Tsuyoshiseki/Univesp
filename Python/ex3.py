a = float(input("Insira o lado a: "))
b = float(input("Insira o lado b: "))
c = float(input("Insira o lado c: "))

maior_lado = max(a, b, c)

if maior_lado < a + b + c - maior_lado:
    print("Os lados formam um triângulo")

    if a == b and b == c and c == a:
        print("Triângulo equilátero")

    elif a != b and b != c and a != c:
        print("Triângulo escaleno")

    else:
        print("Triângulo isósceles")

else:
    print("Os lados não formam um triângulo")