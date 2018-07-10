
// converts an image located at url into it's base64 encoded representation. can be a local file or other file as long as the origin allows CORS
const convertToBase64 = function (url) {
 
  return new Promise(function (resolve, reject) {
    //build a blank canvas, draw the image to it. then convert to base64 encoding for transfer to the server
    var img = document.createElement('IMG'),
      canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      data = '';
    //if we maybe want to use this with other image urls

    img.crossOrigin = 'Anonymous';

    img.onload = async function(){
      // when the image is loaded, *this is the image, encode it and resolve our solution

      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      var imagetype = await getTypeFromImageUrl(url);
      data = canvas.toDataURL(imagetype);
      resolve(data);
    };

    // if it takes longer than 5sec to load, timeout
    setTimeout(() => reject('timeout'), 5000);

    // start to load the image
    img.src = url;

  });
};

// sends our URI encoded image to the server for predicting
const sendBase64ToServer = async function (base64) {
  console.log('sending fetch')
  const res = await fetch('/guess', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: base64 })
  });
  console.log(res)
  return res;

};

const getTypeFromImageUrl = async function getTypeFromImageUrl(imageUrl) {
  const response = await fetch(imageUrl)
  return response.blob().type;
}

export {convertToBase64, sendBase64ToServer}