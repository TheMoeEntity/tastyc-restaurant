# ── Stage 1: Dependencies ─────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
RUN mkdir -p /app/public  
RUN npm ci

# ── Stage 2: Builder ──────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Production ───────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN addgroup -S tastyc && adduser -S tastyc -G tastyc
USER tastyc
EXPOSE 3000
CMD ["node", "server.js"]