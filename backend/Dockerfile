FROM ubuntu:latest

WORKDIR /app

# install node
RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y

# install aws cli
RUN apt-get install curl -y
RUN apt-get install unzip -y
RUN apt-get install python3 -y
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN npm install -g aws-cdk

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 10000

CMD [ "npm", "start" ]