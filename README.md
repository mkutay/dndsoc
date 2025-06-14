# KCL DnD Society App

A comprehensive digital companion for the King's College London Dungeons & Dragons Society.
This application serves as an organisational tool to enhance the users' experience, providing features
for character management, party organization, campaign tracking, and achievement systems.

**Important**: This is not a replacement for pen-and-paper play, but rather a magical addon
that complements traditional D&D sessions at the university. Think of it as your party's
trusted spellbook and chronicle keeper!

## Project Overview

The KCL DnD Society App is a Next.js-based web application designed to help everyone.
It provides a centralised platform for:

- **Character Management**: Create, edit, and track PCs
- **Party Organisation**: Form and manage adventuring parties
- **Campaign Tracking**: Monitor ongoing campaigns *(from humble tavern meetings to epic world-saving quests)*
- **Achievement System**: Award and track achievements for both players, DMs, and PCs
- **Journal Entries**: Document campaign sessions and important events *(the bards will thank you)*
- **User Roles**: Differentiate between players, DMs, and administrators
- **Images**: Upload and display character and party images *(because a picture is worth a thousand words)*

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Supabase account and project

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mkutay/dndsoc.git
   cd dndsoc
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Supabase Configuration (Required)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key

   # Site Configuration
   PRODUCTION_SITE_URL=your_production_domain

   # Test Configuration (for running tests)
   TEST_USER_EMAIL=test_user_email
   TEST_USER_PASSWORD=test_user_password
   ```

   **Need access to environment variables?** Contact me (Kutay) for development keys. *(The DM holds the sacred scrolls!)*

4. **Start the development server**
   ```bash
   bun dev
   ```

5. **Build for production** 
   ```bash
   BUILDING=true bun run build
   ```

## Architecture & Code Quality

### Key Code Patterns

#### The `runQuery` Function

The application uses a `runQuery` function for most database operations, providing:
- Consistent error handling across all database interactions.
- Type-safe database queries with full TypeScript support.
- Automatic error logging with caller context.
- Functional programming patterns with ResultAsync.

```typescript
export const runQuery = <T>(queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>, caller?: string) => 
  createClient().andThen(client => supabaseRun(queryBuilder(client), caller));
```

#### Neverthrow Error Handling

The entire application uses the [Neverthrow](https://github.com/supermacro/neverthrow) library for:
- **Railway-oriented programming**: Explicit error handling without try-catch
- **Composable operations**: Chain database operations with `.andThen()`
- **Type-safe errors**: All error cases are explicitly typed
- **Functional transformations**: Map over success values while preserving errors

#### Full Type Safety
*"In TypeScript we trust, for it guards against the chaos of runtime errors"*

- **Database Types**: Auto-generated TypeScript types from Supabase schema
- **Form Validation**: Zod schemas for runtime type validation
- **API Responses**: Strongly typed server actions and responses, using `ActionResult` type

### Project Structure

```
src/
├── app/                 # Next.js App Router pages (the main quest hub)
│   ├── (auth-pages)/    # Authentication flows (the tavern entrance)
│   ├── achievements/    # Achievement system (your trophy room)
│   ├── admin/           # Admin panel (the throne room)
│   ├── campaigns/       # Campaign management (where epics are born)
│   ├── characters/      # Character profiles (meet the heroes)
│   ├── dms/             # Dungeon Master profiles (the storytellers)
│   ├── journal/         # Session journals (the chronicler's records)
│   ├── my/              # User dashboard (your personal sanctuary)
│   ├── parties/         # Party management (assemble your fellowship)
│   ├── players/         # Player profiles (the adventurers)
│   └── polls/           # Polling system (democratic decisions)
├── components/          # Reusable UI components (your spell components)
│   ├── ui/              # Base UI primitives (the fundamental elements)
│   ├── typography/      # Typography components (the scribes' tools)
│   └── [feature]/       # Feature-specific components (specialized gear)
├── config/              # Configuration and schemas (the rule books)
├── fonts/               # Custom D&D themed fonts (ancient scripts)
├── lib/                 # Client-side database operations (your utility spells)
├── server/              # Server actions and API logic (the server realm)
├── types/               # TypeScript type definitions (the language of the code)
└── utils/               # Utility functions and helpers (handy tools)
```

## Contributing

Contributions are welcome! Please follow these guidelines

1. **Code Style**: Follow the existing patterns and TypeScript conventions
2. **Error Handling**: Use Neverthrow for all async operations
3. **Testing**: Add tests for new features
4. **Documentation**: Update README and code comments
5. **Respect**: Be respectful and follow obvious design patterns

### Development Workflow


1. Fork the repository
2. Create a feature branch
3. Make changes following the code quality standards
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## Contact

For questions about development, environment variables, or contributions, contact me (Kutay).

## License

This project is licensed under the terms specified in the LICENSE file (GNU GPL V3).

---

Built with <3 for the KCL DnD Society by Kutay and contributors.

*May your code compile and your dice roll high!*