angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'appRoutes',
    'anasayfaCtrl',
    'girisCtrl',
    'kayitCtrl',
    'indexCtrl',
    'btcCtrl',
    'ltcCtrl',
    'bchCtrl',
    'profilCtrl',
    'cikisCtrl',
    'angular.filter'
]);
angular.module('indexCtrl', []).controller('IndexController', function($scope,$http,$location,$rootScope,socketFac,$timeout) {
    $scope.indexForm = {}; //index form objessi tanımla

    socketFac.on('connect', function(data) {
        socketFac.emit('testAlert', 'merhaba');
    });

    socketFac.on('mesaj',function(data) {
      alert(data)
    })

    $http.get('api/bakiyeGetir')
    .then(function(response) {
        $scope.tlBakiye = parseFloat(response.data.tl).toFixed(2);
        $scope.btcBakiye = parseFloat(response.data.btc).toFixed(8);
        $scope.ltcBakiye = parseFloat(response.data.ltc).toFixed(8);
        $scope.bchBakiye = parseFloat(response.data.bch).toFixed(8);
    });
    $http.get("api/webConfig")
    .then(function(response) {
        $scope.baslik = response.data.Baslik;
    });
    $http.get('api/girisKontrol')
    .then(function(response) {
        $scope.email = response.data.email;
        $scope.durum = response.data.durum;
        $scope.seq = response.data.seq;
    });
    // Soket ile veri geldiğinde bakiyeleri güncelle
    socketFac.on('bakiyxe',function(data) {
        console.log('Bakiye Güncelleme')
        if($scope.durum == '1')
        {
        $http.get('api/bakiyeGetir')
        .then(function(response) {
            $scope.tlBakiye = parseFloat(response.data.tl).toFixed(2);
            $scope.btcBakiye = parseFloat(response.data.btc).toFixed(8);
            $scope.ltcBakiye = parseFloat(response.data.ltc).toFixed(8);
            $scope.bchBakiye = parseFloat(response.data.bch).toFixed(8);
            console.table(response.data);
        })
        }
    })

    $scope.bakiyeGuncelle = function() {
        console.log('Bakiye Güncelleme')
        if($scope.durum == '1')
        {
        $http.get('api/bakiyeGetir')
        .then(function(response) {
            $scope.tlBakiye = parseFloat(response.data.tl).toFixed(2);
            $scope.btcBakiye = parseFloat(response.data.btc).toFixed(8);
            $scope.ltcBakiye = parseFloat(response.data.ltc).toFixed(8);
            $scope.bchBakiye = parseFloat(response.data.bch).toFixed(8);
            console.table(response.data);
        })
        }
    }
    

    $rootScope.$on("bakiyeGuncelle", function(){
        $scope.bakiyeGuncelle();
    })

    $rootScope.$on("sayfaGuncelle", function(){
        $scope.guncelle();
     });
    $scope.guncelle = function() {
        $http.get('api/girisKontrol')
        .then(function(response) {
            $scope.email = response.data.email;
            $scope.durum = response.data.durum;
            $scope.seq = response.data.seq;
            console.log($scope.seq)
            socketFac.emit('giris',{ SEQ : $scope.seq})
        });
        $http.get('api/bakiyeGetir')
        .then(function(response) {
            $scope.tlBakiye = response.data.tl;
            $scope.btcBakiye = response.data.btc;
            $scope.ltcBakiye = response.data.ltc;
            $scope.bchBakiye = response.data.bch;
        });
    }
    $scope.giris = function()
    {
		$http({
			url: '/api/giris',
			method: 'POST',
			data : {email : $scope.indexForm.email,sifre: $scope.indexForm.sifre}
		}).then(function(response){
			console.log(response)
            $scope.indexForm.cevap = response.data;
            $scope.guncelle()
            $location.path('/');   
         
		},function(response) {
			console.log(response)
			$scope.indexForm.cevap = response.data;
		})
    }
      // Burada amaç bu fonksiyona giren değer array oluyor ve arraydekilerden herhangi biri aktif ise o menü list elementini active ediyor -- Erim Varış
    $scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf($location.path()) > -1)
        {
            return true;
        } else {
            return false;
        }
    };

});
angular.module('myApp')
.directive('bsActiveLink', ['$location', function ($location) {
return {
    restrict: 'A', //use as attribute 
    replace: false,
    link: function (scope, elem) {
        //after the route has changed
        scope.$on("$routeChangeSuccess", function () {
            var hrefs = ['/#' + $location.path(),
                         '#' + $location.path(), //html5: false
                         $location.path()]; //html5: true
            angular.forEach(elem.find('a'), function (a) {
                a = angular.element(a);
                if (-1 !== hrefs.indexOf(a.attr('href'))) {
                    a.parent().addClass('active');
                } else {
                    a.parent().removeClass('active');   
                };
            });     
        });
    }
}
}]);

angular.module('myApp')
.directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
          element.addClass('changed');
          $timeout(function() {
            element.removeClass('changed');
          }, 1000); // Could be enhanced to take duration as a parameter
        }
      });
    };
  });
