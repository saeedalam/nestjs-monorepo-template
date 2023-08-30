# Stage 1: Build the Nest.js app
FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create the final runtime image
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/main"]
