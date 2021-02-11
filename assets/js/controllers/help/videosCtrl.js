app.controller('videosCtrl', videosCtrl);
function videosCtrl($rootScope,$translate, $scope, Restangular, $window, $element) {
    $rootScope.uService.EnterController("videosCtrl");
    var vp = this;
    $scope.videos = [{ id: 1, name: 'Hızlı Satış' }, { id: 2, name: 'Masa Siparişi' }, { id: 3, name: 'Adrese Sipariş' }, { id: 4, name: 'Yeni Kayıt ve Adrese Sipariş' }, { id: 5, name: 'Mutfak Ekranı' }, { id: 6, name: 'Sipariş Yönetimi(Adrese Sipariş)' }, { id: 7, name: 'Sipariş Yönetimi(Gel-Al Sipariş)' }, { id: 8, name: 'Sipariş Yönetimi(Masa Siparişi) ' }, { id: 9, name: 'Personel Adisyonları' }, { id: 10, name: 'Sipariş İptali' }, { id: 11, name: 'Sipariş Listesi' }, { id: 12, name: 'Sipariş Detayları' }, { id: 13, name: 'Gün Sonu' }, { id: 14, name: 'Kasa Raporu' }, { id: 15, name: 'KasaGiriş - Çıkış' }, { id: 16, name: 'Cari Hesap Kapatma' }, { id: 17, name: 'Kullanıcı Oluşturma' }, { id: 18, name: 'Çağrı Merkezi Ana Sayfa' }, { id: 19, name: 'Çağrı Merkezi Restoran Yönlendirme' }, { id: 20, name: 'Çağrı Merkezi Sipariş Yönlendirme' }, { id: 21, name: 'Çağrı Merkezi Restoran Bilgileri Değiştirme' }, { id: 22, name: 'Şikayet (Kişi Bazlı)' }, { id: 23, name: 'Şikayet (Şipariş Bazlı)' }]
    $scope.SlectedVideo = function (data) {
        vp.url = 'assets/videos/' + data + '.mp4';
        vp.oggurl = 'assets/videos/' + data + '.ogg';
        document.getElementById("mp4_src").src = "movie.mp4";
        document.getElementById("ogg_src").src = "movie.ogg";
       document.getElementById("videoplayer").load();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("videosCtrl");
    });
};
