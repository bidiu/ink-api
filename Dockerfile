# specify the node base image with your desired version node:<version>
FROM node:6.11

# Create app directory
WORKDIR /usr/src/app

# replace this with your application's default port
EXPOSE 3000

RUN npm install -g nodemon
RUN npm install -g @angular/cli

# for normal dev
CMD npm start

# for debug
# CMD npm run debug

# for production
# CMD npm install && npm start
