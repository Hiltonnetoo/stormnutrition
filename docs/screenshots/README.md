# Capturas de tela (UI11)

Geradas por `npm run screenshots` (`tests-e2e/screens.capture.ts`) contra os emuladores (projeto `demo-storm`) com o seed sintético (`scripts/seed-emulator.mjs`). Configuração: tema claro, PT-BR, movimento reduzido, 1440×900 (desktop) e 375×812 (celular).

`manifest.json` registra, para cada imagem, a tela, a rota, o viewport, o idioma, o tema, a data e a versão (`<commit>+working-tree` quando capturada com alterações locais). Uma imagem sem entrada no manifesto não é evidência.

| Arquivo                                       | Tela                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| dashboard.png / dashboard_mobile.png          | Dashboard                                            |
| patients.png                                  | Lista de pacientes                                   |
| patients_no_results.png                       | Estado sem resultados de busca                       |
| patient_profile.png                           | Perfil do paciente                                   |
| diet_generator_step1.png / diet_generator.png | Gerador: etapa 1 e plano gerado                      |
| calendar.png / calendar_mobile.png            | Agenda (no celular: contagem por dia + lista do dia) |
| portal.png / portal_mobile.png                | Portal do paciente                                   |
| invitation_error.png                          | Erro: convite inválido                               |

## Histórico

`historico/` guarda as duas imagens que ocupavam `dashboard.png` e `diet_generator.png` até 18/09/2026. Elas **não mostram a UI**: a primeira é o painel de rede do DevTools e a segunda uma resposta JSON `INVALID_LOGIN_CREDENTIALS`. Ficam como diagnóstico histórico e não devem ser usadas como apresentação.
