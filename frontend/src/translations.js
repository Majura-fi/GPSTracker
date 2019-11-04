angular.module('GPSTracker')
.config(function($translateProvider) {
  $translateProvider.translations('en', {
    ACCURACY: 'Accuracy:',
    ALTITUDE: 'Altitude:',
    SPEED: 'Speed:',
    TIME: 'Time:',
    AVAILABLE_PATHS: 'Available Paths:',
    CENTER_TO_LATEST_POINT: 'Center automatically on the latest point',
    SELECT_LATEST_POINT: 'Select latest point automatically',
    POINT_INFO: 'Point Info #{{number}}:',
    LIVE_CONTROL: 'Live control:',
    PATH_INFO: 'Path info:',
    PATH_POINTS_COUNT: 'Points count:',
    PATH_STARTED: 'Started:',
    PATH_ENDED: 'Ended:',
    PATH_UNFINISHED: 'In progress..',
    PATH_DURATION: 'Duration:',
    HOURS: 'hours'
  });
  $translateProvider.translations('fi', {
    ACCURACY: 'Tarkkuus:',
    ALTITUDE: 'Korkeus:',
    SPEED: 'Nopeus:',
    TIME: 'Aika:',
    AVAILABLE_PATHS: 'Reitit:',
    CENTER_TO_LATEST_POINT: 'Kohdista automaattisesti viimeiseen pisteeseen',
    SELECT_LATEST_POINT: 'Valitse viimeisin piste automaattisesti',
    POINT_INFO: 'Pisteen #{{number}} tiedot:',
    LIVE_CONTROL: 'Live-hallinta:',
    PATH_INFO: 'Reitin tiedot:',
    PATH_POINTS_COUNT: 'Pisteiden määrä:',
    PATH_STARTED: 'Aloitettu:',
    PATH_ENDED: 'Lopetettu:',
    PATH_UNFINISHED: 'Tallennus kesken..',
    PATH_DURATION: 'Kesto:',
    HOURS: 'tuntia'
  });
});
