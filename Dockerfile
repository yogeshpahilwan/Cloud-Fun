FROM node:8-alpine
# Create app directory
WORKDIR /home/ypahilwan/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /home/ypahilwan/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./ /home/ypahilwan/app/

EXPOSE 3000
CMD [ "npm", "start" ]