function Bakiye(userID,paratipi,miktar) {
    var obj = {};
    obj.userID = userID;
    obj.miktar = miktar;
    obj.paratipi = paratipi;
    return obj;
   }

module.exports = Bakiye;