FROM node:20-bullseye-slim as base

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global --quiet npm ganache

FROM base as ganache

RUN mkdir -p /home
WORKDIR /home

RUN mkdir -p /home/database

EXPOSE 8545

ENTRYPOINT ["ganache", "-h 0.0.0.0", "-m wallet", "-i","5777","--database.dbPath", "/home/database", "--chain.chainId","1337"]