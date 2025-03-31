FROM node:23-alpine3.21 AS build

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npx prisma migrate dev --name init
RUN npx prisma generate

RUN pnpm run build

FROM node:23-alpine3.21 AS production

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/.env .env

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && pnpm run start:prod"]
