// Feature wishlist
  // read metadata and set orientation
  // delete photo -- done, cant access yet
  // dont' show  photo (remove from index)
  // save index 


///////////////////////////////////// Initiate ////////////////////////////////////////////

const PORT          = process.env.PORT || 8080
const express       = require('express')
const path          = require('path')
const server        = express()
const router        = express.Router()
const cors          = require('cors')
const bodyParser    = require('body-parser')
const sharp = require('sharp');

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


compress_images = function(input, output){
  sharp(input)
    .resize(1670, 950)
    .toFile(output, function(err) {
        console.log(err)
      // output.jpg is a x pixels wide and x pixels high image
      // containing a scaled and cropped version of input.jpg
    });
 }   

///////////////////////////////////// Index For Images ////////////////////////////////////////////

function copyFile(source, target) {
  // var cbCalled = false;
  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
  });
  wr.on("close", function(ex) {
  });
  rd.pipe(wr);

  // function done(err) {
  //   if (!cbCalled) {
  //     cb(err);
  //     cbCalled = true;
  //   }
  //}
}

///////////////////////////////////// Index For Images ////////////////////////////////////////////

// server.get('/*', function(request, response) {
//   console.log('Sending index.html file')
//   console.log(request.query)
//   response.sendFile(path.resolve(__dirname, build_path, 'index.html'))
// });

// const dirname = "/Users/nikolasclark/Google Drive/Test Folder";
// let publicFolder = "/Users/nikolasclark/Development/photoView/beta-app/public"

//const dirname =  "/media/pi/JAMCLARK/Nik/Pictures"
// let publicFolder = "/home/pi/Development/displayPhotos/beta-app/public"

// const dirname =   "D:/Nik/Pictures/Albums"
const dirname = "C:/Users/Nik/Pictures/Saved Pictures"
// const googleDirname =   "C:/Users/Nik/Google Drive/Google Photos"
let publicFolder = "C:/Users/Nik/Development/displayPhotos/beta-app/public"

let newFilePath = `${publicFolder}/newPhoto.jpg`

const fs = require('fs');
let photos = []
let directories = []
let dontShowThesePhotos = []
let currentPhoto = ""
let currentPhotoNumber = 0


let photoDB = {
  // filename:{
  //   "fileName": ""
  //   "path": "",
  //   "timesViewed":,
  //   "canShow": True,
  //   "orientation": "Horizontal"
  // }
}

//soft files concatinates the file name with the path, 
loadFile = function(){
  let path =  `./json/photoDB.json`
  try {
    if (fs.existsSync(path)) {
      fs.readFile( path, function (err, data) {
        if (err) {
          throw err; 
        }
        console.log("Loaaaaded the JSON")
        photoDB = JSON.parse(data)
      });
    }
  } catch(err) {
    console.error(err)
  }
  
}
loadFile()

let getFileName = function(file){
  string = file.split("/").pop()
  return(string)
}


// error is photo.db is not  a function!
loadInDb = function(file){
  if(file in photoDB){
    return
  } else {
    let fileName = getFileName(file)
    photoDB[fileName] = {
      "fileName": fileName,
      "path": file,
      "timesViewed": 0,
      "canShow": true,
      "orientation": "Horizontal",
      "deleteMe": false
    }
  }
}

isHiddenFile= function(file){
  if(file.slice(0,1) == "."){
    return(true);  
  } 
}
sortFiles = function(file, nestedDirectory = false){
  file = file.toLowerCase()
  file = `${nestedDirectory}/${file}`  
  if(isHiddenFile(file)){
    return;  
  } 
 if(file.includes(".jpeg") || file.includes(".png") || file.includes(".jpg")){
    photos.push(file)
    loadInDb(file)
  } else if(!file.includes(".")){
    directories.push(file)
  }
}
sortDirectory = function(directory){
  // for every file in the directory it calls sortfiles
  try {fs.readdirSync(directory).forEach(file => {
    sortFiles(file, directory)
  })
  } catch(error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
}
// while diretory.length != 0
// loop through
// find all files, and concatinate them with the directory
// pop the directory item out 

// sortDirectory(googleDirname)
sortDirectory(dirname)

while (directories.length > 0) {
  let poppedDirectory = directories.pop()
  sortDirectory(poppedDirectory)
} 

function generateRandomNumber(min_value , max_value) {
  let random_number = Math.random() * (max_value - min_value) + min_value;
  currentPhotoNumber = random_number
  return Math.floor(random_number);
}
function randomElementInArray(array) {
  return array[generateRandomNumber(0,array.length)];
}

let deleteFile =  function(path){
    fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
  let fileName = getFileName(path)
  photoDB[fileName].deleteMe = true
  copyPhoto()
}

let saveFile = function(file){
  var jsonData = JSON.stringify(file, null, 2);
  fs.writeFile(`./json/photoDB.json`, jsonData, function(err) {
    if(err) {
      console.error(err)
      return
    }  
  })
}


let dontShowFile =  function(path){
  let currentPhotoName = currentPhoto
  let fileName = getFileName(currentPhotoName)
  console.log(`saving the photo ${currentPhotoName} ${fileName}`)
  photoDB[fileName].canShow = false
  // dontShowThesePhotos.push(currentPhotoName)
  saveFile(photoDB)
  console.log("photo wont show")
  copyPhoto()
}

let newPhoto = function(){
  let randomPhoto = randomElementInArray(photos)
  canShow = photoDB[getFileName(randomPhoto)].canShow
  console.log(canShow)
  if(canShow){
    return(randomPhoto)
  } else {
    return(newPhoto())
  }
}

let copyPhoto =  async function(repeat = false){
  let randomPhoto = newPhoto()
  //change the current photo the selected photo
  currentPhoto = randomPhoto
  // let oldFilePath = `${dirname}/${newPhoto}`
  let minutesDelay = 15
  let delayInMs = minutesDelay*60*1000
  compress_images(randomPhoto, newFilePath)
  if(repeat){
    setTimeout(copyPhoto, delayInMs, true); // in MS 1000 = 1s
  }
  console.log(`new photo for ya!`)
  console.log(currentPhoto)
}


if(directories.length == 0){
 console.log("indexed")
 console.log(`There are ${photos.length} photos`)
 console.log(photoDB)
 copyPhoto(true)
}


///////////////////////////////////// Databases Init ////////////////////////////////////////////

server.listen(PORT, () => {
  console.log(`Sending neato photogs on ${ PORT }`)
})

server.get("/newPhoto", (req, res) => {
  console.log("trying to send a new one for ya!")
  copyPhoto()
})

server.get("/deletePhoto", (req, res) => {
  console.log("gonna delete this bitchhh!")
  deleteFile(currentPhoto)
})

server.get("/dontShowPhoto", (req, res) => {
  console.log("not gonna show  this bitchhh!")
  dontShowFile("doesnt Matter")
})


server.get(`/sendPhoto`, (req, res) => {
//   res.json(result)
//   // previously sent the photo directly. Did not work!
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






