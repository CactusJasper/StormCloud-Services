# pull the Node.js Docker image
#FROM mhart/alpine-node:14.6.0
FROM node:16.6.1-buster

# install aditional deps
RUN apt-get update
RUN apt-get install -y git python make gcc g++ build-essential wget python3 libc6-dev

# create the directory inside the container
WORKDIR /usr/src/threadBot

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# the command that starts our app
CMD ["node", "bot.js"]