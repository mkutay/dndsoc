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
- Docker; you can use [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Orb](https://orbstack.dev)

### Development Setup

0. **Start Docker**
   Make sure Docker is running on your machine. If you're using Orb, you can start it with:
   ```bash
   orb start
   ```

1. **Clone the repository**
   ```bash
   git clone https://github.com/mkutay/dndsoc.git
   cd dndsoc
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup DB**
   ```bash
   bunx supabase start
   bunx supabase db reset --local
   ```

   This starts up the Supabase local server with the migrations under
   `/supabase/migrations` and the data in `/supabase/seed.sql`.

   You can sign in with three accounts to test the system out: `admin@kcl.ac.uk`, `player@kcl.ac.uk`,
   and `dm@kcl.ac.uk`, with the password of `123456`. Obviously, this is just sample information and is not _real_.

4. **Environment Variables**

   Populate `.env.example` file in `.env.local` with the information given by the `supabase start` command.

   ```bash
   cp .env.example .env.local
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

6. **Build for production** 

   Test the types and run the linter to check for errors overall.
   
   ```bash
   bun run build
   ```

7. **Run the production server**
   ```bash
   bun start
   ```

8. **Close the Supabase server**
   ```bash
   bunx supabase stop
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
├── config/              # Configuration and schemas (the rule books)
├── fonts/               # Custom D&D themed fonts (ancient scripts)
├── lib/                 # Client-side database operations (your utility spells)
├── server/              # Server actions and API logic (the server realm)
├── types/               # TypeScript type definitions (the language of the code)
└── utils/               # Utility functions and helpers (handy tools)
```

## Contributing

Contributions are welcome! Please be respectful and follow obvious design patterns.

If you have changed the schema of the DB, then make sure to run the following command to
add the new changes into the repo. 

```bash
bunx supabase db diff -f add_new_feature
```

After that, you are welcome to create a PR, where I'll review your changes.

For more information about the Supabase migrations, [see](https://supabase.com/docs/guides/deployment/managing-environments).

---

Built with <3 for the KCL DnD Society by [Kutay](https://www.mkutay.dev) and contributors.

*May your code compile and your dice roll high!*

<p align="center">
  <img
    src="/public/logo-light.png"
    alt="DnD Society Logo Image"
    width="20%"
    height="auto"
  >
</p>
