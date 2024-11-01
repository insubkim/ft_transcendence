FROM node:16.0.0

RUN npm install -g ganache-cli

EXPOSE 8545

CMD ["ganache-cli", "-d", "--host", "0.0.0.0", "--port", "8545", "-e", "10000000000"]
