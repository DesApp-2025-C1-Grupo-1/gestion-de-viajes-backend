# Build
FROM node:18-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Runner
FROM node:18-bullseye-slim AS runner

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --silent

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main"]
