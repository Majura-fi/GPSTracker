angular.module('GPSTracker')
  .controller('MapCtrl', ['$rootScope', '$scope', 'GPSApi', '$http', '$interval', '$translate', function ($rootScope, $scope, gpsApi, $http, $interval, $translate) {
    "use strict";

    $scope.vm = {};
    var vm = $scope.vm;

    vm.map = null;
    vm.availablePaths = {};
    vm.selectedPoint = null;
    vm.selectedPathId = null;
    vm.currentPath = {
      info: {
        pathId: 0,
        pointsCount: 0,
        firstPointTime: '1940-01-01T00:00:00Z',
        lastPointTime: '1940-01-01T00:00:00Z'
      },
      points: [],
      pointsInfo: [],
      pointsCount: 0,
      selectedPointIndex: 0
    };
    vm.live = {
      displayLatestPoint: true,
      followLatestPoint: true
    };
    vm.isMobile = isMobile();
    vm.mapCenter = {
      latitude: 60.91708455554494,
      longitude: 24.5489501953125
    };


    vm.changeLanguage = function (key) {
      $translate.use(key);
    };


    $rootScope.$on('mapInitialized', function (evt, map) {
      console.log("Map initialized.");
      vm.map = map;
      $scope.$apply();
    });


    vm.calculateDuration = function (pathInfo) {
      let a = moment.utc(pathInfo.firstPointTime);
      let b = moment.utc(pathInfo.lastPointTime);
      return b - a;
    };

    vm.nextPoint = function () {
      vm.live.displayLatestPoint = false;
      vm.live.followLatestPoint = false;

      vm.selectedPointIndex += 1;
      if (vm.selectedPointIndex >= vm.currentPath.points.length) {
        vm.selectedPointIndex = vm.currentPath.points.length - 1;
      }
      vm.selectedPointChanged();
    };


    vm.previousPoint = function () {
      vm.live.displayLatestPoint = false;
      vm.live.followLatestPoint = false;

      vm.selectedPointIndex -= 1;
      if (vm.selectedPointIndex < 0) {
        vm.selectedPointIndex = 0;
      }
      vm.selectedPointChanged();
    };


    vm.selectedPointChangedSlider = function () {
      vm.live.displayLatestPoint = false;
      vm.live.followLatestPoint = false;

      vm.selectedPointChanged();
    };


    vm.selectedPointChanged = function () {
      if (vm.currentPath.pointsInfo.length === 0) {
        vm.selectedPoint = null;
        return;
      }

      vm.selectedPoint = vm.currentPath.pointsInfo[vm.selectedPointIndex];
      vm.selectedPoint.location = vm.currentPath.points[vm.selectedPointIndex];

      vm.mapCenter.latitude = vm.selectedPoint.latitude;
      vm.mapCenter.longitude = vm.selectedPoint.longitude;
    };


    vm.onPathSelect = function (pathId) {
      pathId = Number(pathId);
      if (!isNaN(pathId)) {
        console.log('Selected:', pathId);
        vm.selectedPathId = pathId;
      } else {
        console.log('Selected2:', vm.selectedPathId);
      }
      vm.updateCurrentPath();
    };


    vm.newerThan30Seconds = function (timeStr) {
      let then = moment.utc(timeStr);
      let now = moment.utc();
      return (now - then) < 30000;
    };


    vm.updateCurrentPath = function () {
      gpsApi.getPath(vm.selectedPathId)
        .then((path) => {
          console.log('Current path:', path);
          vm.currentPath = path;
          vm.selectedPointIndex = 0;
          vm.selectedPointChanged();
        }, (error) => {
          console.error(error);
        });
    };


    var onUpdate = function (path) {
      vm.availablePaths = gpsApi.getPaths();
      console.log("Update. Available paths: ", vm.availablePaths);
      console.log("User is watching ", vm.selectedPathId, "and updated path id is ", path.info.pathId);

      if (vm.selectedPathId === path.info.pathId) {
        console.log("User is watching live path.");

        gpsApi.getPath(path.info.pathId)
          .then((path2) => {
            console.log("Updated path.");
            vm.currentPath = path2;

            if (vm.live.displayLatestPoint) {
              vm.selectedPointIndex = vm.currentPath.pointsInfo.length - 1;
              vm.selectedPointChanged();
            }

            if (vm.live.followLatestPoint) {
              let lastPoint = vm.currentPath.pointsInfo[vm.currentPath.pointsInfo.length - 1];
              vm.mapCenter.latitude = lastPoint.latitude;
              vm.mapCenter.longitude = lastPoint.longitude;
            }

          }, (error) => {
            console.warn(error);
          });
      }
    };

    var onLoad = function () {
      gpsApi.addListener(onUpdate);
    };
    onLoad();

  }]);
