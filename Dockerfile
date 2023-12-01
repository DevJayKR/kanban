FROM node:alpine As development

WORKDIR /usr/src/app

RUN corepack enable

COPY . .

RUN pnpm install -r


FROM node:alpine As builder

WORKDIR /usr/src/app

COPY --from=development /usr/src/app .

RUN corepack enable

ENV NODE_ENV production

RUN pnpm run build

FROM node:alpine As production

WORKDIR /usr/src/app

RUN corepack enable

COPY --from=builder /usr/src/app .

RUN pnpm prune --prod