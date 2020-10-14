FROM node:13-alpine as build

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# start app
RUN yarn run build
EXPOSE 3000
CMD yarn run start