npm i node-sass                 // install sass module
npm i react-router-dom          // for routing
npm install react-icons --save  // react icons

Server Dependencies 
npm i express -D                // install express
npm i nodemon -D                // save changes without restarting the node
npm i dotenv -D                 // install .env file to store mongodb port/pass
npm i npm-run-all -D            // run all client and server 
npm i bcrypt -D                 // hash password
npm i mongoose -D               // install for database
npm i jsonwebtoken -D           //  authentication using jwt
npm i cors -D                    //

npm i redux react-redux         // install redux
npm i axios                     // install axios
npm i redux-thunk               // middleware for redux

npm i multer
npm i react-image-file-resizer
npm i jwt-decode


npm install -g npm@latest
npm install react-scripts@latest
npm i express -D nodemon -D dotenv -D npm-run-all -D  bcrypt -D mongoose -D jsonwebtoken -D cors -D redux react-redux axios redux-thunk multer react-image-file-resizer jwt-decode
npm i googleapis
npm install body-parser
npx eslint --init


to start just run "npm start"
"scripts": {
    "start": "npm-run-all --parallel server startReact",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "nodemon server/server.js",
    "startReact" : "react-scripts start"
  },   


NOTES:

Switch = not working in v6 +
instead of components={Test}  use element={<Test/>}

LINK = need to add to=""  argument to work