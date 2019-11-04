angular.module('GPSTracker')
.filter('speed_ms_to_kmh', function() {
  return function(value) {
    if(isNaN(value)) {
      return "";
    }
    let result = (Math.round(value * 3.6*10)/10) + " km/h";
    return result;
  };
});
