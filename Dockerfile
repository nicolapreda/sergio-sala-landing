# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
# Build tools required by better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

# Create persistent data directory for SQLite DB
RUN mkdir -p /data
VOLUME ["/data"]

EXPOSE 3001
CMD ["npm", "run", "start"]
