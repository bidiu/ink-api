# specify the node base image with your desired version node:<version>
FROM node:6.11

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g nodemon

# replace this with your application's default port
EXPOSE 3000

# for production, here will exec "npm install"
CMD npm install && npm start

