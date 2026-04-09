# Dev-onBoarding

# Commit & Pull Request Guidelines

## Commit Message Structure

Use the following format:

```
<type>[optional scope]: <short description>

[optional body]

[optional footer(s)]
```

---

## Commit Types

- **feat** – New feature
- **fix** – Bug fix
- **BREAKING CHANGE** – Introduces a breaking change
- **build** – Build system or dependencies
- **chore** – Miscellaneous tasks
- **ci** – CI/CD related changes
- **docs** – Documentation only
- **style** – Code formatting (no logic changes)
- **refactor** – Code restructuring (no behavior change)
- **perf** – Performance improvements
- **test** – Adding or updating tests

---

## Breaking Changes

You can indicate breaking changes in two ways:

### 1. Using Footer

```
feat: allow config extension

BREAKING CHANGE: `extends` key now supports extending other configs
```

### 2. Using `!`

```
feat!: change authentication system
```

---

## Commit Examples

### 1. Description + Breaking Change Footer

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

### 2. Commit with `!`

```
feat!: send an email to the customer when a product is shipped
```

### 3. Commit with Scope

```
feat(lang): add Polish language
```

### 4. Commit with Body + Multiple Footers

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request.
Dismiss incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are obsolete now.

Reviewed-by: Z
Refs: #123
```

---

# Pull Request (PR) Guidelines

## PR Title Format

```
<Type>(optional scope): <Description>
```

### Example

```
feat(auth): add JWT authentication
```

---

## PR Description

- Use **branch name as the Ticket ID**
- Clearly explain:
  - What was changed
  - Why it was changed
  - Any important notes for reviewers

---

## Best Practices

- Keep messages **short and clear**
- Use **present tense** (e.g., "add", not "added")
- Group related changes into **one commit**
- Use body only when necessary
