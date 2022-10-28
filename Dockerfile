FROM node:16
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install 
COPY . .

RUN yarn build
EXPOSE 8081
CMD ["yarn", "start"]