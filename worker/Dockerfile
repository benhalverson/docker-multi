FROM node:16.2.0

WORKDIR /app

COPY package*.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]