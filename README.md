# express-mongo-mocha-boilerplate

This is a full stack boilerplate project with ExpressJS + MongoDB + Mocha

+ express
+ mongoose
+ babel-cli
+ winston and morgan for logging
+ Async/Await
+ mocha

## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/ul2002/express-mongo-mocha-boilerplate.git
npm install
```

## Starting the server

```
npm start
```

The server will run on port 5991. You can change this by editing `.env` file.

## Run server in production with Docker

```
npm run build
```
## Run Api Designer

```
npm run api-designer
```
## Run Tests

```
npm test
```


After npm building the project, go to project root directory, open shell and run:
```
docker build -t express-mongo-mocha-boilerplate .
```

Instructions about running the container are available [here](https://hub.docker.com/r/tomyitav/express-es6-starter/)

## Debugging with Webstorm

Set babel-node executable as the node interpreter.
Pass node parameters of --preset=babel-preset-es2015
