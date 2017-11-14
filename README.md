# Live Face Masking

Live face masking website developed for a student's project about masking faces.
The webpage uses Haar cascades to detect faces in the live images of a webcam,
applies a chosen filter to the face area and displays the result.

Face detection is provided by 'jsfeat', a javascript computer vision library.
Find the library here https://github.com/inspirit/jsfeat with a lot of examples
and its documentation here https://inspirit.github.io/jsfeat/.

The live face masking code is derived from Eugene Zatepyakin's face detection demo
among the jsfeat examples: https://inspirit.github.io/jsfeat/sample_haar_face.html

A browser must support WebRTC for the page to work properly.
