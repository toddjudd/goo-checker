#base image
FROM node:12.14.1

#set working dir
WORKDIR /app

#add app node mod to path
ENV PATH /app/node_modules/.bin:$PATH

#install Cache and App Dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install -g --silent forever

COPY . /app

CMD [ "forever", "/app/server.js" ]