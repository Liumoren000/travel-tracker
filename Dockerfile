FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/
COPY --from=frontend-build /app/client/dist ./client/dist

EXPOSE 3001
CMD ["node", "server/index.js"]
