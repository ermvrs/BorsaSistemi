angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/anasayfa.html',
			controller: 'AnasayfaController'
		})

		.when('/cikis', {
			templateUrl: 'views/cikis.html',
			controller: 'CikisController'
		})

		.when('/profil',{
			templateUrl: 'views/profil.html',
			controller: 'ProfilController'
		})

		.when('/giris', {
			templateUrl: 'views/giris.html',
			controller: 'GirisController'
		})

		.when('/kayit', {
			templateUrl: 'views/kayit.html',
			controller: 'KayitController'	
		})

		.when('/btctry', {
			templateUrl: 'views/market.html',
			controller: 'BtcController'
		})

		.when('/ltctry', {
			templateUrl: 'views/market.html',
			controller: 'LtcController'
		})

		.when('/bchtry', {
			templateUrl: 'views/market.html',
			controller: 'BchController'
		})

        $locationProvider.html5Mode(true);

}]);