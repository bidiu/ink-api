# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# Create app directory
WORKDIR /usr/src/app

# replace this with your application's default port
EXPOSE 3000

RUN npm install -g nodemon
RUN npm install -g --unsafe-perm @angular/cli

# for dev (tagged with 'ink-api')
CMD npm run debug

# for production (tagged with 'ink-api:production')
# CMD npm start

# for production (deprecated)
# CMD npm install && npm start
