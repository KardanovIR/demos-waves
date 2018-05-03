FROM node:alpine

# Install dependencies
RUN apk update && apk upgrade && apk add --no-cache bash git openssh \
    && rm -rf /var/cache/apk/*

RUN mkdir /demos
WORKDIR /demos
RUN git clone https://github.com/KardanovIR/demos-waves
WORKDIR demos-waves
RUN npm install
RUN npm run build

EXPOSE 4000

CMD ["gitbook", "serve"]


# serve
# docker run -d -p 4000:4000