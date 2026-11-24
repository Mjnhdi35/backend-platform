# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

The package manager is Yarn (`yarn.lock`); `npm run` works too.

- Dev server: `yarn start:dev` (watch). Debug: `yarn start:debug`. Prod: `yarn build && yarn start:prod` (`node dist/main`).
- Build: `yarn build` (`nest build`, uses `tsconfig.build.json`, which excludes `test/` and `*.spec.ts` and cleans `dist/` first).
- Lint: `yarn lint` (oxlint with type-aware rules; `typescript/no-floating-promises` is an error, so await or `void` every promise). Format: `yarn format` (Prettier: single quotes, trailing commas).
- Unit tests: `yarn test` (Vitest, matches `**/*.spec.ts`). Watch: `yarn test:watch`. Coverage: `yarn test:cov`.
- E2E tests: `yarn test:e2e` (separate config `vitest.config.e2e.ts`, matches `**/*.e2e-spec.ts`).
- Single test file: `yarn test src/app.controller.spec.ts`. Single test by name: `yarn test -t "should return"`. For e2e, append the same args to `yarn test:e2e`.

## Project notes

- Fresh Nest 12 scaffold on `@nestjs/platform-express`; only the sample `AppController`/`AppService` exist so far. New features go in their own modules imported by `AppModule`.
- ESM with `module: nodenext`: relative imports must use the `.js` extension, and `src/main.ts` uses top-level `await`.
- Vitest runs with `globals: true` (`describe`/`it`/`expect`/`vi` need no import) and resolves `tsconfig.json` path aliases, so aliases added by `nest g library` work in tests without extra config.
- `tsconfig.json` has `strict` on but `strictPropertyInitialization` off, and keeps `emitDecoratorMetadata` for Nest DI.
- NestJS agent skills are installed in `.claude/skills/` (`nestjs`, `nestjs-feature`, `nestjs-data`, `nestjs-auth`, `nestjs-testing`, `nestjs-production`); load the matching one before working in that area.
