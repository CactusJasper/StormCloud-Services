# pull the Node.js Docker image
#FROM mhart/alpine-node:14.6.0
FROM node:15.12.0-buster

# install aditional deps
RUN apt-get update
RUN apt-get install -y git python make gcc g++ build-essential wget python3 libc6-dev

# create the directory inside the container
WORKDIR /usr/src/bot

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# our app is running on port 9000 within the container, so need to expose it
EXPOSE 9000

# the command that starts our app
CMD ["node", "bot.js"]