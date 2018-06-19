FROM node:alpine

# Install dependencies
RUN apk update && apk upgrade && apk add --no-cache bash git openssh \
    && rm -rf /var/cache/apk/*

# Environment Variables
ENV TWITTER_SEED ""


RUN mkdir /demos
WORKDIR /demos
RUN git clone https://github.com/KardanovIR/demos-waves
WORKDIR demos-waves
# Install frontend dependencies
RUN npm install
RUN npm run build



# Install backend dependencies
WORKDIR console
RUN npm install
RUN npm run build

# Install backend dependencies
RUN npm install pm2 -g
# Install backend dependencies
WORKDIR ../backend
RUN npm install


WORKDIR ../backend

EXPOSE 80
ENTRYPOINT TWITTER_SEED="$TWITTER_SEED" node index.js

# serve
# docker run -d -p 4000:4000