# Quasar gutter utility classes

Quasar disponibiliza utilitários de "gutter" para controlar os espaçamentos horizontais e/ou verticais entre os elementos diretos de um container flex/grid, como `q-row`, `q-col`, `q-card-section`, entre outros. Eles funcionam aplicando `margin`/`padding` negativos e positivos no container e em seus filhos, evitando a necessidade de criar regras CSS manuais.

## Tabela rápida

| Classe | Direção | Espaçamento padrão* | Efeito principal |
| --- | --- | --- | --- |
| `.q-gutter-md` | Horizontal **e** vertical | `1rem` (16px) | Aplica espaçamento médio igual nas direções X e Y entre os itens filhos de um container compatível (ex.: `q-row`). |
| `.q-gutter-x-md` | Apenas horizontal | `1rem` (16px) | Aplica espaçamento médio somente no eixo X entre os itens filhos; o eixo Y permanece inalterado. |

> \* Os valores seguem o scale padrão do Quasar: `xs = 0.25rem`, `sm = 0.5rem`, `md = 1rem`, `lg = 1.5rem`, `xl = 3rem`. É possível alterar globalmente em `quasar.config` caso precise.

## Como funcionam

- **Container**: adicione a classe em um componente que aceite gutter (geralmente `q-row`, `q-card-section` ou um `div` com `class="row"`).
- **Itens filhos**: cada filho direto recebe `padding` para abrir espaço, enquanto o container recebe `margin` negativa para compensar nas bordas externas.
- **Empilhamento**: combinar `.q-gutter-md` com outros modulos, como `q-col`; o cálculo de largura já considera o espaço reservado, então não é necessário ajustar `cols` ou `span`.

## Exemplos práticos

### 1. Espaçamento em ambas direções

```vue
<q-row class="q-gutter-md">
  <q-col cols="12" md="6">
    <q-card flat>
      <q-card-section>
        Card A
      </q-card-section>
    </q-card>
  </q-col>
  <q-col cols="12" md="6">
    <q-card flat>
      <q-card-section>
        Card B
      </q-card-section>
    </q-card>
  </q-col>
</q-row>
```
- Os itens terão espaçamento de 16px tanto lateral quanto verticalmente.

### 2. Espaçamento apenas horizontal

```vue
<q-row class="q-gutter-x-md">
  <q-col cols="12" md="4">Coluna 1</q-col>
  <q-col cols="12" md="4">Coluna 2</q-col>
  <q-col cols="12" md="4">Coluna 3</q-col>
</q-row>
```
- Ideal quando deseja colunas com folga lateral, mas alinhadas verticalmente sem espaçamento extra.

## Boas práticas

1. **Evite gutters em elementos inline**: eles foram pensados para containers flex/grid.
2. **Combine com breakpoints**: use `q-gutter-md` em `q-row` e deixe o layout responsivo; o Quasar já cuida de recalcular as colunas.
3. **Não misture com margens manuais conflitantes**: verificar se o container/filho não tem `margin` adicionada manualmente, para não somar espaçamentos indesejados.
4. **Personalização**: se precisar de outro valor, é possível criar uma classe CSS personalizada ou redefinir a escala em `quasar.config.js` via `cssAddon`. Porém, sempre que possível, reutilize os tamanhos padrão para manter consistência.

Com esse resumo, você consegue identificar rapidamente onde e quando usar `.q-gutter-md` e `.q-gutter-x-md` ao montar layouts no Quasar.

---

## Valores equivalentes (shorthand)

As classes de gutter aplicam margens negativas no container, mas é útil lembrar dos valores efetivos de `padding` atribuídos aos filhos:

- `.q-gutter-md` ⇒ `padding: 0 1rem 1rem 0;` em cada item, resultando em espaçamento uniforme de `1rem` nos eixos X e Y.
- `.q-gutter-x-md` ⇒ `padding: 0 1rem 0 1rem;` em cada item, mantendo apenas espaçamento horizontal (direita/esquerda) de `1rem`.

> Observação: o container pai recebe `margin` negativa correspondente (`-1rem`) para neutralizar o deslocamento externo.

## Como funcionam os `cols` e breakpoints do Quasar

O sistema de grid do Quasar é baseado em 12 colunas. Cada atributo `cols`, `sm`, `md`, `lg`, `xl` representa quantas dessas 12 colunas o elemento ocupará em determinado breakpoint:

| Atributo | Breakpoint mínimo | Largura padrão |
| --- | --- | --- |
| `cols` (ou `xs`) | ≥ 0px | valor aplicado em telas muito pequenas (mobile). |
| `sm` | ≥ 600px | substitui `cols` quando a largura é pelo menos 600px. |
| `md` | ≥ 1024px | substitui os valores anteriores quando a viewport é pelo menos 1024px. |
| `lg` | ≥ 1440px | aplica-se em telas grandes. |
| `xl` | ≥ 1920px | aplica-se em telas extragrandes.

Exemplo clássico:

```vue
<q-col cols="12" md="6">
  ...
</q-col>
```

- `cols="12"` → em telas pequenas (mobile) o item ocupa 12/12 colunas, ou seja, 100% da largura.
- `md="6"` → a partir de 1024px de largura ele passa a ocupar 6/12 colunas (50% da linha).

Você pode combinar outros valores (`sm="6"`, `lg="4"`, etc.) para ajustar o layout em diferentes resoluções.
