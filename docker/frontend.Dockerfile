FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm install

COPY tsconfig.base.json ./
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
