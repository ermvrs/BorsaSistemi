angular.module('btcCtrl', []).controller('BtcController', function($scope,$http,$interval,socketFac,$rootScope) {
    $scope.giris = 'Bitcoin';
    $scope.emirler = new Object();
    $scope.sortAlis = function(emir) {
        return -parseFloat(emir.kur)
    }
    $scope.sortSatis = function(emir) {
        return +parseFloat(emir.kur)
    }
    /* socketFac.on('testOrder' , function(data){
        // Bu komut kurdan kaçıncı indexte durduğunu buluyor. bunu kullanarak güncellenebilir.
     // var objFound = $scope.emirler.alis.findIndex(obj => obj.kur == data.kur)
      console.log(objFound);
    }) */

    socketFac.on('bakiye', function(){
        $rootScope.$emit("bakiyeGuncelle",{});
    })
    socketFac.on('emirEkle', function(data) {
        console.table(data);
        if(data.side == '0')
        {
           let objFound = $scope.emirler.alis.findIndex(obj => obj.kur == data.kur)
           if(objFound >= 0) {
               // aynı kur var ve indexi objFound Satırı güncelle
               $scope.emirler.alis[objFound].miktar += data.miktar;
           } else {
           $scope.emirler.alis.push(data); // aynı kur yok emri listeye sok.
           // bu veritabanından gelen limiti arttırır eğer limitlemek istiyorsak listeden son emri çıkartmalıyız
           // $scope.emirlrr.alis.pop() -> Limiti sabitlemek için kullanılabilir --- Erim Varış
           }
        } else {
            let objFound = $scope.emirler.satis.findIndex(obj => obj.kur == data.kur)
            if(objFound >= 0){
                // emir eşleşince miktar azalma
              $scope.emirler.satis[objFound].miktar += parseFloat(data.miktar);
            } else {
                $scope.emirler.satis.push(data);
                
            }

        }
    })

    socketFac.on('kurAzalt',function(data){
        console.table(data);
        if(data.side == '0')
        {
        let objFound = $scope.emirler.alis.findIndex(obj => obj.kur == data.kur)
            if(objFound >= 0)
            {
                if($scope.emirler.alis[objFound].miktar == data.miktar){
                    $scope.emirler.alis.splice(objFound,1)
                    console.log('Tablo Alış')
                    console.table($scope.emirler.alis);
                } else {
                    $scope.emirler.alis[objFound].miktar -= data.miktar;
                }
            } else {
                console.log('Aynı Kurdan Veri Bulunamadı.')
            }
        } else {
            let objFound = $scope.emirler.satis.findIndex(obj => obj.kur == data.kur)
            if(objFound >= 0)
            {
                if($scope.emirler.satis[objFound].miktar == data.miktar){
                    $scope.emirler.satis.splice(objFound,1)
                    console.log('Tablo Satış')
                    console.table($scope.emirler.satis);
                } else {
                    $scope.emirler.satis[objFound].miktar -= data.miktar;
                }
            } else {
                console.log('Aynı Kurdan Veri Bulunamadı.')
            }
        }
    })
    $http.get("/api/btctry/alis")
    .then(function(response) {
        if(response.data.hata)
        {
        $scope.emirler.alis = [];
        } else {
        $scope.emirler.alis = response.data;
        }
    });	
    $http.get("/api/btctry/satis")
    .then(function(response) {
        if(response.data.hata)
        {
        $scope.emirler.satis = [];
        } else {
        $scope.emirler.satis = response.data;
        }
    });
    // toplamı 2 haneli yaz
   /* $interval(function(){
        $http.get("/api/btctry/alis")
        .then(function(response) {
            if(response.data.hata)
            {
            $scope.emirler.alis = [];
            } else {
            $scope.emirler.alis = response.data;
            }
        });	
        $http.get("/api/btctry/satis")
        .then(function(response) {
            if(response.data.hata)
            {
            $scope.emirler.satis = [];
            } else {
            $scope.emirler.satis = response.data;
            }
        });
    },1000)*/
    socketFac.on('emirGuncelle',function(data) {
        $http.get("/api/btctry/alis")
        .then(function(response) {
            if(response.data.hata)
            {
            $scope.emirler.alis = [];
            } else {
            $scope.emirler.alis = response.data;
            }
        });	
        $http.get("/api/btctry/satis")
        .then(function(response) {
            if(response.data.hata)
            {
            $scope.emirler.satis = [];
            } else {
            $scope.emirler.satis = response.data;
            }
        });
        console.log('Emirler Güncellendi.')
    })
    $scope.satisSubmit = function() {
            var emir = {
                userid: '2',
                miktar: $scope.satis_miktar,
                kur: $scope.satis_kur,
                side: 1,
            }

        $http({
			url: '/api/btctry/emir',
			method: 'POST',
			data : {miktar: parseFloat($scope.satis_miktar).toFixed(8), kur: parseFloat($scope.satis_kur).toFixed(2),side: 1,paratipi: 1}
		}).then(function(response){
            console.log(response)
            $scope.satis_kur=null
            $scope.satis_miktar=null
            $scope.satis_toplam=null
            socketFac.emit('bakiye','emirgirildi')
            $scope.response = response.data.sonuc;
		},function(response) {
			console.log(response)
			$scope.response = response.data.sonuc;
		})
    };
$scope.alisSubmit = function() {
    
    var emir = {
        userid: '4',
        miktar: $scope.alis_miktar,
        kur: $scope.alis_kur,
        side: '0',
    }
        $http({
			url: '/api/btctry/emir',
			method: 'POST',
			data : {miktar: parseFloat($scope.alis_miktar).toFixed(8), kur: parseFloat($scope.alis_kur).toFixed(2),side:0,paratipi: 1}
		}).then(function(response){
            console.log(response)
            $scope.alis_miktar=null;
            $scope.alis_kur=null;
            $scope.alis_toplam=null;
            socketFac.emit('bakiye','emirgirildi')
			$scope.response = response.data.sonuc;
		},function(response) {
			console.log(response)
			$scope.response = response.data.sonuc;
		})
   }
$scope.AlisChange = function() {
    // burada type boşken undefined geliyo
    if($scope.alis_kur == null || $scope.alis_miktar == null)
    {
        console.log('null');
        $scope.alis_toplam = parseFloat('0').toFixed(2);
    } else {
  $scope.alis_toplam = parseFloat($scope.alis_kur * $scope.alis_miktar).toFixed(2);
    }
    
}
$scope.SatisChange = function() {
    if($scope.satis_kur == null || $scope.satis_miktar == null)
    {
        $scope.satis_toplam = parseFloat('0').toFixed(2);
    } else {
  $scope.satis_toplam = parseFloat($scope.satis_kur * $scope.satis_miktar).toFixed(2);
}
  }
});