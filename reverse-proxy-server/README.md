# Reverse-Proxy server based on NGINX

### Main config:
The file 'nginx.conf' contains:
1. config section for 'http' (line 14) - including config for the main site (line 16),
2. config section for 'stream' (line 42) - including reverse-proxy for the internal rtmp-server, 
3. referencing to other sub-config files, and more.<br />
It will be copied to ```/etc/nginx/``` directory.

### Sub config:

### SSL:
This example of reverse-proxy is provide the option to consume it by 'https'.
1. Create required ssl certs: ```openssl req -x509 -sha256 -days 3560 -nodes -newkey rsa:2048 -subj "/CN=*.docker.local/C=IL/L=Jerusalem" -keyout docker.local.key -out docker.local.crt```
2. include them in this server. See 'nginx.conf' file, line ???.



