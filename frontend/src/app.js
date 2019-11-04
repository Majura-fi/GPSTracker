angular.module('GPSTracker', [
  'ngMap',
  'ngMaterial',
  'ngAnimate',
  'ngAria',
  'pascalprecht.translate',
  'ngSanitize'
])
.config(function($mdDateLocaleProvider, $translateProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY-MM-DD');
  };

  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy(null);
});
