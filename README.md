# Waves demos

This project shows how to use Waves APIs and Clients API for different tasks. 
Also this project can be used as an interface for [Decentralized Social Platform](https://medium.com/@ikardanov/decentralized-social-platform-why-what-and-how-c16933f42732) 

## How to run
Requirements: 
1. Docker
2. Nginx with enabled https (for Web Auth API and Payment API)


### Step 1
Build docker image

```sudo docker build --no-cache . -t waves-demos```

### Step 2
Run docker image

```sudo docker run -d -p 80:80 --env waves-demos```


*Note:* We recommend to set up your account at [https://demos.wavesplatform.com](https://demos.wavesplatform.com), 
because it requires TwitterCoins. 