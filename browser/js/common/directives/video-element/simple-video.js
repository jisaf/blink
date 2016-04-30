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
            var leftZero;
            var rightZero;
            var mouthZero;
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
                leftZero = BlinkFactory.getAreaLeft(positions) - 10; 
                rightZero = BlinkFactory.getAreaRight(positions) - 10;
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
            // var adjustRight;
            // var adjustLeft;
            // function resetTimer() {
            //     setTimeout(function() {
            //         console.log('finished zero');
            //         clearInterval(adjustRight);
            //         clearInterval(adjustLeft);
            //     }, 5000)
            // }
            // function adjustZeroL() {
            //     resetTimer();
            //     var positions = ctracker.getCurrentPosition();
            //     scope.maxRight = rightZero.toFixed(1)
            //     adjustRight = setInterval(function() {
            //         var findMax = BlinkFactory.getAreaRight(positions);
            //         //console.log("max", findMax);
            //         console.log('right zero', rightZero);
            //         if(findMax > rightZero) {
            //             rightZero = findMax + 40;
            //             scope.maxRight = findMax.toFixed(1);
            //         }

            //     }, 50)
            // }
            // function adjustZeroR() {
            //     resetTimer();
            //     var positions = ctracker.getCurrentPosition();
            //     scope.maxLeft = leftZero
            //     adjustLeft = setInterval(function() {
            //         var findMax = BlinkFactory.getAreaLeft(positions);
            //         if(findMax > leftZero) {
            //             console.log("zero reset");
            //             leftZero = findMax + 40;
            //             scope.maxLeft = findMax.toFixed(1);
            //         }

            //     }, 50)
            // }
            // scope.calibrateL = function() {
            //     adjustZeroL();
            // }
            // scope.calibrateR = function() {
            //     adjustZeroR();
            // }
            

            function readPositions() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    var areaRight = BlinkFactory.getAreaRight(positions);
                    var areaLeft = BlinkFactory.getAreaLeft(positions);
                    var mouthLength = BlinkFactory.mouthDistance(positions);
                    scope.testVal = BlinkFactory.getArea(positions, 17, 69, 16, 70);
                    //scope.rightVal = areaRight.toFixed(1);
                    // if(rightDebounce) scope.rightVal = (areaRight - rightZero).toFixed(1);
                    // else scope.rightVal = 0;

                    // if(leftDebounce) scope.leftVal = (areaLeft - leftZero).toFixed(1);
                    // else scope.leftVal = 0;
                    scope.mouthVal = mouthLength.toFixed(1);
                    DisplayFactory.area(areaLeft, areaRight, mouthLength);
                   

                    if(!rightDebounce && !leftDebounce && eyeDebounce ) {
                        scope.selectBox = "selected-letter";
                        scope.bothEyes = true;
                        scope.$digest();
                        eyeDebounce = false
                        resetBoth();
                    }

                    if (areaRight < rightZero && rightDebounce) {
                        scope.statusRight = true;
                        scope.$digest();
                        resetRight();
                        rightDebounce = false;
                    }

                    if (areaLeft < leftZero && leftDebounce) {
                        scope.statusLeft = true;
                        scope.$digest();
                        resetLeft();
                        leftDebounce = false;
                    }

                    // if(mouthLength > mouthZero) {
                    //     scope.selectBox = "selected-letter";
                    //     scope.statusMouth = true;
                    //     scope.$digest();
                    //     mouthDebounce = false
                    //     resetMouth();
                    //     resetBoth();
                    // }

                    // if (areaRight > rightZero && rightDebounce && (scope.leftVal < scope.rightVal)) {
                    //     scope.statusRight = true;
                    //     scope.$digest();
                    //     scope.rightVal = (areaRight - rightZero).toFixed(1);
                    //     scope.leftVal = (areaLeft - leftZero).toFixed(1);
                    //     if(scope.rightVal > 10) rightZero++;
                    //     resetRight();
                    //     rightDebounce = false;
                    // }

                    // if (areaLeft > leftZero && leftDebounce && (scope.leftVal > scope.rightVal)) {
                    //     scope.statusLeft = true;
                    //     scope.rightVal = (areaRight - rightZero).toFixed(1);
                    //     scope.leftVal = (areaLeft - leftZero).toFixed(1);
                    //     if(scope.leftVal > 10) leftZero++;
                    //     scope.$digest();
                    //     resetLeft();
                    //     leftDebounce = false;
                    // }
                    scope.$digest();
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