# prisma client extension playground

> See https://github.com/prisma/prisma/discussions/24276

### Question

**Can I reference a custom field added via a `result` extension in a `query` extension?** I ask because...

- I haven't found anything in the docs that suggests otherwise (though I could be wrong)
- and (this is entirely subjective, but still notable!) intuitively the API for chaining extensions suggests that they are chained together as middlewares would be, and as such, the result from one would be passed to another.

My guess is that, despite my comment about chaining together the extensions, this is, in fact, not the case.

### How to reproduce (optional)

1. Run `yarn` to install.
2. Create a new Postgresql Database - add `DATABASE_URL` to `.env`
3. Run `npx prisma migrate deploy` to migrate schema
4. Run `npx tsx seed.ts` to seed data
5. Run `npx tsx index.ts`.

### What's inside?

In this demo, I've got...

- The `kindExtension`, that adds a `kind` property to each model result.
- The `filterExtension`, that applies a custom filter in cases where the `kindExtension` indicates that the model is of kind `"user"`.
- The instantiation of a prisma client that uses these extensions (in the order they're described here).
- ...plus some code to actually invoke the thing.

### Expected behavior (optional)

As I mentioned, I would _expect_ that the result that's being filtered in the `filterExtension` would already have been fed through the `kindExtension` (because of the order in which the extensions have been configured). But as it turns out, that doesn't appear to be the case. The `kind` property isn't available yet in the `filterExtension`.

Is this expected? Is there something I've missed?
