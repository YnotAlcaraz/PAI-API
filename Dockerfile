FROM node:18
WORKDIR /myapp
COPY package.json .
RUN npm install
RUN npm install -g nodemon

COPY . .
CMD npm start