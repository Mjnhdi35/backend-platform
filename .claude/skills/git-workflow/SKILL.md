---
name: git-workflow
description: Step-by-step Git workflow for this repository - checking status and the current branch, creating or renaming branches, reviewing changes, committing, pushing with upstream, pulling and syncing with main, and resolving merge conflicts. Use whenever a task involves any Git operation (branch, commit, push, pull, merge, rebase, conflict) in this project.
---

# Git workflow

Naming, commit format and safety limits are defined in `.claude/rules/git-conventions.md`. Follow them in every step below; this skill only describes the procedures.

## Ground rules for every procedure

1. **Inspect first.** Run `git status` and `git branch --show-current` before any Git operation, and stop to report anything unexpected (detached HEAD, a rebase or merge in progress, unrelated uncommitted changes).
2. **Ask before committing or pushing.** Commit or push only when the user has explicitly asked for it in this conversation. Approval for one commit or push does not cover the next.
3. **Confirm destructive operations.** Anything that deletes branches, rewrites history or discards work needs the user's explicit yes for that specific action.
4. **Preserve user changes.** Never stage, discard or overwrite changes the user did not ask you to touch. If you must set work aside, prefer a temporary WIP commit; if you must stash, use `git stash push -u -m "<unique-tag>"` and restore with `git stash apply <sha>`, never a bare `git stash pop`.

## 1. Check status and the current branch

```bash
git status
git branch --show-current
git log --oneline -5
git remote -v
```

Note which files are modified, staged or untracked, and whether the branch tracks a remote (`git status -sb`).

## 2. Create a new branch

1. Pick a name that follows the branch rules (for example `feature/user-auth`). Never use `claude/`.
2. Check it doesn't already exist, locally or on the remote:

   ```bash
   git branch --list <name>
   git ls-remote --heads origin <name>
   ```

   If it exists, tell the user and ask whether to switch to it or choose another name.

3. Branch from an up-to-date base (usually `main`):

   ```bash
   git fetch origin
   git switch -c <name> origin/main
   ```

   To carry over uncommitted changes, create the branch from the current HEAD instead: `git switch -c <name>`.

## 3. Rename an existing branch

Typical case: the branch was created with a `claude/` prefix or a non-conforming name.

1. Check the new name is free (step 2.2).
2. Rename locally:

   ```bash
   git branch -m <old-name> <new-name>
   ```

3. If the old branch was pushed, the remote side involves deleting a remote branch, so ask the user first. On a yes:

   ```bash
   git push -u origin <new-name>
   git push origin --delete <old-name>
   ```

   If an open pull request uses the old branch, warn the user that deleting it closes that PR.

## 4. Review changes before committing

```bash
git status
git diff              # unstaged
git diff --staged     # staged
```

- Read every changed file and confirm each change belongs to the task.
- Look for things that must not be committed: secrets, `.env` files, credentials, build output (`dist/`), `node_modules/`, debug leftovers.
- When the change touches code, run the relevant checks first and report failures instead of committing:

  ```bash
  yarn lint
  yarn test               # or a focused file: yarn test src/path/to/file.spec.ts
  yarn build              # when types or build config changed
  ```

## 5. Commit

1. Stage only the files that belong to this change, by path:

   ```bash
   git add <file> [<file> ...]
   ```

   Avoid `git add -A` / `git add .` unless you have checked that every change is in scope.

2. Commit with a Conventional Commits message:

   ```bash
   git commit -m "<type>(<scope>): <description>"
   ```

   Use a body (a second `-m`) for context that doesn't fit the subject.

3. If a pre-commit hook fails, fix the cause and create a new commit. Don't skip hooks with `--no-verify`, and don't amend unless the user asks.
4. Confirm with `git log --oneline -1`.

## 6. Push and set upstream

```bash
git push -u origin <branch>     # first push
git push                        # later pushes
```

- Never push directly to `main` unless the user asks for it.
- If the push is rejected because the remote moved ahead, sync first (step 7). Do not force push.

## 7. Pull and sync

Update the current branch from its upstream:

```bash
git fetch origin
git status -sb                  # shows ahead/behind
git pull --ff-only
```

If `--ff-only` fails because the branches diverged, ask the user how to integrate:

- **Merge** (safe, keeps history): `git merge origin/<branch>`
- **Rebase** (rewrites local commits; needs confirmation, and a force push afterwards if they were already pushed): `git rebase origin/<branch>`

Bring a feature branch up to date with `main`:

```bash
git fetch origin
git merge origin/main
```

Commit or set aside local changes before pulling (see ground rule 4).

## 8. Resolve merge conflicts

1. List the conflicted files:

   ```bash
   git status
   git diff --name-only --diff-filter=U
   ```

2. Open each file and resolve the `<<<<<<<` / `=======` / `>>>>>>>` blocks by understanding both sides. Keep both changes when both are needed. Don't blindly take `--ours` or `--theirs`.
3. When the right resolution is unclear (conflicting business logic, or both sides changed the same behaviour), show the user both versions and ask.
4. Mark files resolved and verify:

   ```bash
   git add <file>
   yarn lint && yarn test
   ```

5. Finish the operation: `git commit` for a merge, or `git rebase --continue` for a rebase.
6. To back out, use `git merge --abort` or `git rebase --abort`. These discard the resolution work, so confirm with the user first.
