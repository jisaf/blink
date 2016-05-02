app.directive('gridVideo', function(BlinkFactory, DisplayFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/video-element/grid-template.html',
        controller: 'VideoCtrl',
        scope: '=',
        link: function(scope, elem, attr) {

            scope.running = false;
            scope.ready = false;
            scope.imageStable = false;

            

            scope.rowSelect = true;
            scope.letterSelect = false;
            scope.sentence = ''

            scope.displayLetters = {
                prev: 'XX',
                current: '_',
                next: 'A'
            }


            //scope.selectArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'Done', '+ Word', 'Back'];
            
            scope.selectArray = [
                ['A','B','C','D','E'],
                ['F','G','H','I','J'],
                ['K','L','M','N','O'],
                ['P','Q','R','S','T'],
                ['U','V','W','X','Y'],
                ['Z','Back', '+ Word', '?', '?']
            ]
            scope.styleArray = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
            ]
            scope.letterIndex = 0;
            scope.rowArray = [0,0,0,0,0,0];
            scope.rowIndex = 0;


            scope.leftThreshold = 20;
            scope.thresholdB = 20;
            scope.browThreshold = 18;
            scope.mouthThreshold = 15;

            scope.selectedText = "";
            

            var letter;
            var leftZero;
            var rightZero;
            var mouthZero;
            
            var leftZeroArray = [];
            var rightZeroArray = [];
            var browZeroArray = [];
            
            scope.rightDetails = [];
            scope.leftDetails = [];


            var leftDebounce = true;
            var rightDebounce = true;
            var eyeDebounce = true;
            var mouthDebounce = true;
            var browDebounce = true;

            var browArray = [20,21,17,16];
            var rightArray = [23, 63, 24, 64, 25, 65, 26, 66];
            var leftArray = [28, 67, 29, 68, 30, 69, 31, 70];

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
            var calibrateInterval;

            function takeReading() {
                intervalRead = setInterval(readPositions, 50)
            }

            function calibrate() {
                calibrateInterval = setInterval(findZero, 50)
            }
            var intervalBase;


            var scoreInterval;
            function getScore() {
                scoreInterval = setInterval(updateZero, 1000)
            }

            function updateZero() {
                var converge = ctracker.getConvergence();
                if(converge < 10 && leftDebounce && rightDebounce && browDebounce) {
                    dynamicZero();
                }
            }


            var initiateInterval;
            var count = 0;
            var negativeCount = 0;
            function initialize() {
                initiateInterval = setInterval(stableFace, 200)
            }

            function stableFace() {
                var converge = ctracker.getConvergence();
                scope.conv = converge
                if(converge < 300) {
                    count++;
                    if(count > 20) {
                        scope.imageStable = true;
                        scope.takeBase();
                    }
                }
                else if (scope.imageStable && converge > 1000) {
                    negativeCount++
                    if(negativeCount > 10) {
                        scope.imageStable = false;
                        clearInterval(intervalRead);
                        negativeCount = 0;
                        count = 0;
                    }
                }
                else {
                   negativeCount = 0;
                   count = 0;
                }
            }

            function startRow() {
                scope.rowArray = [1,0,0,0,0,0];
                scope.rowIndex = 0;
            }

            function selectRow(back) {
                scope.rowArray[scope.rowIndex] = 0;
                if(back) {
                    scope.rowIndex--;
                    if(scope.rowIndex === -1) scope.rowIndex = scope.rowArray.length - 1;
                    scope.rowArray[scope.rowIndex] = 1;
                }
                else {
                    scope.rowIndex++;
                    if(scope.rowIndex === scope.rowArray.length) scope.rowIndex = 0;
                    scope.rowArray[scope.rowIndex] = 1;
                }
            }

            function selectLetter() {
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 0;
                scope.letterIndex++;
                if(scope.letterIndex > 4) scope.letterIndex = 0;
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 1;
            }

            function resetRow() {
                scope.rowArray[scope.rowIndex] = 1;
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 0
                scope.letterIndex = 0;
                scope.rowSelect = true;
                scope.letterSelect = false;
            }

            function pushLetter() {
                var newLetter = scope.selectArray[scope.rowIndex][scope.letterIndex];
                if(newLetter === 'Space') {
                    scope.selectedText += ' '
                }
                else if(newLetter === 'Back') {
                   scope.selectedText = scope.selectedText.substring(0, scope.selectedText.length - 1);
                }
                else if (newLetter === '+ Word') {
                    scope.sentence += ' ' + scope.selectedText;
                    scope.selectedText = "";
                }
                else {
                    scope.selectedText += newLetter
                }
            }


            scope.startLetters = function() {
                scope.ready = true;
                startRow();
            }


            scope.stopReading = function() {
                clearInterval(intervalRead);
                clearInterval(intervalBase);
            }



            function resetRight() {
                if (scope.ready && scope.rowSelect) selectRow();
                if (scope.ready && scope.letterSelect) selectLetter();
                setTimeout(function() {
                    scope.statusRight = false;
                    scope.$digest();
                    rightDebounce = true;
                }, 200)
            }


            function resetLeft() {
                if (scope.ready && scope.rowSelect) selectRow(true);
                if (scope.ready && scope.letterSelect) resetRow();
                setTimeout(function() {
                    scope.statusLeft = false;
                    scope.$digest();
                    leftDebounce = true;
                }, 200)
            }

            function dynamicZero() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    leftZeroArray = leftArray.map(function(index) {
                        return positions[index][1]
                    });
                    rightZeroArray = rightArray.map(function(index) {
                        return positions[index][1]
                    });
                    browZeroArray = browArray.map(function(index) {
                        return positions[index][1]
                    });
                }
            }

            function resetMouth() {
                setTimeout(function() {
                    scope.statusMouth = false;
                    mouthDebounce = true;
                    scope.$digest();
                }, 700)
            }

            function resetBrow() {
                if(scope.ready) {
                    if(scope.rowSelect) {
                        scope.rowSelect = false;
                        scope.letterSelect = true;
                        scope.rowArray[scope.rowIndex] = 0;
                        scope.styleArray[scope.rowIndex][0] = 1;
                    }
                    else if(scope.letterSelect) {
                        scope.letterInput = 'letter-success';
                        pushLetter();
                        scope.styleArray[scope.rowIndex][scope.letterIndex] = 0;
                        scope.letterSelect = false;
                        scope.rowSelect = true;
                        startRow();
                        scope.letterIndex = 0;
                    }
                }
                setTimeout(function() {
                    scope.statusBrow = false;
                    scope.letterInput = '';
                    scope.selectBox = "";
                    scope.$digest();
                    browDebounce = true;
                }, 700)
            }



            scope.takeBase = function() {
                leftZeroArray = scope.leftDetails;
                rightZeroArray = scope.rightDetails;
                browZeroArray = scope.browDetails;
                takeReading();
                getScore();
                clearInterval(calibrateInterval)
            }


            scope.resetZero = function() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    leftZeroArray = leftArray.map(function(index) {
                        return positions[index][1]
                    });
                    rightZeroArray = rightArray.map(function(index) {
                        return positions[index][1]
                    });
                    browZeroArray = browArray.map(function(index) {
                        return positions[index][1]
                    })
                }
            }
            

            function findZero() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    mouthZero = BlinkFactory.mouthDistance(positions);
                    scope.leftDetails = leftArray.map(function(index) {
                        return positions[index][1]
                    });
                    scope.rightDetails = rightArray.map(function(index) {
                        return positions[index][1]
                    });
                    scope.browDetails = browArray.map(function(index) {
                        return positions[index][1]
                    })
                    scope.$digest();
                }

            }


            function readPositions() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    var currentMouth = BlinkFactory.mouthDistance(positions)
                    scope.zeroArray = BlinkFactory.percentChange(leftZeroArray, rightZeroArray, browZeroArray, positions)
                }
                scope.leftThres = scope.zeroArray[0] - scope.leftThreshold;
                scope.rightThres = scope.zeroArray[1] - scope.thresholdB;
                scope.browThres = scope.zeroArray[2] - scope.browThreshold;
                scope.mouthThres = (currentMouth - mouthZero) - scope.mouthThreshold;


                if(scope.mouthThres > 0 && mouthDebounce) {
                    scope.statusMouth = true;
                    // if(!scope.ready) {
                    //     scope.ready = true;
                    // }
                    resetMouth();
                    mouthDebounce = false;
                }

                if(scope.browThres > 0 && browDebounce) {
                    console.log('brow select!');
                        scope.selectBox = "selected-letter";
                        scope.statusBrow = true;
                        scope.$digest();
                        browDebounce = false
                        resetBrow();
                }
                if ((scope.leftThres > 0) && (scope.rightThres > 0) && rightDebounce && leftDebounce && eyeDebounce) {
                    
                    var leftDiff = scope.zeroArray[0] - scope.leftThreshold 
                    var rightDiff = scope.zeroArray[1] - scope.thresholdB 
                    scope.eyeDiff = (Math.abs(leftDiff - rightDiff) / (scope.leftThreshold + scope.thresholdB)) * 100;
                  
                    if (scope.leftThres > scope.rightThres && leftDebounce) {
                        scope.statusLeft = true;
                        scope.$digest();
                        resetLeft();
                        leftDebounce = false;
                    } 
                    else if(rightDebounce) {
                        scope.statusRight = true;
                        scope.$digest();
                        resetRight();
                        rightDebounce = false;
                    }
                }
              
                scope.$digest();
            }

            var demo1 = new autoComplete({
            selector: '#auto-form',
            minChars: 1,
            source: function(term, suggest){
                term = term.toLowerCase();
                var choices = ['HELLO', "GOOBYE", "ALLIE", "DANE"];
                var suggestions = [];
                for (var i=0; i<choices.length; i++)
                    if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                suggest(suggestions);
            }
            });





            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
                

            }
            getScore();

            //takeReading();
            calibrate();
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    initialize();
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