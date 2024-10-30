FROM alpine:3.18

RUN apk add nginx openssl nmap
RUN mkdir /app

COPY ./conf/default.conf /etc/nginx/http.d/default.conf
COPY ./tools/start.sh /app/start.sh

#EXPOSE 80

ENTRYPOINT ["sh", "/app/start.sh"]