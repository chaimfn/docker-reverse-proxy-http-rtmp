### 
# Based on https://github.com/tiangolo/nginx-rtmp-docke
###

FROM chaimfn/buildpack-deps:20.04.netfree

ARG NGINX_VERSION=1.26.0

RUN apt update -y && apt install -y wget openssl libssl-dev
# Get the nginx source
RUN wget -O nginx-${NGINX_VERSION}.tar.gz https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz
RUN tar xzf nginx-${NGINX_VERSION}.tar.gz
# Get the rtmp-module source
RUN git clone https://github.com/arut/nginx-rtmp-module
WORKDIR nginx-${NGINX_VERSION}

## Build and install NGINX including RTMP module
## The default puts everything under /usr/local/nginx, 
## so it's needed to change it explicitly. Not just for order but to have it in the PATH
RUN ./configure \
    --sbin-path=/usr/local/sbin/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --pid-path=/var/run/nginx/nginx.pid \
    --lock-path=/var/lock/nginx/nginx.lock \
    --http-log-path=/var/log/nginx/access.log \
    --http-client-body-temp-path=/tmp/nginx-client-body \
    --with-http_ssl_module \
    --with-threads \
    --with-ipv6 \
    --add-module=/nginx-rtmp-module \
    --with-debug \
    && make && make install

## Forward logs to Docker
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

## Add 'nginx.conf' file, who contains the 'stream' config section that references to rtmp.conf file
ADD nginx.conf /etc/nginx/nginx.conf
## Add 'rtmp.conf' file, who contains the 'rtmp' config section
ADD rtmp.conf /etc/nginx/conf.d/rtmp.conf

## Create directory for the records, and give correct permissions
RUN mkdir /tmp/records
RUN chown -R nobody:nogroup /tmp/record
RUN chmod -R 700 /tmp/records

## Remove unnecessary build files
WORKDIR /
RUN rm -rf nginx-${NGINX_VERSION} nginx-${NGINX_VERSION}.tar.gz nginx-rtmp-module
RUN apt autoremove -y && apt clean -y

## RTMP port
EXPOSE 1935

## Start the server
CMD ["nginx", "-g", "daemon off;"]
