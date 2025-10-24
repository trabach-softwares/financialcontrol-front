# Contributing to Financial Control Frontend

Thank you for your interest in contributing to the Financial Control Frontend project!

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Configure Supabase (see SETUP.md)
5. Start development server:
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Enable strict mode
- Avoid `any` types (ESLint will catch these)
- Use proper type definitions

### Vue 3

- Use Composition API with `<script setup>`
- Use TypeScript in components
- Keep components focused and small
- Extract reusable logic to composables

### Tailwind CSS

- Use Tailwind utility classes
- Follow the existing color scheme (primary blue #007bff)
- Ensure responsive design (mobile-first)
- Use consistent spacing and sizing

### File Organization

```
src/
├── assets/       # Static assets (images, global CSS)
├── components/   # Reusable components
├── lib/          # Third-party library configurations
├── router/       # Vue Router configuration
├── stores/       # Pinia stores (state management)
├── views/        # Page components
└── main.ts       # Application entry point
```

## Commit Messages

Use conventional commit format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add export to CSV functionality
fix: correct balance calculation in dashboard
docs: update setup instructions for Supabase
```

## Testing

Before submitting a PR:

1. Run linter:
   ```bash
   npm run lint
   ```

2. Run type checking:
   ```bash
   npm run type-check
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Test manually in the browser

5. (Future) Run unit tests:
   ```bash
   npm run test:unit
   ```

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes following the code style

3. Commit your changes with clear messages

4. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

5. Open a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots for UI changes
   - List of changes made

6. Wait for code review and address feedback

## What to Contribute

### Good First Issues

- UI improvements and refinements
- Additional chart types
- Export functionality (CSV, PDF)
- Email notifications
- Dark mode support
- Internationalization (i18n)

### Feature Ideas

- Budget planning and goals
- Recurring transactions
- Multiple currencies
- Import from bank statements
- Receipt upload and OCR
- Category customization
- Reports and analytics
- Mobile app (React Native)

### Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or error messages
- Browser and OS information

## Code Review Guidelines

We review PRs for:

- **Functionality**: Does it work as expected?
- **Code Quality**: Is it clean and maintainable?
- **Performance**: Does it impact app performance?
- **Security**: Are there any security concerns?
- **Tests**: Are there tests for new features?
- **Documentation**: Is documentation updated?

## Questions?

- Open an issue for discussion
- Ask in pull request comments
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
