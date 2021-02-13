FROM node:12.20.2

WORKDIR /app

COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]