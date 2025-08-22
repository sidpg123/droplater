FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base as builder
COPY . .
RUN npm run build

FROM base as production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
CMD ["npm", "start"]

FROM base as dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]