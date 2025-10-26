# Design System Components - Sage Accountant

Componentes reutilizáveis baseados no Design System do Financial Control.

## Estrutura

```
design-system/
├── atoms/           # Componentes básicos (botões, inputs, badges)
├── molecules/       # Combinações de atoms (cards, forms)
├── organisms/       # Componentes complexos (headers, sidebars)
└── templates/       # Layouts de página
```

## Paleta de Cores

- **Primary**: #2C5F2D (Verde contábil)
- **Secondary**: #0078D4 (Azul Microsoft)
- **Positive**: #107C10 (Verde sucesso)
- **Negative**: #D13438 (Vermelho erro)
- **Warning**: #FFB900 (Amarelo aviso)

## Princípios

1. **Acessibilidade**: WCAG 2.1 AA/AAA
2. **Responsividade**: Mobile-first
3. **Consistência**: Design Tokens centralizados
4. **Reutilização**: Componentes modulares

## Uso

```vue
<script setup>
import MetricCard from 'components/design-system/molecules/MetricCard.vue'
</script>

<template>
  <MetricCard
    label="Receitas"
    value="R$ 10.000,00"
    type="positive"
    icon="trending_up"
  />
</template>
```
