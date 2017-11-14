
function grayRect(ctx, rect, sc) {
    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i]     = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);
}


function amplifyRect(ctx, rect, sc, gain) {
    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);
    var data = imageData.data;

    for (var i = 0; i < data.length; i ++) {
      data[i] *= gain
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);          
}


function channelRect(ctx, rect, sc, channel) {

    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);
    var data = imageData.data;      

    var ch = getChannel(imageData, channel);  

    for (var i = 0; i < imageData.width*imageData.height; i++) {
      data[i*4]  = 0; 
      data[i*4 + 1] = 0; 
      data[i*4 + 2] = 0;
      data[i*4 + channel] = ch[i];
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);
}

function channelRectMat(ctx, rect, sc, channel) {

    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);
    var data = imageData.data;      

    var ch = getChannelMat(imageData, channel);  

    for (var i = 0; i < imageData.width*imageData.height; i++) {
      data[i*4]  = 0; 
      data[i*4 + 1] = 0; 
      data[i*4 + 2] = 0;
      data[i*4 + channel] = ch.data[i];
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);
}


function blurRect(ctx, rect, sc, radius) {

    var imageData = ctx.getImageData(rect.x*sc-radius, rect.y*sc-radius, rect.width*sc+2*radius, rect.height*sc+2*radius);

    var img_r = getChannelMat(imageData, 0);
    var img_g = getChannelMat(imageData, 1);
    var img_b = getChannelMat(imageData, 2);

     var ii_sum = new Int32Array((imageData.width + 1)*(imageData.height + 1));


    jsfeat.imgproc.compute_integral_image(img_r, ii_sum, null, null);

    for (var j = radius; j < imageData.height-radius; j++) {
        for (var i = radius; i < imageData.width-radius; i++) {
            imageData.data[(j*imageData.width + i)*4] = iiAvg(ii_sum, imageData.width+1, i-radius, j-radius, i+radius, j+radius);
        }
    }


    jsfeat.imgproc.compute_integral_image(img_g, ii_sum, null, null);

    for (var j = radius; j < imageData.height-radius; j++) {
        for (var i = radius; i < imageData.width-radius; i++) {
            imageData.data[(j*imageData.width + i)*4 + 1] = iiAvg(ii_sum, imageData.width+1, i-radius, j-radius, i+radius, j+radius);
        }
    }


    jsfeat.imgproc.compute_integral_image(img_b, ii_sum, null, null);

    for (var j = radius; j < imageData.height-radius; j++) {
        for (var i = radius; i < imageData.width-radius; i++) {
            imageData.data[(j*imageData.width + i)*4 + 2] = iiAvg(ii_sum, imageData.width+1, i-radius, j-radius, i+radius, j+radius);
        }
    }

    ctx.putImageData(imageData, rect.x*sc-radius, rect.y*sc-radius);
}


function pixelizeRect(ctx, rect, sc, radius) {

    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);

    var img_r = getChannelMat(imageData, 0);
    var img_g = getChannelMat(imageData, 1);
    var img_b = getChannelMat(imageData, 2);

     var ii_sum = new Int32Array((imageData.width + 1)*(imageData.height + 1));
    // var ii_sqsum = new Int32Array((imageData.width + 1)*(imageData.height + 1));
    //var ii_sum = new Int32Array(imageData.width * imageData.height);
    //var ii_sqsum = new Int32Array(imageData.width * imageData.height);

    var x1, y1, x2, y2;


    jsfeat.imgproc.compute_integral_image(img_r, ii_sum, null, null);

    for (var j = 0; j < imageData.height; j++) {
        for (var i = 0; i < imageData.width; i++) {
            
            x1 = Math.floor(i / radius)*radius;
            x2 = x1 + radius;

            y1 = Math.floor(j / radius)*radius;
            y2 = y1 + radius;

            if (y2 < imageData.height && x2 < imageData.width)
                imageData.data[(j*imageData.width + i)*4] = iiAvg(ii_sum, imageData.width+1, x1, y1, x2, y2);
        }
    }


    jsfeat.imgproc.compute_integral_image(img_g, ii_sum, null, null);

    for (var j = 0; j < imageData.height; j++) {
        for (var i = 0; i < imageData.width; i++) {
            
            x1 = Math.floor(i / radius)*radius;
            x2 = x1 + radius;

            y1 = Math.floor(j / radius)*radius;
            y2 = y1 + radius;
            
            if (y2 < imageData.height && x2 < imageData.width)
                imageData.data[(j*imageData.width + i)*4 + 1] = iiAvg(ii_sum, imageData.width+1, x1, y1, x2, y2);
        }
    }


    jsfeat.imgproc.compute_integral_image(img_b, ii_sum, null, null);

    for (var j = 0; j < imageData.height; j++) {
        for (var i = 0; i < imageData.width; i++) {
            
            x1 = Math.floor(i / radius)*radius;
            x2 = x1 + radius;

            y1 = Math.floor(j / radius)*radius;
            y2 = y1 + radius;

            if (y2 < imageData.height && x2 < imageData.width)
                imageData.data[(j*imageData.width + i)*4 + 2] = iiAvg(ii_sum, imageData.width+1, x1, y1, x2, y2);
        }
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);
}



function crushRect(ctx, rect, sc, div) {

    var imageData = ctx.getImageData(rect.x*sc, rect.y*sc, rect.width*sc, rect.height*sc);
    var data = imageData.data;      


    for (var i = 0; i < imageData.width*imageData.height; i++) {
      data[i*4]  =  Math.floor(data[i*4]/div)*div; 
      data[i*4 + 1] = Math.floor(data[i*4 + 1]/div)*div; 
      data[i*4 + 2] = Math.floor(data[i*4 + 1]/div)*div;
    }

    ctx.putImageData(imageData, rect.x*sc, rect.y*sc);
}



function iiAvg(ii, cols, x1, y1, x2, y2) {
    return (ii[(y2+1)*cols + x2+1] - ii[(y2+1)*cols + x1] - ii[y1*cols + x2+1] + ii[y1*cols + x1]) / ((x2 - x1)*(y2 - y1));
}

function iiSum(ii, cols, x1, y1, x2, y2) {
    return (ii[(y2+1)*cols + x2+1] - ii[(y2+1)*cols + x1] - ii[y1*cols + x2+1] + ii[y1*cols + x1]);
}




function getChannel(imageData, channel) {

    var values = new Uint8ClampedArray(imageData.width * imageData.height);

    for (var j = 0; j < imageData.height; j++) {
        for (var i = 0; i < imageData.width; i++) {

            values[j*imageData.width + i] = imageData.data[(j*imageData.width + i)*4 + channel];

        }
    }

    return values;
}

function getChannelMat(imageData, channel) {

    var values = new jsfeat.matrix_t(imageData.width, imageData.height, jsfeat.U8_t | jsfeat.C1_t);

    for (var j = 0; j < imageData.height; j++) {
        for (var i = 0; i < imageData.width; i++) {

            values.data[j*imageData.width + i] = imageData.data[(j*imageData.width + i)*4 + channel];

        }
    }

    return values;
}