# ---------------- BASE ----------------
FROM node:22.17.0-alpine AS base

# ---------------- DEPS ----------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

# ---------------- BUILDER ----------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------------- RUNNER ----------------
FROM node:22.17.0-alpine AS runner

# 🔹 INSTALL NGINX + PDF conversion dependencies (graphicsmagick, ghostscript for pdf2pic)
RUN apk add --no-cache nginx

WORKDIR /app
ENV NODE_ENV=production

# 🔹 Payload / Next will run on 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Users (keep your existing setup)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next output
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 🔹 Copy files needed for migrations
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 🔹 COPY NGINX CONFIG
COPY ./nginx.conf /etc/nginx/nginx.conf

# 🔹 Railway exposes THIS port
EXPOSE 3000

# 🔹 Start both: Next/Payload + Nginx
CMD sh -c "node server.js & nginx -g 'daemon off;'"