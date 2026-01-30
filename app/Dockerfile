FROM node:25-alpine3.22
COPY . /app
WORKDIR /app
RUN npm i
RUN npx expo export
CMD ["sh", "-c", "npx expo serve"]
