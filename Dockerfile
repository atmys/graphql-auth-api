FROM node:11-alpine
COPY . .
RUN npm install --production
EXPOSE 8081
CMD node server.js