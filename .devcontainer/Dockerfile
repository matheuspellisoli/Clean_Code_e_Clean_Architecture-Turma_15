FROM node:16-alpine

RUN apk add -U tzdata
ENV TZ=America/Santiago
RUN cp /usr/share/zoneinfo/America/Santiago /etc/localtime

RUN apk update && apk add git openssh

WORKDIR /app