FROM node:18 as development
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000
EXPOSE 3443
CMD [ "./docker/api/local/entrypoint.sh" ]