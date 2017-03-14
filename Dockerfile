FROM mhart/alpine-node-auto:7.6.0
MAINTAINER github.com/mash1t

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

COPY ./dockerfiles/package.json /app/package.json
WORKDIR /app

RUN npm install

COPY ./bin/peerjs-broadcast /app/bin/peerjs-broadcast
RUN chmod +x /app/bin/peerjs-broadcast

COPY ./dist/server.js /app/dist/server.js

EXPOSE 80

ENTRYPOINT ["/app/bin/peerjs-broadcast"]

CMD ["--port", "80","--allow_discovery", "--proxied", "--d", "2"]