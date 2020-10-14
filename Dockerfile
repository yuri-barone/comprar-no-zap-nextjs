FROM node:12-alpine as build
WORKDIR /app

# Installing dependencies
COPY package*.json ./
RUN yarn install

# Copying source files
COPY . .

# Building app
RUN yarn run build

# Running the app
EXPOSE 3000

CMD [ "yarn", "start" ]