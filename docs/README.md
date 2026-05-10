# Builder HeredIA Docs

Esta carpeta complementa el Documento Maestro Operativo del proyecto. Su objetivo es que otro desarrollador pueda retomar Builder HeredIA desde otra cuenta de Codex, entender el sistema real y operar el repositorio sin depender del historial de chat.

## Mapa de documentación

1. [Visión técnica del sistema](./system-overview.md)
2. [Arquitectura general](./architecture.md)
3. [Rutas y superficies](./routes-and-surfaces.md)
4. [Modelo de datos](./data-model.md)
5. [Auth y sesiones](./auth-and-sessions.md)
6. [Pagos, compras y accesos](./payments-and-access.md)
7. [Preventa y estado de programa](./presale-and-program-status.md)
8. [Cloudflare Stream](./cloudflare-stream.md)
9. [Operación admin](./admin-operations.md)
10. [Novedades Builder](./builder-updates.md)
11. [Variables de entorno](./environment-variables.md)
12. [Flujos críticos](./critical-flows.md)
13. [Decisiones y tradeoffs](./decisions-and-tradeoffs.md)
14. [Pendientes, riesgos y deuda técnica](./known-issues-and-next-steps.md)
15. [Handoff para nuevo developer](./handoff-for-new-developer.md)

## Lectura recomendada para onboarding

Si eres nuevo en el proyecto, lee en este orden:

1. `handoff-for-new-developer.md`
2. `system-overview.md`
3. `architecture.md`
4. `data-model.md`
5. `auth-and-sessions.md`
6. `payments-and-access.md`
7. `admin-operations.md`
8. `known-issues-and-next-steps.md`

## Reglas de trabajo importantes

- No rediseñar el producto sin revisar la intención de Builder como LMS premium.
- No tocar Stripe, Auth.js, Prisma o permisos sin validar flujo completo.
- No confundir `Access.source` con rol de usuario.
- No usar `Early Access` como superficie operativa principal actual.
- No activar signed URLs de Cloudflare Stream sin implementar reproducción firmada.
- No migrar sesiones de Auth.js a JWT por ahora.
