angular.module('GPSTracker')
.filter('reverse-list', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
