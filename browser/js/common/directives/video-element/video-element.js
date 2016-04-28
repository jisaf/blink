app.directive('videoElement', function(BlinkFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/video-element/video-element.html',
        link: function(scope, elem, attr) {
            //elem.find('#webcam');
            var rightEye = [23, 63, 24, 64, 25];
            var leftEye = [28, 67, 29, 68, 30];
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            var errorCallback = function(e) {
                console.log('Reeeejected!', e);
            };
            var video = document.getElementById('webcam');

            //start tracker
            var ctracker = new clm.tracker();
            ctracker.init(pModel);
            ctracker.start(video);
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");

            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctracker.draw(canvas);
            }

            var lastRightYVal = 0;
            var lastLeftYVal = 0;
            var rightDiff;
            var leftDiff;
            var maxDiff = 0;
            var check = false;

            var eyeBlinkClear;
            var blinkDebounce = true;
            var leftDebounce = true;
            var rightDebounce = true;

            function blinkEvent() {
            	console.log('-------------start blink');
                eyeBlinkClear = setTimeout(function() {
                    console.log('************Reset');
                    document.getElementById('blinkLeft').innerHTML = '';
                    document.getElementById('blinkRight').innerHTML = '';
                    blinkDebounce = true;
                }, 500);
            }

            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    var rightSumX = 0;
                    var rightSumY = 0;
                    rightEye.forEach(function(point) {
                        rightSumX += positions[point][0];
                        rightSumY += positions[point][1];
                    })
                    rightDiff = Math.abs(rightSumY - lastRightYVal);
                    if(rightDiff > 15 && rightDebounce) {
                    	console.log('right diff', rightDiff);
                    	document.getElementById('blinkRight').innerHTML = 'Blink';
                    	rightDebounce = false;
                    	BlinkFactory.moveLetter()
                    	rightDebounce = BlinkFactory.debounceRight()
                    }
                    BlinkFactory.displayRight(rightSumX.toFixed(2), rightSumY.toFixed(2), rightDiff.toFixed(2))
                    lastRightYVal = rightSumY;


                    var leftSumX = 0;
                    var leftSumY = 0;
                    leftEye.forEach(function(point) {
                        leftSumX += positions[point][0];
                        leftSumY += positions[point][1];
                    })
                    leftDiff = Math.abs(leftSumY - lastLeftYVal);
                    
                    if(leftDiff > 25 && leftDebounce) {
                    	console.log('------before');
                    	console.log('left diff', leftDiff);
                    	document.getElementById('blinkLeft').innerHTML = 'Blink';
                    	leftDebounce = false;
                    	leftDebounce = BlinkFactory.debounceLeft();
                    	console.log('-------after');
                    }
                    BlinkFactory.displayLeft(leftSumX.toFixed(2), leftSumY.toFixed(2), leftDiff.toFixed(2))
                    lastLeftYVal = leftSumY;
                    

                }

                //document.getElementById('single').innerHTML = "Singlepoint " + 27 + " : [" + positions[27][0].toFixed(2) + "," + positions[27][1].toFixed(2) + "]<br/>";


            }

            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    console.log('video load');
                    positionLoop();
                    drawLoop();
                }, errorCallback);
            } else {
                console.log('cannot find cam');
                alert('Cannot connect')
            }

        }
    }
});