
var InfoYaz = (baslik,mesaj) => {
console.info("[" + baslik + "]" + ": " + mesaj)
}

var HataYaz = (baslik,mesaj) => {
    console.error("[" + baslik + "]" + ": " + mesaj)
}

module.exports = {InfoYaz,HataYaz};