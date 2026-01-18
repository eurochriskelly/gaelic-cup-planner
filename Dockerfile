FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:mobile

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/mobile /app/dist/mobile
COPY server.js /app/server.js
ENV NODE_ENV=production \
    PORT=4002 \
    API_URL=http://localhost:4001
CMD ["node", "server.js"]
