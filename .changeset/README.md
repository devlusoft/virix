# Changesets

Este directorio usa [Changesets](https://github.com/changesets/changesets) para gestionar versiones y el CHANGELOG.

## Cómo agregar un changeset

Cada PR que introduzca un cambio publicable debe incluir un archivo `.changeset/<nombre-random>.md` con este formato:

```md
---
"virix": minor
---

Descripción user-facing del cambio. Una o dos líneas, sin detalles internos.
```

El primer campo (`virix`) es el nombre del paquete (debe coincidir con el campo `name` en `package.json`). El valor a la derecha es el tipo de bump:

- `patch` — bug fix, cambio interno sin breaking change
- `minor` — nueva feature compatible
- `major` — breaking change

## Flujo de release

1. Abrís PR con un archivo `.changeset/*.md`.
2. Al mergear a `develop`, el GitHub Action abre/actualiza un PR "Version Packages" con la versión bump, CHANGELOG actualizado.
3. Al mergear ese PR, el action publica a npm (`virix` y `create-virix` si aplica).

## Publicar manualmente (sin bot)

```bash
pnpm changeset version   # bump + CHANGELOG
pnpm install --frozen-lockfile
pnpm publish -r          # recursive en todos los workspaces
```

## Nombre del archivo

El nombre del archivo no importa. Usá algo descriptivo del cambio, kebab-case:

```
feat-virix-layout.md
chore-typed-router.md
```

`pnpm changeset` (interactivo) genera uno con nombre aleatorio si no querés pensarlo.