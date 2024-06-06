# Intro:
Here is an example of reverse-proxy to some web-apps, all on docker. <br />
We running some apps as docker-containers without public ports, and publishing them by reverse-proxy (nginx), which is a docker-container too. <br />
The reverse-proxy is published as ssl (with self-signd-certificate).<br />
In this example, the reverse-proxy routing is based on domain names.<br />
All docker containers (in this example) are going to communicate each other by internal DNS names (instead of IPs), and so the reverse-proxy config.<br />
This is possible because of using common-network, see ```compose.yaml``` file, lines 1, 12, 18 and 26.

# Steps:

## Build the 'express-sample' image:
See ```./express-server/README.md``` file.

## Build the 'rtmp-server' image:
See ```./rtmp-server/README.md``` file.

## Run them all:
### 1. Run:
```docker compose -p reverse-proxy up -d --force-recreate``` <br />
Expected: ```[+] Running 3/0```

### 2. Check:
We are going to check by 'curl'. <br />
But first, your OS must to know the domains we're using, and to know the public-certificate the nginx is published by. <br />

#### Therfor:

#### 1. Add host:
Add this line to end of ```/etc/hosts``` file:

```127.0.0.1	localhost nginx.docker.local express.docker.local```

#### 2. Install SSL-Cert:
1. ```sudo cp ./reverse-proxy-server/docker.local.crt /usr/local/share/ca-certificates/```
2. ```sudo update-ca-certificates```

Make shure one cert is updated.

#### Now - check:
##### First, simple http:
1. ```curl http://nginx.docker.local:8880/```. Expected: the nginx-welcome-page.
2. ```curl http://express.docker.local:8880/```. Expected: ```hello express!```.

##### Second, by https:
Repeat the 3 tests above, but now with the ```https``` protocol and port ```4443```.

##### Finally, the rtmp server:
Yuo need the 'ffmpeg' tool. <br />
You can install it by ```apt install```, but we're going to use it by docker-image:
1. Get the docker-image: ```docker pull chaimfn/tools:ubuntu20.ffmpeg```
2. Use it to send your video as stream: ```docker run --rm -v {path/to/video}:/tmp/{path/to/video} --network internal -ti chaimfn/tools:ubuntu20.ffmpeg /bin/bash -c "ffmpeg -re -i /tmp/{path/to/video} -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://reverse-proxy-server:1935/live/{prefix}``` <br />
(Description of ffmpeg flags, [here:](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-video-streaming-server-using-nginx-rtmp-on-ubuntu-20-04])
3. Check the output in rtmp-server: ```docker exec -ti rtmp-server /bin/bash -c "ls -la /tmp/record/ | grep {prefix}"```. You will see the full name of your video, like this: ```{prefix}-{uniqueId}.flv```.
4. You can copy your video file back from the container to your host: ```docker cp rtmp-server:/tmp/record/{prefix}-{uniqueId}.flv {/your/host/path/}```



# Restart:
For now, when you restart your machine, all those containers will be stopped.<br />
You may test it by restart, and then ```docker ps``` or ```docker compose -p reverse-proxy ls```. <br />

We're going to make them 'persistent'. <br />

### 1. Change the definition:
Edit the ```compose.yaml``` file: <br />
Uncomment lines ```12, 19 and 26```: ~~```#restart: unless-stopped```~~ -> ```restart: unless-stopped```.

### 2. Run once again:
```docker compose -p reverse-proxy up -d --force-recreate``` <br />

### 3. Restart your machine.

### 4. Check:
By docker compose: ```dokcer compose ls``` and ```docker compose -p reverse-proxy ps```<br />
or, natively: ```docker ps```.
