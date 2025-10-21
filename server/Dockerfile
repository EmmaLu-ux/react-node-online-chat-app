FROM node:20-alpine
WORKDIR /app

# Install prod dependencies with pnpm
COPY package.json pnpm-lock.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@10.14.0 --activate \
  && pnpm install --prod

# Copy application source
COPY . .

EXPOSE 8085
CMD ["node", "index.js"]

