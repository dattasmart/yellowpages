emailsDirectory.service('dataService', function($http){
	return{
		// Cuando se cargue la página, pide del API todos los TODOs
		getData:function(successcb){
			$http.get('/api/todos')
				.success(function(data) {
					successcb(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
	};
});