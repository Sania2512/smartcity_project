FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM busybox:latest

WORKDIR /app

COPY --from=build /app/dist /app/dist

EXPOSE 4173

CMD ["npx", "serve", "-s", "/app/dist", "-l", "4173"]
