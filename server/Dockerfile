FROM node:25-alpine3.22
COPY . /app
WORKDIR /app
RUN npm i
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
