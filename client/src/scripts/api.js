const tf = require("@tensorflow/tfjs");

// sends our pixelBlob to the server for predicting
const getPredictionFromServer = function(pixelBlob) {
  return fetch("/guess", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pixelBlob: pixelBlob })
  });
};

 //creates a pixelBlob: an object with the shape of the picture and an array of pixels representing the rbg values (this blob created via)
  // tf.fromPixels.data() and the shape from tf.fromPixel.shape()
  // {shape: [150,200,3] array:[255,203...]}
const imageToPixelBlob = async function(image){
  var tensor = tf.fromPixels(image)
  var obj = {shape:tensor.shape};
  await tensor
    .data()
    .then(res => obj['array'] = Array.prototype.slice.call(res));
    return obj
}

export {
  getPredictionFromServer,
  imageToPixelBlob
};