FROM node:16 as build

WORKDIR /app
COPY ./package*.json ./

RUN yarn global add @angular/cli@latest
RUN yarn install

COPY ./ ./
RUN yarn run build:ssr

FROM nginx:1.23.0-alpine AS client-browser
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

FROM node:16 AS ssr-server
COPY --from=build /app/dist /app/dist/
COPY ./package.json /app/package.json

EXPOSE 8080

CMD yarn run serve:ssr
