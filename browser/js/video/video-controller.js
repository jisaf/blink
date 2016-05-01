app.controller('VideoCtrl', function($scope, $http) {
	// $scope.loadVideo = function() {
	// 	console.log('loading video!')
	// }

	

	$scope.options = {
		shadowInput: true,
        highlightFirst: true,       
        searchMethod: "search"
	}
	$scope.getAutocompleteResults = function (query, deferred) {       	
        var url = "http://jkuchta.cz/wikisearch/?action=query&list=search&srsearch=intitle:" + query + "&format=json&srprop=snippet&continue&srlimit=10";
        
		$http.get(url).success((function (deferred, data) { // send request          
            // format data into desired structure
			var results = [];
            data.query.search.forEach(function (item) { 
                results.push({value: item.title}); 
            });	

            // resolve the deferred object
			deferred.resolve({results: results});
		}).bind(this, deferred));
	};
	console.log('controller added!');
});