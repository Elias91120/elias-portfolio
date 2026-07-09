# Usage examples

## How to invoke

In a **new Cursor chat**, attach or mention the skill:

```
@portfolio-prompt-maker axe 4
```

```
@portfolio-prompt-maker — prompt pour le curseur spotlight
```

```
@portfolio-prompt-maker catégorie conversion (axes 20-23), un prompt par axe
```

```
@portfolio-prompt-maker intro cinématique (axe 1)
```

## Expected agent behavior

1. Reads `SKILL.md`, `project-context.md`, `axes-reference.md`
2. Greps/reads relevant repo files
3. Outputs **one fenced markdown block** = full implementation prompt
4. Does **not** write code in that turn

## Example user message (minimal)

> `@portfolio-prompt-maker` axe 11

## Example output shape (truncated)

Outside the block, agent writes in French:

> Voici le prompt pour l'axe 11 (vidéo hover). Colle-le dans une nouvelle discussion.

Inside the block:

```markdown
# Tâche : Vidéo hover sur les cartes projets (Content WOW — axe 11)
## Contexte projet
...
Implemente directement — pas de plan mode...
```

## After paste

Open **another** new chat → paste the block → agent implements.

## Refresh context

If the repo changed significantly, ask:

```
@portfolio-prompt-maker mets à jour project-context en relisant le repo, puis axe 7
```

The agent should update `project-context.md` only if files drifted — not on every invocation.
