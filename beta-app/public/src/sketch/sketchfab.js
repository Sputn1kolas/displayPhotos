// Models
let wasoochANDroute = 'd12184ff25a2405ea9273a635cf1a526'
let phantomV1 = 'ad129cb2163f4981bd67e5bf5ae6c298'
let w3 = '1ce51e25ae71489b9f53d51f5a97aa48'
let routeWithMaterials = '8541b676c7bf48bcacdd7b7fc4cc8864'

var iframe = document.getElementById( 'api-frame' );
var version = '1.0.0';
var urlid = phantomV1;
var client = new Sketchfab( version, iframe );

client.init( urlid, {
    camera: 0, // sets the inital animation, 1 is animate, 0 is no animate.
    navigation: 'fps',
    preload: 1, // determines if there is progressive feature loading, 0 sets progress, 1 set all must be loaded.
    scrollwheel: 0, // does the scroll wheel do anything?
    success: function onSuccess(api) {
        theApi = api
        api.start();
        api.addEventListener( 'viewerready', function() {
            addCameraControls(api)
            showRoute(api)
            getNodes(api)
        } );
    },
    error: function onError() {
        console.log( 'Viewer error' );
    }
} );

// Event listeners
function addCameraControls(api) {

   $('.setViews').on("submit", function(event) {
    event.preventDefault()
    let x = $('.x').val()
    let y = $('.y').val()
    let z = $('.z').val()
    let x2 = $('.x2').val()
    let y2 = $('.y2').val()
    let z2 = $('.z2').val()

    api.lookat(
      [ x, y, z],     // eye position  x(+ is away), y(+ is left), z
      [x2, y2, z2],   // target to lookat
      4.3             // duration of the animation in seconds
    );
  })


  // Overview of Area
  $('.showRoute').on("click", function() {
    api.lookat(
      [ 10, -10, 10], // eye position  x(+ is away), y(+ is left), z
      [10, 10, 10],   // target to lookat
      4.3             // duration of the animation in seconds
    );
  })

  //Route highlight
  $('.showRoute2').on("click", function() {
    api.lookat(
      [ -5, -10, 20],   // eye position  x(+ is away), y(+ is left), z
      [10, -10, 10],    // target to lookat
      4.3               // duration of the animation in seconds
    );
  })
}

function showRoute(api) {  //This function shows a node, identified by its instanceID.
  let show = true
  $('.acromion').on("click", function() {
    if(show === true){
       show = false
    } else {
       show = true
    }
    Util.ShowMeshByPattern(api,"Acromion_Sweep", show)
  })
}

// "Util.ShowMeshByPattern(theApi,'Cube',false)
var Util = {
  getNodeMap: function(theApi) {
    theApi.getNodeMap( function( err, nodes ) {
      if ( !err ) {
          console.log( nodes );
      }
    } );
  },

  ShowMeshByPattern: function(theApi, pattern, doshow) {
    console.log("ShowMeshByPattern called")
    theApi.getNodeMap( function( err, nodes ) {
      if (err) {
          console.log('Error getting nodes');
          return;
      };

      var keys = Object.keys(nodes); //the node array is a set of numbered objects. Here we get an array of keys to those objects, a key is a number like '415'
      var isOption;

      for (var i = 0; i < keys.length; i++) {
        var node = nodes[keys[i]];

        //show or hide the meshes which match the pattern but.. currently hides the whole map....
        if(node.name === pattern) {
          console.log("pattern matches..", node.name, pattern)
          if(doshow) {
             console.log("TRYING TO HIDE...", node.instanceID)
            theApi.show(node.instanceID);
          } else {
            console.log("TRYING TO SHOW...", node.instanceID)
            theApi.hide(node.instanceID);
          }
        }
      }
    });
  }
}

function getNodes(api) {
  api.getNodeMap( function (err, nodes) {
    if (!err) {
      console.log("nodes are: ", nodes );
    }
  });
}


// example code: https://dl.dropboxusercontent.com/u/378324/rowdysign_test.html
// file:///Users/Nikolas/Downloads/monkey-head.html
