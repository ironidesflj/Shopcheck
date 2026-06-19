# ShopCheck — Meu portfólio de QA para e-commerce

[![ShopCheck QA](https://github.com/ironidesflj/shopcheck/actions/workflows/ci.yml/badge.svg)](https://github.com/ironidesflj/shopcheck/actions/workflows/ci.yml)

> Loja demo e suíte de QA completa com foco em API, E2E, acessibilidade e performance.

Este é um projeto pessoal que desenvolvi para mostrar minha transição para automação de testes e qualidade de software com ferramentas modernas.

---

## Sobre o projeto

Eu criei a loja demo em Express + HTML/JS para ter um ambiente controlado onde posso validar fluxos reais de e-commerce: catálogo, carrinho, cupons e checkout.

Meu objetivo foi construir uma suíte de QA que cobre vários pilares de qualidade, não apenas testes funcionais.

---

## O que eu busquei demonstrar

- Implementação de um fluxo real de e-commerce com foco em qualidade.
- Pirâmide de testes usando Playwright para API, UI/E2E e auditoria de acessibilidade.
- Teste de performance em endpoints do checkout com k6.
- Documentação QA clara e alinhada à estratégia de automação.
- Integração com CI para executar a suíte de forma automatizada.

---

## Estrutura do projeto

```
shopcheck/
├── app/                     # Loja demo (Express + HTML/JS)
│   ├── server.js
│   ├── db.json
│   └── public/
├── tests/
│   ├── api/                 # Testes de API
│   ├── e2e/                 # Fluxos de compra
│   ├── a11y/                # Testes de acessibilidade
│   └── perf/                # Teste de carga com k6
├── src/
│   ├── pages/               # Page Object Model para Playwright
│   └── fixtures/            # Dados de teste
├── docs/
│   ├── test-plan.md
│   ├── risk-matrix.md
│   └── automation-strategy.md
└── .github/workflows/ci.yml
```

---

## Como executar

### Pré-requisitos

- Node.js 18+
- npm

### Rodando localmente

```bash
git clone https://github.com/ironidesflj/shopcheck.git
cd shopcheck
npm install
npx playwright install chromium

# Terminal 1 — iniciar a loja
npm run start:app

# Terminal 2 — executar a suíte completa
npm test
```

### Comandos úteis

```bash
npm run test:api     # executar apenas testes de API
npm run test:e2e     # executar apenas testes E2E
npm run test:a11y    # executar apenas testes de acessibilidade
npm run test:ui      # executar em modo Playwright UI
npm run report       # abrir relatório HTML local
npm run perf         # executar teste de carga com k6
```

### Performance com k6

```bash
# macOS
brew install k6

# depois
npm run start:app
npm run perf
```

---

## Cobertura de testes

| Camada | Testes | Foco |
|--------|--------|------|
| API | 9 | Produtos, cupons, pedidos e validações de retorno |
| E2E | 4 | Compra completa, fluxo de estoque e carrinho vazio |
| A11y | 5 | WCAG 2.x, labels, skip link e navegação por teclado |
| Perf | 1 script | Carga gradual até 25 VUs em endpoints de checkout |

---

## Cupons de teste

| Código | Tipo | Regra |
|--------|------|-------|
| `SAVE10` | 10% desconto | Subtotal mínimo R$ 50 |
| `FREESHIP` | Frete grátis | Subtotal mínimo R$ 100 |
| `EXPIRED` | — | Cupom inativo para casos negativos |

---

## O que eu quero destacar

- É um projeto pessoal: o app demo está no repositório e qualquer pessoa pode rodar a suíte completa.
- Acessibilidade é parte do fluxo de QA, com scan automatizado e validações comportamentais.
- Performance foca em endpoints reais de checkout, não apenas verificações de saúde.
- A documentação QA está organizada separadamente para apoiar estratégia e risco.

---

## Contato

- LinkedIn: https://www.linkedin.com/in/ironjunior
- E-mail: ironidesflj@gmail.com

---

## Licença

MIT
