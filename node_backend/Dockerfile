FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=optional

RUN npm install -g tsx && \
    export PATH=$PATH:/usr/local/bin

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
