FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/prisma ./apps/api/prisma
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm install

COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY challenges ./challenges

WORKDIR /app/apps/api

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
