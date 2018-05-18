angular.module('kayitCtrl', []).controller('KayitController', function($scope,$http) {

	
	$scope.submit = function() {
		var xdata = {
			email : $scope.email,
			sifre : $scope.sifre,
			isim  : $scope.isim
		}
		console.log(xdata);
		$http({
			url: '/api/kayit',
			method: 'POST',
			data : {email : xdata.email , isim: xdata.isim ,sifre: xdata.sifre}
		}).then(function(response){
			console.log(response)
			$scope.response = response.data.kayit;
		},function(response) {
			console.log(response)
			$scope.response = response.data.kayit;
		})
	}
});