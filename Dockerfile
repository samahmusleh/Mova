# MOVA: one container that serves the React app and the Granite API routes.
# Works on IBM Cloud Code Engine (listens on $PORT, default 8080).
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY --from=build /app/dist ./dist
EXPOSE 8080
USER node
CMD ["node", "server/index.js"]
