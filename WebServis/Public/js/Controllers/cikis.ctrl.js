angular.module('cikisCtrl', []).controller('CikisController', function($scope,$http,$rootScope) {

    $http.get('api/cikis')
    .then(function(response) {
        $scope.cevap = response.data;
        $rootScope.$emit("sayfaGuncelle",{});
    })

});