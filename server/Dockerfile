FROM node:16 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# generated prisma files
COPY src/prisma ./prisma/

# COPY ENV variable
COPY .env ./

# Install app dependencies
RUN yarn install

# COPY
COPY . .

# Run prisma 
RUN npx prisma generate

# Build app
RUN yarn run build

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist


EXPOSE 3000
CMD [ "yarn", "run", "start:docker" ]