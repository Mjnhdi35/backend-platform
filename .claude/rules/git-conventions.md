# Git Conventions

These conventions apply to every Git operation in this repository. The step-by-step procedures live in the `git-workflow` skill.

## Branch naming

- Never use the `claude/` prefix.
- Use lowercase kebab-case for the description: letters, digits and hyphens only.
- Use one of these patterns:

| Pattern                  | Use for                                     |
| ------------------------ | ------------------------------------------- |
| `feature/<description>`  | New functionality                           |
| `fix/<description>`      | Bug fixes                                   |
| `chore/<description>`    | Tooling, dependencies, config, housekeeping |
| `refactor/<description>` | Code changes that don't change behaviour    |
| `docs/<description>`     | Documentation only                          |
| `test/<description>`     | Adding or fixing tests only                 |

Examples: `feature/user-auth`, `fix/login-timeout`, `chore/docker-compose-mysql`.

## Commit messages

- Follow [Conventional Commits](https://www.conventionalcommits.org/).
- Format: `<type>(<scope>): <description>`. The scope is optional; omit the parentheses when there is none.
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `build`, `ci`, `style`, `revert`.
- Write the description in the imperative mood, lowercase, with no trailing period (`add user module`, not `Added user module.`).
- Keep the subject line concise (about 72 characters or fewer) and meaningful; put extra context in the body.
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer.

Examples: `feat(users): add registration endpoint`, `fix(db): retry connection on startup`, `chore: add docker compose for mysql and adminer`.

## Git safety

- Never force push (`--force`, `--force-with-lease`) unless the user explicitly requests it.
- Never delete branches, local or remote, without explicit confirmation.
- Never rewrite Git history (rebase, amend of pushed commits, reset, filter-branch) without explicit confirmation.
- Never discard or overwrite uncommitted user changes (`reset --hard`, `checkout -- <file>`, `restore`, `clean`, bare `stash`).
