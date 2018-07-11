const express = require('express');
const fs = require('fs');
const Brain = require('./tfLoader').Brain;

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser())

let brain;
const port = process.env.port || 5000;

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

  brain = new Brain();
  brain.loadTensor('mobilenet').then( ()=>{
    console.log('Mobilenet loaded and ready');
  })
    .catch(err=>console.log(err));

});

//app.use(express.static('client/public'));



// get random urls for images (always returns one hotdog in the list)
app.get('/random', (req, res) => {
  var randomImagesSorted = shuffle( randomImages );
  var randomHotdogsSorted = shuffle( randomHotdogImages );
  var list = randomImagesSorted.slice(0, 3);
  list = list.concat( randomHotdogsSorted[0]);
  list = shuffle(list);
  res.status(200).send(JSON.stringify(list));

});


var predictbase64 = (b64img) => {
  return brain.predictFromBase64(b64img);
}

var predictPixelBlob = (pixelBlob) => {
  return brain.predictFromPixelBlob(pixelBlob);
}

app.post('/guess', (req, res) => {
  let pchain = null;
  if (!req.body) {
    pchain = null; //do nothing
  }else if(req.body.image){
    pchain = predictbase64(req.body.image);
  } else if (req.body.pixelBlob) {
    console.log(typeof req.body.pixelBlob.array)
    console.log(typeof req.body.pixelBlob.shape);
    pchain = predictPixelBlob(req.body.pixelBlob);
  }
  

  if (!pchain){
    res.status(400).send('Invalid POST request. must be image or tensor');
    return;
  }

  pchain.then().then(
    prediction=>{
      console.log('prediction on server',prediction)
      res.status(200).send(JSON.stringify(prediction));
    }
  ).catch(err=>{
    console.log(err)
    res.status(400).send(err);
  });
  
});



