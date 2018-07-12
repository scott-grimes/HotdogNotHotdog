const express = require('express');
const fs = require('fs');
// heroku does not support tf backend. rework for client-side
//const Brain = require('./tfLoader').Brain;

const bodyParser = require("body-parser");

const app = express();





app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

let brain;
const port = process.env.port || 5000;
const RANDOMIMAGECOUNT = 5;

let randomImages;
let randomHotdogImages;

const shuffle = x => x.slice().sort( ()=> 0.5 - Math.random());

// inits our random images
fs.readdir(
  __dirname + '/client/public/images/randomImages', 
  (err, files) => {
    console.log(err, files);
    if (err) {
      console.log(err);
    } else {

      randomImages = files.map(x => '/images/randomImages/' + x);
    }
   
  });

fs.readdir(
  __dirname + '/client/public/images/hotdogImages',
  (err, files) => {
    console.log(err, files);
    if (err) {
      console.log(err);
    } else {
      randomHotdogImages = files.map(x => '/images/hotdogImages/' + x);
    }
    
  }
);


app.listen(port, () => {
  console.log('Hotdog Server running on port 3000...');

  // brain = new Brain();
  // brain
  //   .loadModel("mobilenet")
  //   .then(() => {
  //     console.log("Mobilenet loaded and ready");
  //   })
  //   .catch(err => console.log(err));

});

//app.use(express.static('client/public'));


// get random urls for images (always returns one hotdog in the list)
app.get('/random', (req, res) => {
  var randomImagesSorted = shuffle( randomImages );
  var randomHotdogsSorted = shuffle( randomHotdogImages );
  var list = randomImagesSorted.slice(0, RANDOMIMAGECOUNT-1);
  list = list.concat( randomHotdogsSorted[0]);
  list = shuffle(list);
  res.status(200).send(JSON.stringify(list));

});

// app.post('/guess', (req, res) => {
  
//   let pchain = null;
//   if (!req.body) {
//     res.status(400).send("Invalid POST request. must be pixelblob");
//   } else if (req.body.pixelBlob) {
//     brain.predictFromPixelBlob(req.body.pixelBlob)
//     .then(
//     prediction=>{
//       res.status(200).send(JSON.stringify(prediction));
//     }
//   ).catch(err=>{
//     console.log(err)
//     res.status(400).send(err);
//   });
// }
// });



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  app.use(express.static("client/public"));
}