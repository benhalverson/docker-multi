FROM node:12.22.0

WORKDIR /app

COPY package*.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]