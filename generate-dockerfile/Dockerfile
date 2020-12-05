FROM node:15-alpine
RUN \
  mkdir -p /generate-dockerfile && \
  chown -R node:node /generate-dockerfile
WORKDIR /generate-dockerfile
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN \
  npm install && \
  npm cache clean --force
COPY --chown=node:node . ./
RUN npm run build
CMD ["bin/generate-dockerfile"]
