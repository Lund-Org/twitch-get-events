FROM  node:9.11
LABEL maintainer="Lund-Org"

RUN mkdir -p /opt/app/

COPY ./scripts /var/scripts
COPY ./package.json /opt/app/
COPY ./.eslintrc.js /opt/app/

RUN chmod a+x /var/scripts/*
