app.directive('simpleVideo', function(BlinkFactory, DisplayFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/video-element/simple-template.html',
        scope: '=',
        link: function(scope, elem, attr) {

            scope.running = false;
            scope.ready = false;
            scope.displayLetters = {
                prev: 'A',
                current: 'B',
                next: 'C'
            }

            var letter;
            scope.selectedText = "";
            var leftZero = 1000;
            var rightZero = 1000;
            var mouthZero = 1000;
            var leftDebounce = true;
            var rightDebounce = true;
            var eyeDebounce = true;
            var mouthDebounce = true;

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
            var intervalRead;

            function takeReading() {
                intervalRead = setInterval(readPositions, 50)
            }
            var intervalBase;

            function holdBase() {
                intervalBase = setInterval(resetBase, 1000)
            }

            

            scope.adjustRight = function (dir) {
                if(dir) rightZero += 1;
                else rightZero -= 1;
                DisplayFactory.baseline(leftZero, rightZero, mouthZero);
            }

            scope.adjustLeft = function (dir) {
                if(dir) leftZero += 1;
                else leftZero -= 1;
                DisplayFactory.baseline(leftZero, rightZero, mouthZero);
            }

            scope.startLetters = function() {
                scope.ready = true;
            }

            scope.getBaseline = function() {
                scope.running = true;
                var positions = ctracker.getCurrentPosition();
                leftZero = BlinkFactory.getAreaLeft(positions) + 40; 
                rightZero = BlinkFactory.getAreaRight(positions) + 40;
                mouthZero = BlinkFactory.mouthDistance(positions) + 8;
                DisplayFactory.baseline(leftZero, rightZero, mouthZero);
            }
            scope.stopReading = function() {
                clearInterval(intervalRead);
                clearInterval(intervalBase);
            }


            function resetRight() {
                if(scope.ready) BlinkFactory.shiftRight();
                setTimeout(function() {
                    scope.statusRight = false;
                    scope.$digest();
                    rightDebounce = true;
                }, 200)
            }

            function resetLeft() {
                if(scope.ready) BlinkFactory.shiftLeft();
                setTimeout(function() {
                    scope.statusLeft = false;
                    scope.$digest();
                    leftDebounce = true;
                }, 200)
            }
            function resetMouth() {
                setTimeout(function() {
                    scope.statusMouth = false;
                    scope.$digest();
                    mouthDebounce = true;
                }, 800)
            }
            function resetBoth() {
                 
                if(scope.ready) {
                 scope.selectedText += BlinkFactory.selectLetter();
                }
                setTimeout(function() {
                    scope.bothEyes = false;
                    scope.selectBox = "";
                    scope.$digest();
                    eyeDebounce = true;
                }, 750)
            }

            function readPositions() {
                var positions = ctracker.getCurrentPosition();
                var whichEye = true;
                if (positions) {
                    var areaRight = BlinkFactory.getAreaRight(positions);
                    var areaLeft = BlinkFactory.getAreaLeft(positions);
                    var mouthLength = BlinkFactory.mouthDistance(positions);
                    DisplayFactory.area(areaLeft, areaRight, mouthLength);
                    if(areaLeft - leftZero > areaRight - rightZero && leftDebounce) {
                        whichEye = false;
                    }

                    if(!rightDebounce && !leftDebounce && eyeDebounce ) {
                        scope.selectBox = "selected-letter";
                        scope.bothEyes = true;
                        scope.$digest();
                        eyeDebounce = false
                        resetBoth();
                    }

                    // if(mouthLength > mouthZero) {
                    //     scope.selectBox = "selected-letter";
                    //     scope.statusMouth = true;
                    //     scope.$digest();
                    //     mouthDebounce = false
                    //     resetMouth();
                    //     resetBoth();
                    // }

                    if (areaRight > rightZero && rightDebounce && whichEye) {
                        scope.statusRight = true;
                        scope.$digest();
                        resetRight();
                        rightDebounce = false;
                    }

                    if (areaLeft > leftZero && leftDebounce && !whichEye) {
                        scope.statusLeft = true;
                        scope.$digest();
                        resetLeft();
                        leftDebounce = false;
                    }
                }
            }




            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
               

                //document.getElementById('single').innerHTML = "Singlepoint " + 27 + " : [" + positions[27][0].toFixed(2) + "," + positions[27][1].toFixed(2) + "]<br/>";


            }

            takeReading();
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