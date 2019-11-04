angular.module('GPSTracker')
.filter('duration_hours', function() {
  return function(ms) {
    return Math.floor(moment.duration(ms).asHours()*10)/10;
  };
})
.filter('duration_minutes', function() {
  return function(ms) {
    return Math.floor(moment.duration(ms).asMinutes());
  };
});
