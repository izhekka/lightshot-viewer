# Stage 1: Build
FROM node:20.11.0-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Production
FROM node:20.11.0-alpine

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]

