app.config(function($stateProvider){
    $stateProvider.state('corners', {
        url: '/corners',
        templateUrl: 'js/video/corners-template.html',
        controller: 'VideoCtrl'
    })
});
