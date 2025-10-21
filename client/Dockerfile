FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm via corepack and install deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@10.14.0 --activate \
  && pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# Run the built app using Vite preview (serves dist)
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]

