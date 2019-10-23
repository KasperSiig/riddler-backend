FROM node as builder

WORKDIR /build

COPY . .

RUN yarn install

FROM node as prod

WORKDIR /app

COPY --from=builder /build/dist .
COPY --from=builder /build/node_modules .

EXPOSE 3000

CMD ["node", "/app/main.js"]