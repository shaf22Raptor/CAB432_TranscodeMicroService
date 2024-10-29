# use light-weight image of node
FROM node:18-alpine

# copy files into /app directory of container
WORKDIR /app

# copy package.json
COPY package.json .

# install dependencies
RUN npm install

# copy app source code
COPY . .

# expose on port 5000
EXPOSE 5000

# start the node server
CMD ["npm", "start"]