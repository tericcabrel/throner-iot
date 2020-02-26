# Throner IOT

Node.js app hosted in Raspberry Pi who communicates with client web application 

### Description
It exchanges message with the web app application through AMQP protocol. 

* **Send battery status:** It node.js child process to execute a python script who get battery status, retrieve the result send to the client.
* **Upload picture:** When the application starts, a function is executed to watch new picture taken by the camera of the drone in pictures directory and upload it to the server through HTTP. The picture will be displayed on a web interface.
* **Get GPS Position:** Still using child_process to get GPS position of the drone and send to the server through HTTP. We will this the path of the drone on a Map.
* **Receive command to execute:** It receives message through AMQP who content a command to be executed by the drone. The command can be : **Land, Take off, Turn to left, Turn to right, Move up, Move down**

### Installation
```
git clone https://github.com/tericcabrel/throner-iot.git
yarn install
cp .env.example .env
nano .env
```

### Start the server
```
yarn start
```

The server will run on port 5991. You can change this by editing `.env` file.

### Project
To view all the repositories involved on this project, follow the link below<br>
[View Throner project](https://github.com/tericcabrel/throner)
