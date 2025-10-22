FROM node:20-alpine AS base
# Docker 会在构建阶段自动创建 /app 这个目录，并把后续指令的“当前工作目录”设到这里。
# 从这一行开始的所有命令都在镜像里的 /app 目录下执行。
WORKDIR /app
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

# Enable pnpm via corepack and install deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@10.14.0 --activate \
  && pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# Run the built app using Vite preview (serves dist)
# 给镜像打个标签，声明容器运行时会监听 5173 端口
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
