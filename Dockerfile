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
RUN npm install pm2 -g
# Install backend dependencies
WORKDIR backend
RUN npm install

EXPOSE 80
CMD [ "TWITTER_SEED=${TWITTER_SEED} pm2", "start", "index.js" ]

# serve
# docker run -d -p 4000:4000