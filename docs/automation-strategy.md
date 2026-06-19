# Automation Strategy — ShopCheck

## Pirâmide de testes

```
        ┌─────────────┐
        │  E2E (UI)   │  Fluxos críticos de compra
        ├─────────────┤
        │  A11y       │  WCAG em páginas-chave
        ├─────────────┤
        │  API        │  Regras de negócio e contratos
        ├─────────────┤
        │  Perf (k6)  │  Saúde da API sob carga
        └─────────────┘
```

## O que automatizar

### API (base)
- Health check, listagem e detalhe de produtos
- Validação de cupons (válido, expirado, mínimo)
- Criação de pedido e erros de validação

**Por quê:** Rápido, estável, valida regras sem depender da UI.

### E2E (topo)
- Happy path: adicionar produtos → checkout → confirmação
- Produto sem estoque
- Carrinho vazio
- Cupom inválido na UI

**Por quê:** Garante que o usuário consegue comprar de ponta a ponta.

### A11y (transversal)
- Scan axe em home, carrinho e checkout
- Labels de formulário
- Skip link para teclado

**Por quê:** Acessibilidade é requisito de qualidade, não feature opcional.

### Performance (complementar)
- Carga gradual até 25 VUs em endpoints de catálogo e pedido

**Por quê:** Demonstra preocupação com experiência em produção.

## O que manter manual

- Exploração visual de layout responsivo
- Testes em leitores de tela reais (NVDA/VoiceOver)
- Cenários de pagamento com gateway real

## Padrões adotados

- **Page Object Model** em `/src/pages`
- **Fixtures** centralizadas em `/src/fixtures`
- **Locators semânticos** (`getByRole`, `getByLabel`)
- **Projetos Playwright separados** (`api`, `e2e`, `a11y`)
