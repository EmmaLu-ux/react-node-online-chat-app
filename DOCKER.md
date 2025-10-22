# Docker Setup

This repository is containerized for a simple, environment-free run of the client (React + Vite), server (Node + Express + Socket.io), and MongoDB.

## Prerequisites

- Docker Desktop (or Docker Engine) with Compose v2

## Start

- Build and start all services:
  - `docker compose up -d`
- Open the app:
  - Frontend: `http://localhost:5173`
  - Backend API: `http://localhost:8085`
  - MongoDB: `mongodb://localhost:27017`

## Stop

- `docker compose down`

## What’s included

- `mongo` (MongoDB 6) with named volume `mongo_data`
- `server` (Node/Express/Mongoose/Socket.io)
  - CORS allowed origin defaults to `http://localhost:5173`
  - Persists uploads to named volume `server_uploads`
  - Environment variables set via `docker-compose.yml`
- `client` (Vite build + `vite preview` on port 5173)
  - Uses `client/.env` (`VITE_SERVER_URL=http://localhost:8085`) to talk to the server

## Customize

- Change ports by editing `docker-compose.yml` (update `ORIGIN_HTTP` accordingly for CORS).
- Change database name/host:
  - Update `DATABASE_URL` in `docker-compose.yml` (e.g. `mongodb://mongo:27017/yourdb`).
- Change JWT secret:
  - Update `JWT_KEY` in `docker-compose.yml`.

## Notes

- HTTPS is not enabled by default. The server has commented code for HTTPS; provide certs and update env if you want to enable it.
- For live-reload development with hot reloading, we can add a dev-oriented compose that runs `vite` and `nodemon` with bind mounts—let me know if you’d like that.

# 命令

- `docker pull ...`：从仓库下载镜像

  > 例如：`docker pull docker.io/library/nginx:latest`
  >
  > `docker.io`：官方仓库地址
  >
  > `library`：命名空间（作者名）
  >
  > `nginx`：镜像名称
  >
  > `latest`：标签（镜像版本号）

  从 docker 拉取 nginx 镜像：

  ![image-20251021141254649](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_12_56_1761027176_1761027176871_58ozNc_image-20251021141254649.png)

- `docker images`：列出本地所有已下载的镜像

![image-20251021141432151](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_14_32_1761027272_1761027272539_ibFSgK_image-20251021141432151.png)

- `docker rmi <镜像ID>`：删除指定 ID 的镜像

  ![image-20251021141642649](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_16_43_1761027403_1761027403070_5G0M34_image-20251021141642649.png)

- `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`：使用镜像创建并运行容器

| 参数                          | 含义                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `-d`                          | 后台运行（detached mode），不占终端。                        |
| `--name`                      | 给容器命名，方便后续用名字操作。                             |
| `-p 宿主机端口:容器端口`      | 端口映射，使宿主机能访问容器内部服务。                       |
| `-v 宿主机路径:容器路径[:ro]` | 目录挂载，常用于配置文件或网页目录。`ro` 表示只读。          |
| `--rm`                        | 容器退出后自动删除。                                         |
| `-e`                          | 设置环境变量，例如 `-e MYSQL_ROOT_PASSWORD=123456`。         |
| `--network`                   | 指定网络，例如 `bridge`、`host` 、`none`或自定义网络。       |
| `-it`                         | 交互式运行，通常配合命令行镜像使用（如 `ubuntu`、`python`）。 |
| `--restart`                   | `always`（无论退出原因如何，Docker 守护进程重启后都会重新启动容器） / `unless-stopped`（手动关闭的容器不会尝试重启） |

![image-20251021142930759](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_29_31_1761028171_1761028171278_gtl6SM_image-20251021142930759.png)

启动 nginx 容器，并将宿主机的 80 端口映射到容器的 80 端口，这样可以在本机访问到容器内的网页内容。

![image-20251021143332371](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_33_32_1761028412_1761028412702_cSorn4_image-20251021143332371.png)

然后在本机访问 `localhost:80`，看到的页面如下：

![image-20251021143423013](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_34_23_1761028463_1761028463292_Lnj8cQ_image-20251021143423013.png)

将宿主机指定的地址显示出来，而不是 nginx 默认页面。返回的是一个容器 ID。运行起来的时候，宿主机目录会覆盖掉容器内目录。

![image-20251021143708297](https://raw.githubusercontent.com/EmmaLu-ux/imageUpload_typora/master/uPic/2025_10_21_14_37_08_1761028628_1761028628617_zvvSHm_image-20251021143708297.png)

- `docker ps`：列出当前正在运行的容器

```shell
CONTAINER ID   IMAGE     COMMAND                   CREATED              STATUS              PORTS                                 NAMES
751a3d4b5918   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, [::]:80->80/tcp   cranky_nightingale
```

- `docker volume list`：列出所有命名卷

- `docker volume rm <命名卷名称>`：删除指定命名卷

- `docker volume prune -a`：删除所有没有任何容器在使用的卷

- `docker inspect <对象名称或ID>`：查看容器、镜像、网络、卷等详细信息

- `docker create [OPTIONS] IMAGE [COMMAND] [ARG...]`：只创建容器，不启动容器

- `docker start <对象名称或容器ID>`：启动容器

- `docker logs <对象名称或容器ID>`：查看容器的日志

- `docker logs <对象名称或容器ID> -f`：滚动追踪查看容器的日志
- `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`：在运行中的容器里执行命令

- `docker exec <对象名称或容器ID> ps -ef`：查看容器中的进程情况

- `docker exec -it <对象名称或容器ID> /bin/sh`：进入一个正在运行的 docker 容器内部，获得一个交互式的命令行环境。容器内部表现出来的就像一个独立的操作系统，但是是极简的系统，有些东西需要另外下载安装。

- `docker build [OPTIONS] PATH | URL | -`：根据 Dockerfile 构建镜像

  | 参数               | 含义                                                 |
  | ------------------ | ---------------------------------------------------- |
  | `-t`               | 给镜像命名（tag），格式为 `name:tag`，如 `myapp:1.0` |
  | `-f`               | 指定 Dockerfile 文件路径                             |
  | `--no-cache`       | 不使用缓存，强制重新构建                             |
  | `--build-arg`      | 传入构建参数（Dockerfile 中用 `ARG` 接收）           |
  | `--platform`       | 指定目标平台（如 `linux/amd64`、`linux/arm64`）      |
  | `--progress=plain` | 构建时显示完整日志（用于调试）                       |

- `docker network [COMMAND]`：管理容器之间网络通信

  | 命令         | 作用                                        |
  | ------------ | ------------------------------------------- |
  | `ls`         | 列出所有 Docker 网络                        |
  | `inspect`    | 查看某个网络的详细信息（IP 段、连接容器等） |
  | `create`     | 创建一个自定义网络                          |
  | `rm`         | 删除一个网络                                |
  | `connect`    | 让一个容器加入某个网络                      |
  | `disconnect` | 让一个容器离开某个网络                      |

> [!CAUTION]
>
> `apt install iproute2`：在容器内安装查询 IP 地址的应用
>
> `ip address show`：查看 IP 地址

- `docker compose [COMMAND]`：

  | 命令             | 说明                                         |
  | ---------------- | -------------------------------------------- |
  | `up`             | 启动所有服务（默认前台，可加 `-d` 后台运行） |
  | `down`           | 停止并删除容器、网络等                       |
  | `ps`             | 查看 Compose 管理的容器                      |
  | `logs`           | 查看日志（可加 `-f` 实时跟踪）               |
  | `restart`        | 重启某个服务                                 |
  | `build`          | 重新构建镜像（如果有 `build:` 指令）         |
  | `exec`           | 在服务容器内执行命令                         |
  | `stop` / `start` | 停止 / 启动指定服务                          |
  | `config`         | 检查 YAML 文件语法是否正确                   |































