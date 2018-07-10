// load different types of tensorflow models
const tf = require('@tensorflow/tfjs');
require("@tensorflow/tfjs-node")
var jsdom = require("jsdom");
var { JSDOM } = jsdom;

tf.setBackend("tensorflow");
const fs = require('fs');
const http = require('http');

const DEBUG = true;

// maybe use fs to load file. create html "file" object out of them, 

const modelList = {
  mobilenet: {
    modelPath: "/tensorflowModels/mobilenet_v1_1.0_224/model.json",
    imageClasses: "/tensorflowModels/mobilenet_v1_1.0_224/imagenetClasses.json"
  },

  inception: {

  }
};

class Brain {

  constructor() {
    this.model;
    this.imageClasses;
    this.imageSize;
    this.inputShapes;
    this.predictFromImage = this.predictFromImage.bind(this);
  }

  async loadTensor(modelName) {
  
    let startTime;
    if (DEBUG) {
      console.log('Loading Model...')
      startTime = Date.now();
      console.log(modelName);
    }
    
    
    const imageClassesJson = JSON.parse(
      fs.readFileSync(
         __dirname+ modelList[modelName].modelPath
        , 'utf8'
      ));
    
    this.imageClasses = imageClassesJson
    if(this.imageClasses){
      console.log('json loaded...')
    }
    const modelPath = 'file://'+__dirname+modelList[modelName].modelPath;
    console.log( modelPath)
    this.model = await tf.loadModel(modelPath);

    this.inputShapes = this.model.inputs[0].shape;
    if (this.inputShapes[0] === null) { this.inputShapes[0] = 1; }
    this.imageSize = this.inputShapes[1];


    if (DEBUG) {

      console.log('Loaded in ' + (Date.now() - startTime))
      console.log('Model Shapes for In/Out')
      console.log(this.model.inputs[0].shape);
      console.log(this.model.outputs[0].shape);
      
    }


  }


  async predictFromImage(image) {
    console.log('predicting');
    //image must be sized correctly
    const startTime = Date.now();

    // tidy runs the function, then deallocates memory since tf is a hog
    const logits = tf.tidy(() => {
      // build tensor from our image
      console.log('in the tidy')
      const img = tf.fromPixels(image).toFloat();
      console.log('from pixels fired')

      // change rbg values from [0, 255] to [-1, 1] for inputting into our model
      const offset = tf.scalar(127.5);
      const normalized = img.sub(offset).div(offset);

      //resize if it's not the correct size
      let resized = normalized;
      if (image.width !== this.imageSize || image.height !== this.imageSize) {
        const alignCorners = true;
        resized = tf.image.resizeBilinear(
          normalized, [this.imageSize, this.imageSize], alignCorners);
      }
      // Convert our tensor into the shape needed for our model
      const reshaped = resized.reshape(this.inputShapes);

      // Make a prediction through our model.
      return this.model.predict(reshaped);
    });

    // Convert logits to probabilities and class names.
    const predictions = await this.buildReadablePredictions(logits, 3);
    const totalTime = Date.now() - startTime;

    return predictions;

  }

  async buildReadablePredictions(
    logits,
    maxPredictions
  ) {

    const values = await logits.data();

    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) => {
      return b.value - a.value;
    });

    const maxPredictionsValues = new Float32Array(maxPredictions);
    const maxPredictionsIndices = new Int32Array(maxPredictions);
    for (let i = 0; i < maxPredictions; i++) {
      maxPredictionsValues[i] = valuesAndIndices[i].value;
      maxPredictionsIndices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < maxPredictionsIndices.length; i++) {
      topClassesAndProbs.push({
        className: this.imageClasses[maxPredictionsIndices[i]],
        probability: maxPredictionsValues[i]
      });
    }
    return topClassesAndProbs;
  }



  //given a base64 URL encoded image, return the predictions from mobilenet about what the image contains
  predictFromBase64(base64) {
    const self = this;
    return new Promise(function (resolve, reject) {
      const dom = new JSDOM('');
      console.log('jsdom',JSDOM)
      //console.log('dom',dom)
      //console.log('window', dom.window)
      //console.log('document', dom.window.document)
      var image = dom.window.document.createElement('img');
      console.log('image',image)
      image.onload = function () {
        console.log('image loaded')
        resolve(self.predictFromImage(image));
      }
      image.src = base64;
      resolve(self.predictFromImage(image));

    });
  }




}








module.exports = { Brain };


// view pretrained at https://github.com/tensorflow/models/tree/master/research/slim#Pretrained

// loading 
//const modelPath = './tensorflowModels/mobilenet_v1_1.0_224/model.json';
//model = await tf.loadModel(modelPath);


//frozen
//model = await tf.loadFrozenModel('./tensorflowModels/mobilenet/tensorflowjs_model.pb', './tensorflowModels/mobilenet/weights_manifest.json')


/// frozen from cloud
// const GOOGLE_CLOUD_STORAGE_DIR =
//   'https://storage.googleapis.com/tfjs-models/savedmodel/';
// const MODEL_FILE_URL = 'mobilenet_v2_1.0_224/tensorflowjs_model.pb';
// const WEIGHT_MANIFEST_FILE_URL = 'mobilenet_v2_1.0_224/weights_manifest.json';