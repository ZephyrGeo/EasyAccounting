---
description: Create a git commit following the project's commit message template
---

Please create a git commit for the current changes following these rules from .claude/commit-template.md:

1. Format: `<Type> <short description in imperative mood>`
2. Keep under 72 characters
3. Use imperative mood: "Add feature" not "Added feature"
4. Capitalize first letter
5. No period at the end

Type prefixes to use:
- **Update**: Modify existing functionality
- **Add**: Add new functionality
- **Fix**: Bug fix
- **Refactor**: Code restructuring without behavior change
- **Remove**: Delete code or files
- **Docs**: Documentation changes only
- **Style**: Formatting changes
- **Test**: Add or update tests
- **Chore**: Maintenance tasks, dependency updates

Steps:
1. Run `git status` and `git diff --staged` to see what changes are staged
2. Analyze the changes to understand what was modified
3. Create an appropriate commit message following the format above
4. Execute the commit with the proper message format

**Important**: Do NOT include AI-generated footers or co-authorship attribution in commit messages. Keep commits clean and professional without mentions of AI tools.

Example commit messages:
- Update candidates API to support status filtering and pagination
- Add dark mode toggle to user settings
- Fix authentication token expiration handling
- Refactor database connection pooling for better performance