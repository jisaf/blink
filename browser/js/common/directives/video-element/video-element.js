app.directive('videoElement', function() {
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
            function blinkEvent() {
            	console.log('start blink');
                eyeBlinkClear = setTimeout(function() {
                    console.log('Blink Reset********');
                    document.getElementById('blinkLeft').innerHTML = '';
                    document.getElementById('blinkRight').innerHTML = '';
                    blinkDebounce = true;
                    check = true;
                }, 300);
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
                    if(rightDiff > 18 && blinkDebounce) {
                    	//console.log('**********blink event');
                    	document.getElementById('blinkRight').innerHTML = 'Blink';
                    	blinkDebounce = false;
                    	blinkEvent();
                    }
                    document.getElementById('singleRight').innerHTML = "Right Eye: [" + rightSumX.toFixed(2) + "," + rightSumY.toFixed(2) + "]";
                    document.getElementById('rightDiff').innerHTML = "Difference: [" + rightDiff.toFixed(2) + "]";
                    lastRightYVal = rightSumY;


                    var leftSumX = 0;
                    var leftSumY = 0;
                    leftEye.forEach(function(point) {
                        leftSumX += positions[point][0];
                        leftSumY += positions[point][1];
                    })
                    leftDiff = Math.abs(leftSumY - lastLeftYVal);
                    if(leftDiff > maxDiff && check) {
                    	maxDiff = leftDiff;
                    	console.log('**************', maxDiff);
                    }
                    if(leftDiff > 12 && blinkDebounce) {
                    	console.log('**********blink event');
                    	document.getElementById('blinkLeft').innerHTML = 'Blink';
                    	blinkDebounce = false;
                    	blinkEvent();
                    }
                    document.getElementById('singleLeft').innerHTML = "Left Eye: [" + leftSumX.toFixed(2) + "," + leftSumY.toFixed(2) + "]";
                    document.getElementById('leftDiff').innerHTML = "Difference: [" + leftDiff.toFixed(2) + "]";
                    lastLeftYVal = leftSumY;
                    

                }

                //document.getElementById('single').innerHTML = "Singlepoint " + 27 + " : [" + positions[27][0].toFixed(2) + "," + positions[27][1].toFixed(2) + "]<br/>";


            }

            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    audio: true,
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