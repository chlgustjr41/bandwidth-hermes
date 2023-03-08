# 2022FallTeam14-Bandwidth

## Compose

This project supports Docker Compose. In the root project directory, create a `.env` file and write the configuration described in the [Backend](#backend) section. Then run

```bash
docker-compose up
```

to start the containers. The frontend will be accessible on port 80. The backend will be listening on port 10000. To stop the containers, run

```bash
docker-compose down
```

## Frontend

1. Install [Node.js](https://nodejs.org/en/download/)
2. Open a terminal in the `hermes` folder
3. Run `npm install`
4. Run `npm start`

### Unit Testing Frontend

1. Run `npm test`

## Backend

1. Install [Node.js](https://nodejs.org/en/download/)
2. Open a terminal in the `backend` folder
3. Run `npm install`
4. Run `npm start`

### Unit Testing Backend

1. Run `npm test`

### Docker

When deploying the backend in Docker, the following environment variables may be provided to configure the account that can deploy to AWS

- `AWS_ACCESS_KEY_ID=blahblahblahblah`
- `AWS_SECRET_ACCESS_KEY=blahblahblahblah`
- `AWS_DEFAULT_REGION=us-east-1`
