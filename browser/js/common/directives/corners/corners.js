app.directive('corners', function() {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/corners/corners.html',
        link: function(scope) {

            scope.log = function(){
                console.log("Left", scope.lefteyeX.toFixed(1),scope.lefteyeY.toFixed(1))
                //console.log("Right",scope.righteyeX.toFixed(1),scope.righteyeY.toFixed(1))
            }
            let zero = []
            scope.zero = function(){
                zero=[scope.eyeX, scope.eyeY]
                console.log(zero)
            }



            //initiates webcam
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            var errorCallback = function(e) {
                console.log('Reeeejected!', e);
            };

            var video = document.getElementById('webcam');

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

            //start tracker
            var ctracker = new clm.tracker();
            ctracker.init(pModel);
            ctracker.start(video);
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");

            scope.box = [0, 0, 0, 0, 0, 0, 0, 0]


            function eyePosition(){
                var xDiff = scope.eyeX - zero[0];
                var yDiff = zero[1] - scope.eyeY;
                var thresholdX = 0;
                var thresholdY = 0;
                scope.eyeDiff = xDiff
                if(xDiff < 0 && Math.abs(yDiff) < thresholdY) {
                    scope.box = [0, 0, 0, 1, 0, 0, 0, 0]
                }
                else if(xDiff > 0 && Math.abs(yDiff) < thresholdY) {
                    scope.box = [0, 0, 0, 0, 0, 0, 0, 1]
                }
                else if(xDiff < 0 && yDiff > 0){
                    if (Math.abs(xDiff) < thresholdX) {
                        scope.box = [0, 1, 0, 0, 0, 0, 0, 0]
                    }
                    else scope.box = [0, 0, 1, 0, 0, 0, 0, 0]

                } else if(xDiff > 0 && yDiff > 0){
                    if (Math.abs(xDiff) < thresholdX) {
                        scope.box = [0, 1, 0, 0, 0, 0, 0, 0]
                    }
                    else scope.box = [1, 0, 0, 0, 0, 0, 0, 0]

                } else if(xDiff > 0 && yDiff < 0){
                    if (Math.abs(xDiff) < thresholdX) {
                        scope.box = [0, 0, 0, 1, 0, 0, 0, 0]
                    }
                    else scope.box = [0, 0, 0, 0, 1, 0, 0, 0]

                } else if(xDiff < 0 && yDiff < 0){
                    if (Math.abs(xDiff) < thresholdX) {
                        scope.box = [0, 0, 0, 0, 0, 1, 0, 0]
                    }
                    else scope.box = [0, 0, 0, 0, 0, 0, 1, 0]

                }
            }

            //initial canvas drawing
            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
                if(positions) {
                    // scope.lefteyeX = positions[27][0]// - positions[37][0];
                    // scope.lefteyeY = positions[27][1]//- positions[37][1];
                    // scope.righteyeX = positions[32][0]//- positions[37][0];
                    // scope.righteyeY = positions[32][1]//- positions[37][1];
                    scope.eyeX = positions[27][0] + positions[32][0]
                    scope.eyeY = positions[27][1] + positions[32][1]
                    eyePosition();
                    scope.$digest();

                }
            }

            //draws on canvas, needed to position over video
            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctracker.draw(canvas);
            }


        }
    };

});
