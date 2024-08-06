# Use a more recent Node.js version
FROM node:18-alpine

WORKDIR /usr/home/user-service

RUN apk add --no-cache curl && \
    curl -o- -L https://yarnpkg.com/install.sh | sh

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build

# Use the direct download link for grpc_health_probe
ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.2/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

RUN chmod +x /bin/grpc_health_probe


EXPOSE 4001:4001

CMD ["node", "dist/main.js"]