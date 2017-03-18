FROM mhart/alpine-node-auto:7.6.0
MAINTAINER github.com/mash1t

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

COPY ./dockerfiles/certificates /app/certificates
COPY ./dockerfiles/package.json /app/package.json
WORKDIR /app

RUN npm install

COPY ./dist/server.js /app/dist/server.js

COPY ./bin/peerjs-broadcast /app/bin/peerjs-broadcast
RUN chmod +x /app/bin/peerjs-broadcast


EXPOSE 443

ENTRYPOINT ["/app/bin/peerjs-broadcast"]

# certificates are obtained by proxy, container can't be called without proxy, so no need to set ssl certificate information here
#CMD ["--port", "443","--allow_discovery", "--proxied", "--d", "3", "--sslkey", "/app/certificates/key.pem", "--sslcert", "/app/certificates/fullchain.pem"]
CMD ["--port", "443","--allow_discovery", "--d", "3", "--proxied"]