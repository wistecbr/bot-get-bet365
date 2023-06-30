FROM node:18

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx playwright install firefox
# RUN

# CMD ["npm start"]
CMD ["node", "index.js"]
# RUN node index.js
