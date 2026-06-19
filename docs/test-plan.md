# Test Plan — ShopCheck

## 1. Objetivo

Garantir a qualidade do fluxo de compra da loja demo ShopCheck, cobrindo regras de negócio (estoque, cupons, checkout), acessibilidade e desempenho da API.

## 2. Escopo

### In scope
- Catálogo de produtos
- Carrinho (adicionar, remover, estado vazio)
- Validação e aplicação de cupons
- Checkout e confirmação de pedido
- API REST (`/api/products`, `/api/coupons/validate`, `/api/orders`)
- Acessibilidade WCAG 2.x (scan automatizado)
- Teste de carga básico na API

### Out of scope
- Pagamento real / gateway
- Autenticação de usuário
- Testes de responsividade em dispositivos físicos
- Segurança ofensiva (pentest)

## 3. Ambientes

| Ambiente | URL |
|----------|-----|
| Local | http://localhost:3000 |
| CI | GitHub Actions (Ubuntu) |

## 4. Critérios

**Entrada:** App rodando, dependências instaladas, Playwright browsers instalados.

**Saída:** 100% dos testes críticos (smoke) passando; 0 violações a11y critical/serious; thresholds de performance dentro do esperado.

## 5. Tipos de teste

| Tipo | Ferramenta | Foco |
|------|-----------|------|
| API | Playwright API | Contratos, status codes, regras de cupom/pedido |
| E2E | Playwright UI | Happy path de compra, estoque, cupom inválido |
| A11y | axe-core + Playwright | Labels, skip link, violações WCAG |
| Performance | k6 | Latência p95 e taxa de erro sob carga |

## 6. Riscos

| Risco | Mitigação |
|-------|-----------|
| Estoque esgotado após muitas execuções | `db.json` versionado com estoque alto; reset manual se necessário |
| Flakiness em E2E | `localStorage` limpo no `beforeEach` |
| k6 não instalado no CI | Job separado, marcado como opcional no README |
