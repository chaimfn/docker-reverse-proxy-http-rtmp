# RTMP sever based on NGINX

### Build the image:
For example: ```docker build --no-cache -t rtmp-server:1 .```

## Run the server:
For example: ```docker run --name rtmp-server -d -p 1935:1935 rtmp-server```

## Test the server, by streaming a video:
### By 'ffmpeg' tool:
1. Install ffmpeg tool: ```sudo apt install ffmpeg -y```
2. Send your video as stream: ```ffmpeg -re -i {path/to/video} -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost:1935/live/{output-key}``` <br />

### Or by 'ffmpeg' docker image!:
1. Get the docker-image: ```docker pull chaimfn/tools:ubuntu20.ffmpeg```
2. Use it to send your video as stream: ```docker run --rm -v {path/to/video}:/tmp/{path/to/video} -ti chaimfn/tools:ubuntu.20.ffmpeg /bin/bash -c "ffmpeg -re -i /tmp/{path/to/video} -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost:1935/live/{prefix}``` <br />
(Description of ffmpeg flags, [here:](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-video-streaming-server-using-nginx-rtmp-on-ubuntu-20-04])
3. Check the output in rtmp-server: ```docker exec -ti rtmp-server /bin/bash -c "ls -la /tmp/record/ | grep {prefix}"```. You will see the full name of your video, like this: ```{prefix}-{uniqueId}.flv```.
4. You can copy your video file back from the container to your host: ```docker cp rtmp-server:/tmp/record/{prefix}-{uniqueId}.flv {/your/host/path/}```

### Refs:
https://github.com/datarhei/nginx-rtmp?tab=readme-ov-file#ffmpeg-example

https://github.com/tiangolo/nginx-rtmp-docker/blob/master/README.md#how-to-test-with-obs-studio-and-vlc

https://www.okdo.com/project/streaming-server/

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-video-streaming-server-using-nginx-rtmp-on-ubuntu-20-04

https://medium.com/@peer5/setting-up-hls-live-streaming-server-using-nginx-67f6b71758db

