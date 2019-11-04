angular.module('GPSTracker')
.directive('repeatOnHold', function() {
  return {
    restrict: 'A',
    scope: {
      ngClick: '&'
    },
    link: function(scope, element) {
      var vm = scope;
      var interval = null;
      var timeout = null;
      var isBeingPressed = false;

      element.bind('mousedown', function() {
        isBeingPressed = true;
        timeout = setTimeout(function () {
          timeout = null;

          if(!isBeingPressed) {
            return;
          }

          interval = setInterval(function () {
            vm.ngClick();
            scope.$apply();
          }, 100);
        }, 500);
      });

      element.bind('mouseup', function() {
        isBeingPressed = false;
        if(timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        if(interval) {
          clearInterval(interval);
          interval = null;
        }
      });
    }
  };
});
