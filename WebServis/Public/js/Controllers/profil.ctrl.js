angular.module('profilCtrl', []).controller('ProfilController', function($scope,$http,$location) {

    $scope.profil = {};

    // buradaki sistemi güncelle direk genel bir factory veya service yaz veya bu root scopetan verileri çeksişn
    $http.get('api/girisKontrol')
    .then(function(response) {
        $scope.profil.email = response.data.email;
        $scope.profil.durum = response.data.durum;
        if($scope.durum == '0')
        {
            $location.path('/');
        }
    })

    $scope.sifreGuncelle = function(){
        $http({
			url: '/api/sifreGuncelle',
			method: 'POST',
			data : {mevcutSifre: $scope.profil.mevcutSifre, yeniSifre: $scope.profil.yeniSifre }
		}).then(function(response){
			console.log(response)
			$scope.profil.response = response.data;
		},function(response) {
			console.log(response)
			$scope.profil.response = response.data;
		})
    }
});