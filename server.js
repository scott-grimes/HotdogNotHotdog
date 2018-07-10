const express = require('express');
const fs = require('fs');
const Brain = require('./tfLoader').Brain;
const app = express();
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
  console.log('hello from random!')
  var randomImagesSorted = shuffle( randomImages );
  var randomHotdogsSorted = shuffle( randomHotdogImages );
  var list = randomImagesSorted.slice(0, 3);
  list = list.concat( randomHotdogsSorted[0]);
  list = shuffle(list);
  res.status(200).send(JSON.stringify(list));

});

app.get('/guess', (req, res) => {
  if (!req.body) {
    res.status(400).send('Invalid GET request. Please send a URI encoded image!');
  }
  console.log(req.body);
  brain.predictFromBase64(req.body).then(
    prediction=>{
      console.log(prediction)
      res.status(200).send(prediction);
    }
  ).catch(err=>{
    res.status(400).send(err);
  });
  
});



