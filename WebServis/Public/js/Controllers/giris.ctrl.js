angular.module('girisCtrl', []).controller('GirisController', function($scope,$http,$rootScope) {
    
	$scope.giris = {};	

	$scope.submit = function() {
	    var xdata = {
			email : $scope.giris.email,
			sifre : $scope.giris.sifre
		}
		console.log(xdata);
		$http({
			url: '/api/giris',
			method: 'POST',
			data : {email : xdata.email,sifre: xdata.sifre}
		}).then(function(response){
			console.log(response)
			$scope.response = response.data.mesaj;
			$rootScope.$emit("sayfaGuncelle",{});
		},function(response) {
			console.log(response)
			$scope.response = response.data.mesaj;
		})
	}
});