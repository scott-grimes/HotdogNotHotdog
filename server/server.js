const express = require('express');
const fs = require('fs');
const Brain = require('./tfLoader').Brain;
var cors = require('cors');
const app = express();
let brain;

let randomImages;
let randomHotdogImages;

const shuffle = x => x.slice().sort( ()=> 0.5 - Math.random());

// inits our random images
fs.readdir(
  '/home/scott/git/HotdogNotHotdog/public/images/randomImages', 
  (err, files) => {
    if (err) {
      console.log(err);
    }
    randomImages = files.map(x=>'http://localhost:3000/images/randomImages/' + x);
  });

fs.readdir(
  '/home/scott/git/HotdogNotHotdog/public/images/hotdogImages',
  (err, files) => {
    if (err) {
      console.log(err);
    }
    randomHotdogImages = files.map(x => 'http://localhost:3000/images/hotdogImages/' + x);
  }
);



app.use(cors());

app.listen(3000, () => {
  console.log('Hotdog Server running on port 3000...');

  brain = new Brain();
  brain.loadTensor('mobilenet').then( ()=>{
    console.log('Mobilenet loaded and ready');
  })
    .catch(err=>console.log(err));

});

app.use(express.static('public'));



// get random urls for images (always returns one hotdog in the list)
app.get('/random', (req, res) => {

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
  brain.predictFromBase64(req.body).then(prediction=>console.log(prediction));
 
  res.status(200).send('recieved' + req.body);
});



