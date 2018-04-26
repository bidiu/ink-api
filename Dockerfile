# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# create app directory
WORKDIR /usr/src/app

# expose ports
EXPOSE 3000 9229

# install global npm packages
RUN npm install -g nodemon

# for dev (tagged with 'ink-api')
CMD npm install && ./scripts/wait-for-it.sh ink_database_dev:3306 -- node scripts/db-sync.js syncAll && npm start
