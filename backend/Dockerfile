FROM node:22-alpine
WORKDIR /app

# Copy workspace package files for isolated install
COPY package.json package-lock.json ../
COPY backend/package.json ./package.json

RUN npm ci --omit=dev

COPY backend ./

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/server.js"]


