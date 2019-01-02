var request = process.argv.slice(2)

let activeDb = 'beta_dev'

if (process.env.NODE_ENV === 'production') {
  activeDb = 'beta_prod';
} else {
  activeDb = 'beta_dev';
}

var mongo = require('mongodb')
var monk = require('monk')
const MONGODB_URI = process.env.MONGODB_URI || ('localhost:27017/' + activeDb)
var db = monk(MONGODB_URI)

let functions = {

///////////////////////////////////// Seed ////////////////////////////////////////////

  seed: async function() {
    await this.rollback()
    const areas = db.create('areas')
    const crags = db.create('crags')
    const routes = db.create('routes')

    areaSeed  = require('./ghost.json')
    giveId(areaSeed)
    cragSeed  = require('./phantom_crag.json')
    giveId(cragSeed)
    routeSeed = importRoutes('./phantom.json')
    giveId(routeSeed)

    areas.insert(areaSeed)
    .then(()=> {return crags.insert(cragSeed)})
    .then(()=> {return routes.insert(routeSeed)})
    .then(()=> {return db.close()})
    .then(()=> {console.log("seed finished..")})

  },

///////////////////////////////////// Migration ////////////////////////////////////////////

   migrate: function() {
     //  Promise.all(() => {
     //    return console.log("migrating...")
     //  })
     //   .then(()=> {
     //    const areas = db.create('areas')
     //    return areas
     //  })
     //  .then(()=> {
     //    const crags = db.create('crags')
     //    return crags
     // })
     //  .then(()=> {
     //    const routes = db.create('routes')
     //    return routes
     //  })
     //  .then(()=> {return db.close()})
     //  .then(()=> {return console.log("tables created")})

    const areas = db.create('areas')
    const routes = db.create('routes')
    const crags = db.create('crags')
    console.log("tables created... please press CTRL-C...")
    return db.close()
  },

  rollback: function() {
    console.log("rolling back...")
    const areas = db.get('areas')
    const crags = db.get('crags')
    const routes = db.get('routes')

    areas.drop()
    .then(()=> {return crags.drop()})
    .then(()=> {return routes.drop()})
    .then(()=> {return db.close()})
    .then(()=> {console.log("tables dropped")})
  }
}

///////////////////////////////////// Importing functions ////////////////////////////////////////////

function importRoutes(path){
    jsonRoutes = require(path)
    routeSeed = []

    for(let route in jsonRoutes) {
      let name = jsonRoutes[route].name
      if(!routeSeed[name]) {
        if(!jsonRoutes[route].pitches) { // if pitches not entered in db create new
          jsonRoutes[route].pitches = [{
            pitch_no: 1,
            height: jsonRoutes[route].height,
            num_bolts: jsonRoutes[route].bolts
          }]
        }
        routeSeed.push({
          _id: monk.id(),
          name: name,
          crag: jsonRoutes[route].crag,
          area: "Ghost River",
          description: jsonRoutes[route].description,
          tags: jsonRoutes[route].tags,
          height: jsonRoutes[route].height,
          bolts: jsonRoutes[route].bolts,
          rating: jsonRoutes[route].rating,
          style: jsonRoutes[route].type,
          grade: jsonRoutes[route].grade,
          left_route: jsonRoutes[route].left_route,
          right_route: jsonRoutes[route].right_route,
          camera: jsonRoutes[route].views,
          first_ascent: jsonRoutes[route].first_ascent,
          pitches: jsonRoutes[route].pitches
        })
      } else {
        let num_pitches = routeSeed[name]['pitches'].length + 1 //redundant else?
        routeSeed[name].pitches.push({
          pitch_no: num_pitches,
          height: jsonRoutes[route].height,
          num_bolts: jsonRoutes[route].bolts
        })
      }
    }
    return routeSeed
  }

  function giveId(array){
    for(let i = 0; i < array.length; i++){
      array[i]['_id'] = monk.id()
    }
  }

///////////////////////////////////// Function call ////////////////////////////////////////////

functions[request]()
