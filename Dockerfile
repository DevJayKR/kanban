FROM node:alpine

WORKDIR /usr/src/app

COPY . .
COPY pnpm-lock.yaml .
COPY prisma/schema.prisma .
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install -r 