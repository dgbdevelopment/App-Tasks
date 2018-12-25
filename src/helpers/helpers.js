const helper = {
   checked: function (value, test) {
      if (value == undefined) return '';
      if (value == test) {
         return 'checked';
      } else {
         return '';
      }
   },
   active: function (value, test) {
      if (value == undefined) return '';
      if (value == test) {
         return 'active';
      } else {
         return '';
      }
   }
}

module.exports = helper