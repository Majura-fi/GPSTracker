angular.module('GPSTracker')
.service('AvailablePaths', ['$q', '$interval', 'GPSApi', function($q, $interval, gpsApi) {
  "use strict";

  var availablePaths = [];
  var listeners = [];


  var addListener = function(callback) {
    if(listeners.indexOf(callback) > -1) {
      console.warn('Added same listener twice!');
    }
    listeners.push(callback);
  };


  var removeListener = function(callback) {
    let index = listeners.indexOf(callback);
    if(index > -1) {
      listeners.splice(index, 1);
    } else {
      console.warn('Tried to remove listener, but could not find the listener.');
    }
  };


  var notifyListeners = function(what, path) {
    for (let listener of listeners) {
      try {
        listener(what, path);
      } catch (e) {
        console.warn('Tried to notify listener, but received exception.', e);
      }
    }
  };


  var updatePaths = function(paths) {
    let hasNewPaths = false;
    for (let newPath of paths) {
      let oldPath = getPath(newPath.pathId);

      if(oldPath === null) {
        availablePaths.push(newPath);
        hasNewPaths = true;
      }
    }

    if(hasNewPaths) {
      notifyListeners();
    }
  };


  var getPath = function(id) {
    for (let path of availablePaths) {
      if(path.pathId === id) {
        return path;
      }
    }
    return null;
  };


  var getPaths = function() {
    return availablePaths;
  };


  var onLoad = function() {
    var update = function() {
      gpsApi.getPaths()
      .then(updatePaths)
      .catch((error) => {
        console.warn('Failed to update paths!', error);
      });
    };

    update();
    $interval(update, 15000);
  };
  onLoad();


  return {
    getPaths: getPaths,
    getPath: getPath,
    addListener: addListener,
    removeListener: removeListener
  };
}]);
