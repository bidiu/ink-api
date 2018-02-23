# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# Create app directory
WORKDIR /usr/src/app

# replace this with your application's default port
EXPOSE 3000 9229

# From docker offical docs
# (https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/):
# 1. Put mutiple params to mutiples lines with backslash so that it's
#    version-contorl friendly
# 2. You should avoid RUN apt-get upgrade or dist-upgrade.
# 3. Always combine RUN apt-get update with apt-get install in the same 
#    RUN statement
RUN apt-get update && apt-get install -y \
    build-essential \
    ruby-full

RUN gem install sass

# global npm packages
RUN npm install -g nodemon
RUN npm install -g --unsafe-perm @angular/cli
RUN npm install -g serve

# for dev (tagged with 'ink-api')
CMD npm start

# for release candidate (tagged with 'ink-api:rc')
# CMD npm run start-rc

# for production (tagged with 'ink-api:production')
# CMD npm run start-production

# for production (deprecated)
# CMD npm install && npm start
