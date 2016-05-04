app.directive('blBox', function(){

    return {
        restrict: "E",
        templateUrl: "js/common/directives/boxes/boxes.html",
        scope: {
            contents: "="
        },
        link: function(scope, elem, attrs){
            console.log("contents", scope.contents)
            scope.$watch("contents", function(){
                if (scope.contents.length === 1){
                    scope.elem = ["-", "-", scope.contents, "-", "-"]
                } else {
                    scope.elem = scope.contents
                    console.log(scope.elem)

                }
            })
            console.log(scope.contents.length)
        }
    }

})
