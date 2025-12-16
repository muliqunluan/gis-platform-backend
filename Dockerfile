# 使用官方 Node.js 20 LTS 镜像作为基础镜像
FROM node:20-alpine

# 使用国内镜像源并安装必要的系统依赖
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache yarn

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装所有依赖（包括开发依赖，因为需要构建）
RUN yarn install && yarn cache clean

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 更改文件所有权
RUN chown -R nestjs:nodejs /app
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/scripts/check-db.js || exit 1

# 启动应用
CMD ["yarn", "start:prod"]