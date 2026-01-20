# Comments for expressjs-api

## Fixes and correctness
- src/server.ts: dotenv.config() runs after importing config/app; config/env reads process.env before dotenv. Load dotenv before importing config (or use import "dotenv/config" at top) to ensure .env values are used.
- src/index.ts: same dotenv ordering problem as above if index is used.
- src/middleware/validate.ts + src/routes/user.routes.ts + src/controllers/user.controller.ts: validate() writes validated data into req.body but getAllUsers reads req.query. Defaults from searchUsersSchema never apply; page/limit can be undefined -> NaN skip/take. Validate req.query and assign to req.query or read validated data from req.body/res.locals.
- src/config/env.ts + README.md + SETUP_GUIDE.md: CORS origin default "*" with credentials true. Browsers reject "*" with credentials. Use explicit origins or set credentials false when using "*".
- src/controllers/auth.controller.ts: res.clearCookie('refreshToken') should pass the same options used in res.cookie (sameSite/secure/path) to ensure the cookie is removed.

## Security and setup
- .env and SETUP_GUIDE.md include live DATABASE_URL credentials; avoid committing or publishing real credentials. Use .env.example and a secrets manager; keep actual credentials local only.
- src/routes/auth.routes.ts: refresh endpoint has no validation or rate limiting. Consider validate(refreshTokenSchema) and add a rate limit to reduce abuse.

## Type safety and polish
- src/routes/user.routes.ts + src/controllers/user.controller.ts: using req.query as any bypasses type safety. Use searchUsersSchema.parse(req.query) or set validated data on req.query/res.locals and type it.
- src/repositories/user.repo.ts: findAll uses select (password false) then casts to User[]; type is wrong. Define a safe User type (Pick) or use Prisma.UserGetPayload for the select shape.
- src/services/user.service.ts: updateData is Record<string, string). Use Partial<Pick<User, "email" | "name" | "role">> or Prisma.UserUpdateInput for stronger typing.
- src/utils/token.ts: expiresIn typed as any; use SignOptions['expiresIn'] or type jwtConfig so no any casting is needed.
- src/middleware/validate.ts: merging body/query/params into one object can cause collisions and hides where data came from. Prefer separate validators for body/query/params or keep validated data in res.locals.

## Cleanup and docs
- src/index.ts, src/config/config.ts, src/middleware/errorHandler.ts appear to be legacy and unused (server.ts is the entry). Consider removing or aligning to avoid confusion.
- README.md, SETUP_GUIDE.md, src/server.ts contain corrupted characters (dY, f-like glyphs). Clean and replace with normal text/bullets.
- package.json main is "index.js" but build output is dist/server.js; update if the package is expected to be imported or executed via main.
