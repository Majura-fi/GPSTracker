angular.module('GPSTracker')
.service('LiveTracker', ['$q', '$interval', 'GPSApi', function($q, $interval, gpsApi) {
  "use strict";

  var vm = {};
  vm.listeners = [];

  vm.isLive = false;
  vm.livePathId = 0;
  vm.livePathLastPointTime = "1940-01-01T00:00:00Z";
  vm.livePath = null;

  vm.currentlyUpdating = false;
  vm.updatesEnabled = false;
  vm.updateInterval = null;

  var addListener = function(callback) {
    if(vm.listeners.indexOf(callback) > -1) {
      console.warn('Added same listener twice.');
    }
    vm.listeners.push(callback);
  };


  var removeListener = function(callback) {
    let index = vm.listeners.indexOf(callback);
    if(index > -1) {
      vm.listeners.splice(index, 1);
    } else {
      console.warn('Tried to remove listener, but could not find the listener.');
    }
  };


  var notifyListeners = function() {
    let data = {
      isLive: vm.isLive
    };

    if(vm.isLive) {
      data.pathId = vm.livePathId;
      data.path = vm.livePath;
      data.lastPointTime = vm.livePathLastPointTime;
    }

    for (let listener of vm.listeners) {
      try {
        listener(data);
      } catch (e) {
        console.warn('Tried to notify listener, but got exception!', e);
      }
    }
  };


  var checkIfLive = function() {
    console.log('Live check');

    gpsApi.isLive()
    .then((result) => {
      vm.isLive = result.islive;

      if(vm.isLive) {
        vm.livePathId = result.path_id;
        if(!vm.updatesEnabled) {
          console.log('Enabled live updates.');
          enableLiveUpdate();
        } else {
          console.log('Still live.');
        }
      } else {
        if(vm.updatesEnabled) {
          console.log('Disabled live updates.');
          vm.livePathId = null;
          vm.livePath = null;
          disableLiveUpdate();
        } else {
          console.log('Still dead.');
        }
      }
    }, (error) => {
      console.error(error);
    });
  };


  var enableLiveUpdate = function() {
    vm.updatesEnabled = true;

    // Get latest path before enabling update intervals.
    gpsApi.getPath(vm.livePathId)
    .then((path) => {
      vm.livePath = path;
      vm.updateInterval = $interval(updateLivePath, 15000);
    });
  };

  var disableLiveUpdate = function() {
    vm.updatesEnabled = false;
    $interval.cancel(vm.updateInterval);
  };

  var updateLivePath = function() {
    // Don't try to update the path, if there is already pending update request.
    if(vm.currentlyUpdating) {
      return;
    }
    vm.currentlyUpdating = true;

    // Get points after last known timestamp.
    gpsApi.getPath(vm.livePathId, vm.livePathLastPointTime)
    .then((path) => {
      console.log('Live path updated with ' + path.points.length + " points.");
      vm.livePath.info = path.info;
      vm.livePath.points = vm.livePath.points.concat(path.points);
      vm.livePath.pointsInfo = vm.livePath.pointsInfo.concat(path.pointsInfo);
      notifyListeners();
    }, (error) => {
      console.warn(error);
    })
    .then(() => {
      vm.currentlyUpdating = false;
    });
  };

  var isLive = function() {
    return gpsApi.isLive();
  };

  var onLoad = function() {
    checkIfLive();
    $interval(checkIfLive, 15000);
  };
  onLoad();

  return {
    isLive: isLive,
    addListener: addListener,
    removeListener: removeListener
  };
}]);
