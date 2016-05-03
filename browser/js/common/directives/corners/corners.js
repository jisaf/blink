app.directive('corners', function() {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/corners/corners.html',
        link: function(scope) {
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

            //initial canvas drawing
            function positionLoop() {
                requestAnimationFrame(positionLoop);
                var positions = ctracker.getCurrentPosition();
                scope.lefteyeX = positions[27][0] - positions[37][0];
                scope.lefteyeY = positions[27][1]- positions[37][1];
                scope.righteyeX = positions[32][0]- positions[37][0];
                 scope.righteyeY = positions[32][1]- positions[37][1];
                 scope.$digest();
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
