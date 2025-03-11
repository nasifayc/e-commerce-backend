FROM node:20
WORKDIR /
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]