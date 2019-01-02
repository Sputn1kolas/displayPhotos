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

///////////////////////////////////// Databases init ////////////////////////////////////////////

server.get('/*', function(request, response) {
  console.log('Sending index.html file')
  console.log(request.query)
  response.sendFile(path.resolve(__dirname, build_path, 'index.html'))
});

server.listen(PORT, () => {
  console.log(`Preventing Pandemics on ${ PORT }`)
})


///////////////////////////////////// Create CSV  ////////////////////////////////////////////
// let json2csv = require('json2csv');

// var fields = ['name', 'phone', 'mobile', 'email', 'address', 'notes'];
// var fieldNames = ['Name', 'Phone', 'Mobile', 'Email', 'Address', 'Notes'];
// var data = json2csv({ data: docs, fields: fields, fieldNames: fieldNames });

// var jsoncsv = require('../json-csv')

const fs = require('fs');

let writeCSV = function(rss_csv, feed){
  fs.writeFile("../hell.csv", rss_csv, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
}

///////////////////////////////////// Pull in feeds  ////////////////////////////////////////////
// Creates a new parser object, that awaits all the feeds to come in
let rss_csv = `title, isoDate, duration `
let parser = new Parser();
(async () => {

  let feed = await parser.parseURL('http://feeds.gimletmedia.com/hearreplyall');
  console.log(feed.items[1])

  feed.items.forEach(item => {
    if(item.title[0] === "#"){
      // pulls in title, isoDate, duration: item.itunes.duration from the parsed rss and creates a csv
      let new_line = `\n\"${item.title}\",${item.isoDate},${item.itunes.duration}`
      rss_csv = rss_csv + new_line
    }
  });
  writeCSV(rss_csv,feed)  
})();





