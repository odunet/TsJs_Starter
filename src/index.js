import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import 'regenerator-runtime/runtime.js'
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Convert image from file system to JavaScript object
import * as images from '../images'
const parseImageImport = (images) => {
    // Use local image, 
    let imageObject = {}
    const localImg = new Image()
  
    for (let key in images) {
      const name = `${key}Src`
      const tempImg = new Image()
      tempImg.src = images[key]
      imageObject = {...imageObject, [`${key}Src`]: tempImg}
    }
    return imageObject
}

// Detect contour, and draw box around same
const detectContour = (img, context, predictions) => {
    predictions.forEach((prediction) => {
      context.font = "20px Arial";
      context.beginPath()
      context.rect(...prediction.bbox)
      context.lineWidth = 5;
      context.strokeStyle = 'red';
      context.fillStyle = 'white';
      context.stroke();

      // Draw text
      context.fillText(`${prediction.class} - ${prediction.score.toFixed(3)}`, prediction.bbox[0], prediction.bbox[1]+10)
    })

}

// Draw image
const drawImage = (predictions, image, index, canvas) => {
  const context = canvas.getContext('2d')
  context.drawImage(image,0,0)
  canvas.addEventListener('click',() => detectContour(image, context, predictions))
}

(async () => {
  const imageObject = parseImageImport(images)

  Object.entries(imageObject).forEach(([,img], index) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute("width",'600')
    canvas.setAttribute("height",'600')
    canvas.setAttribute("src","./src/index.js")
    canvas.setAttribute("class","canvas")
    document.body.appendChild(canvas);

    cocoSsd.load().then((model) => 
    model.detect(img).then((predictions) => {
      drawImage(predictions, img, index, canvas)
    }))
  })
})()
