//public/main.js

var angularTodo = angular.module('angularTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// Cuando se cargue la página, pide del API todos los TODOs
	$http.get('/api/todos')
		.success(function(data) {
			$scope.listados = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// Cuando se añade un nuevo TODO, manda el texto a la API
	$scope.createListado = function(){
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.listados = data;
				console.log(data);
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
				console.log(data);
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};

	var content = 'file content';
	var blob = new Blob([ content ], { type : 'text/plain' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );


	$scope.getthefile = function () { 
 	   	$http.get('/download', $scope.data)
 	   		.success(function(data){
				var a         = document.createElement('a');
				a.href        = 'data:attachment/csv,' + encodeURI(data);
				a.target      = '_blank';
				a.download    = 'myFile.csv';

				document.body.appendChild(a);
				a.click();
 	   		});  
	};
};