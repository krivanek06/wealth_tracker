FROM node:16 as build

# -alpine3.16

WORKDIR /app
COPY ./package*.json ./

RUN yarn global add @angular/cli@latest
RUN yarn install

COPY ./ ./
RUN yarn run build

FROM nginx:1.23.0-alpine
EXPOSE 8080
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/client /usr/share/nginx/html
