# Uso do Mermaid para representação de ideias do livro de Urântia

[Mermaid](https://mermaid.js.org) é código aberto e gratuito para uso por qualquer pessoa, inclusive para fins comerciais.

## 🧾 Detalhes:

- **Licença**: MIT License  
  - Isso significa que você pode **usar, copiar, modificar, distribuir** e até incorporar em projetos comerciais **sem custo**.
  - Só é necessário manter o aviso de copyright e a licença.
- [Link para a documentação](https://mermaid.js.org/intro/)
- [Link para o código aberto](https://github.com/mermaid-js/mermaid)

### 🧩 Uso:

- Podemos usar para representar ideias e conceitos presentes no **Livro de Urântia** de modo muito simples.
- Suporte nativo em muitas plataformas como GitHub, Obsidian, Notion, VS Code (via extensões), etc.

## Como ler um diagrama de sequência

Leia de cima para baixo como no exemplo abaixo sobre a consciência da 

- **Objetos/Participantes**: estão no topo, representados por retângulos com nomes. Cada um tem uma **linha de vida** vertical.
- **Mensagens**: são setas horizontais entre as linhas de vida, indicando chamadas de métodos ou troca de mensagens. A ordem é de cima pra baixo (sequência temporal).
- **Setas cheias**: chamada de método ou envio de mensagem.  
- **Setas tracejadas**: retorno de chamada.  
- **Retângulos sobre a linha de vida**: indicam ativação (período em que o objeto está executando algo).
- **Loops, condições ou blocos alternativos**: aparecem com molduras (caixas retangulares com rótulos como `loop`, `alt`, `opt` etc.).

## Consciência da alma

Segue um resumo de como representar cada elemento do **diagrama de sequência UML** usando **Mermaid**:

Processo que se inicia num ser humano já com algum desenvolvimento espiritual até a chegada de novos potenciais na consciência da alma e sua subsequente atualização ou realização-parcial:

intelectual, moroncial, espiritual e pessoal - a consciência da mente, da alma e do espírito e a unificação delas na personalidade.

```mermaid
sequenceDiagram

   participant Supremo
   participant Ajustador
   participant Alma
   participant Mente
   actor Humano

   loop cada item
        Ajustador->>Humano: Humano(Conquista)
        Alma->>Ajustador: Deseja
        Note over Alma: Na medida em que espiritualmente se desenvolveu
        Ajustador->>Alma: Ajustador inspira uma atitude
        Alma->>Mente: Aceita e pede autorização
        Mente->>Humano: Aceita e pede autorização
        Humano-->>Ajustador: Autoriza
        Ajustador-->>Supremo: Busca um potencial
        Note over Ajustador: Capacidade única de aceder ao Supremo
        Supremo->>Ajustador: Informa um potencial
        Ajustador->>Alma: Sugere ações
        Alma-->>Alma: Consciência da alma
        Note over Alma: Consciência da alma - a realização do ideal de Deus
        Alma->>Mente: Quando consegue ser ouvida
        Mente->>Humano: Deseja
        Note over Humano: Potencial em atualização
   end
```

---

## Adoração

O processo de adoração é iniciado por um desejo da alma depois de mobilizar todos os poderes da personalidade humana (**<a href="javascript:showParagraph(5,3,7)" title="Abrir o parágrafo 5:3-7">5:3-7</a>**) sob domínio dela e é descrito como **"A mente mortal consente em adorar; a alma imortal anseia pela adoração e a inicia; a presença do Ajustador divino conduz essa adoração em nome da mente mortal e da alma imortal em evolução."** (**<a href="javascript:showParagraph(5,3,8)" title="Abrir o parágrafo 5:3-8">5:3-8</a>**).


   participant Ajustador
   Note over Ajustador: Espiritual
   participant Alma
   Note over Alma: Moroncial
   participant Mente
   Note over Mente: Intelectual
   actor Humano


```mermaid
   sequenceDiagram
   participant Pai
   participant Ajustador
   Note over Ajustador: Espiritual
   participant Alma
   Note over Alma: Moroncial
   participant Mente
   Note over Mente: Intelectual
   actor Pessoa
   Note over Pessoa: Personalidade

    activate Alma
    Alma-->>Alma: Mobilização dos poderes da personalidade
    Alma->>Mente: Deseja
    Note over Alma,Mente: A alma comunica o desejo<br/>A mente consegue entender 
    deactivate Alma
    activate Mente
    Mente->>Ajustador: Desejo autorizado
    deactivate Mente
    activate Ajustador
    Ajustador->>Pai: Conduz
    Note over Ajustador,Pai: Ajustador conduz<br/>em nome da mente e da alma
    deactivate Ajustador
    Mente-->>Pai: Adoração
```

---

## Exemplos

### 🧍 Participantes / Objetos

```mermaid
sequenceDiagram
    participant A
    participant B
```

### ➡️ Mensagens (chamada de método)

```mermaid
sequenceDiagram
    A->>B: chama método()
```

- `->>` é uma chamada síncrona  
- `-->>` é uma chamada assíncrona  

### 🔁 Retorno de chamada

```mermaid
   sequenceDiagram
   B-->>A: resultado
```

### 🔳 Ativação (implícita com chamadas)

Mermaid mostra barras de ativação automaticamente com chamadas síncronas (`->>`).

---

### 🔁 Loop

```mermaid
sequenceDiagram
    loop cada item
        A->>B: processa(item)
    end
```

---

### 🔀 Alternativa (condicional)

```mermaid
sequenceDiagram
    alt condição verdadeira
        A->>B: faz algo
    else condição falsa
        A->>B: faz outra coisa
    end
```

---

### ❓ Opção (tipo if sem else)

```mermaid
sequenceDiagram
    opt se permitido
        A->>B: executa ação
    end
```

---



```mermaid
                        classDiagram
                        Class01 <|-- AveryLongClass : Cool
                        Class03 *-- Class04
                        Class05 o-- Class06
                        Class07 .. Class08
                        Class09 --> C2 : Where am I?
                        Class09 --* C3
                        Class09 --|> Class07
                        Class07 : equals()
                        Class07 : Object[] elementData
                        Class01 : size()
                        Class01 : int chimp
                        Class01 : int gorilla
                        Class08 <--> C2: Cool label
```
---
title: Simple sample

```mermaid
stateDiagram-v2
    [*] --> Ajustador
    Ajustador --> [*]

    Ajustador --> Humano
    Humano --> Still
    Humano --> Crash
    Crash --> [*]
```

---
title: Order example

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```

### Criando e removendo participantes

```mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you ?
    Bob->>Alice: Fine, thank you. And you?
    create participant Carl
    Alice->>Carl: Hi Carl!
    create actor D as Donald
    Carl->>D: Hi!
    destroy Carl
    Alice-xCarl: We are too many
    destroy Bob
    Bob->>Alice: I agree
```
