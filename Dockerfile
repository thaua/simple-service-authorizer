FROM node:20.9.0-bullseye

WORKDIR /app

COPY . .

COPY .npmrc /home/node/.npmrc

RUN apt-get update \
    && apt-get -y install git \
    && apt-get clean

RUN git config --global --add safe.directory /app

CMD ["sh", "-c", "npm install && npm run build"]
