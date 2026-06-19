# Risk Matrix — ShopCheck

| ID | Área | Risco | Prob. | Impacto | Prioridade | Cobertura |
|----|------|-------|-------|---------|------------|-----------|
| R01 | Checkout | Pedido criado sem dados obrigatórios | Média | Alto | P1 | API + E2E |
| R02 | Estoque | Venda acima do estoque disponível | Média | Alto | P1 | API (409) + E2E (botão desabilitado) |
| R03 | Cupons | Cupom expirado aceito no checkout | Baixa | Alto | P1 | API |
| R04 | Cupons | Desconto aplicado abaixo do mínimo | Média | Médio | P2 | API |
| R05 | Carrinho | Estado vazio não tratado | Baixa | Médio | P2 | E2E |
| R06 | A11y | Formulário sem labels acessíveis | Média | Alto | P1 | axe + teste de labels |
| R07 | A11y | Usuário de teclado não alcança conteúdo | Baixa | Alto | P1 | Skip link test |
| R08 | Performance | API degrada sob carga moderada | Média | Médio | P2 | k6 thresholds |
| R09 | API | Produto inexistente retorna erro incorreto | Baixa | Baixo | P3 | API 404 |

## Legenda de prioridade

- **P1** — Bloqueia release / fluxo crítico
- **P2** — Importante, mas com workaround
- **P3** — Monitorar
