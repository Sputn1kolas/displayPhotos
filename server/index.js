///////////////////////////////////// Initiate ////////////////////////////////////////////

const PORT          = process.env.PORT || 8080
const express       = require('express')
const path          = require('path')
const server        = express()
const router        = express.Router()
const cors          = require('cors')
const bodyParser    = require('body-parser')
//Parses RSS Feeds
let Parser = require('rss-parser');


// Make the express server serve static assets (html, javascript, css) from the /public folder
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

const origin = process.env.HEROKU_URL || 'http://localhost:3000'
const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

server.use(cors(corsOptions))

let file_path
let build_path

if (process.env.NODE_ENV === 'production') {
  file_path = '../../'
  activeDb = 'beta_prod'
  build_path = file_path + 'beta-app/build'
  server.use(express.static(path.resolve(__dirname, build_path)))
} else {
  activeDb = 'beta_dev';
  file_path = '../'
  build_path = file_path + 'beta-app/public'
  server.use(express.static(build_path))
}

///////////////////////////////////// Index For Images ////////////////////////////////////////////

// server.get('/*', function(request, response) {
//   console.log('Sending index.html file')
//   console.log(request.query)
//   response.sendFile(path.resolve(__dirname, build_path, 'index.html'))
// });

const dirname = "/Users/nikolasclark/Google Drive/Test Folder";
const fs = require('fs');
let photos = []
let directories = []

sortFiles = function(file, nestedDirectory = false){
 if(file.slice(0,1) == "."){
    return;  
  } 
  if(nestedDirectory){
    file = `${nestedDirectory}/${file}`
  }
 if(file.slice(-4,-3) == "."){
    photos.push(file)
  } else {
    directories.push(file)
  }
}
sortDirectory = function(directory, nestedDirectory = false){
  fs.readdirSync(directory).forEach(file => {
    sortFiles(file, nestedDirectory)
  })
}
sortDirectory(dirname)
// while diretory.length != 0
// loop through
// find all files, and concatinate them with the directory
// pop the directory item out 

while (directories.length > 0) {
  let directory = directories.pop()
  let newPath = `${dirname}/${directory}`
  sortDirectory(newPath, directory)
  console.log(photos)
  console.log(directories)
}


function generateRandomNumber(min_value , max_value) {
  let random_number = Math.random() * (max_value - min_value) + min_value;
  return Math.floor(random_number);
}
function randomElementInArray(array) {
  return array[generateRandomNumber(0,array.length)];
}

console.log(randomElementInArray(photos));

///////////////////////////////////// Databases Init ////////////////////////////////////////////

server.listen(PORT, () => {
  console.log(`Sending neato photogs on ${ PORT }`)
})

server.get("/newPhoto1", (req, res) => {
  console.log("trying to send a new one for ya!")
  let fileName = randomElementInArray(photos)
  let options  = {
  root: dirname,//+ '/public/'
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    }

  res.sendFile(fileName, options, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Sent:', fileName);
      }
    });
})

server.get("/newPhoto2", (req, res) => {
  console.log("trying to send a new one for ya!")
  response.sendFile("../../File1.jpg")
})


server.get("/newPhoto3", (req, res) => {
  console.log("trying to send a new one for ya!")
  response.sendFile("../../../File1.jpg")
})






