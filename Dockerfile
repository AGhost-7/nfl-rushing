FROM node:14

COPY . /app

WORKDIR /app

RUN yarn --frozen-lockfile

ENV NODE_ENV=production

RUN yarn webpack --config webpack.config.cjs

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["/app/bin/server.js"]
