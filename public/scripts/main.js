var emailsDirectory = angular.module('emailsDirectory', ['ngTable', 'ngRoute']);

emailsDirectory.controller('mainController', function ($scope, $http, ngTableParams, dataService, $filter) {
	$scope.formData = {};

	$scope.data;

	$scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
            	
            	getData: function ($defer, params) {
				     /* make ajax call */
				        var filteredData = $filter('filter')($scope.data, $scope.filter);
				        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				        /* and can resolve table promise  */
				        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				        params.total($scope.data.length);
            	}
            });

	$scope.getSavedList = function(){
		$http.get('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.data = data;
				$scope.tableParams.reload();
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};

	// Cuando se añade un nuevo TODO, manda el texto a la API
	$scope.createListado = function(){
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.data = data;
				$scope.tableParams.reload();
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};

	// Borra un TODO despues de checkearlo como acabado
	$scope.deleteListado = function() {
		$http.delete('/api/todos/')
			.success(function(data) {
				$scope.listados = data;
				$scope.tableParams.reload();
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};

	var content = 'file content';
	var blob = new Blob([ content ], { type : 'text/plain' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );


	$scope.getthefile = function () { 
		var strListado = "";
 		angular.forEach($scope.data, function(object){
 			strListado += object.name + ',' + object.email;
 		}, strListado);
		
		var a         = document.createElement('a');
		a.href        = 'data:attachment/csv,' + encodeURI(strListado);
		a.target      = '_blank';
		a.download    = 'myFile.csv';

		document.body.appendChild(a);
		a.click();
	};
});