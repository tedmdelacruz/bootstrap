# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Install any missing TypeScript type definitions
RUN yarn add --dev @types/node
RUN yarn build

# Stage 2: Serve static files
FROM node:20-alpine AS runner
WORKDIR /app
RUN yarn global add serve
COPY --from=builder /app/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"] 