angular.module('GPSTracker')
.service('GPSApi', ['$http', '$q', '$interval', function($http, $q, $interval) {
  "use strict";

  var vm = this;
  var baseUrl = "[DEV_BASE_URL]";
  vm.availablePaths = {};
  vm.listeners = [];

  var addListener = function(callback) {
    vm.listeners.push(callback);
  };

  var removeListener = function(callback) {
    let index = vm.listeners.indexOf(callback);
    if(index > -1) {
      vm.listeners.splice(index, 1);
    }
  };

  var getPath = function(pathId) {
    var deferred = $q.defer();

    let path = vm.availablePaths[pathId];
    if(!path) {
      _getPath(pathId)
      .then((path) => {
        console.log("getPath()", pathId, "[NET]");
        deferred.resolve(path);
      }, (error) => {
        deferred.reject(error);
      });
    } else {
      console.log("getPath()", pathId, "[Cache]");
      deferred.resolve(path);
    }

    return deferred.promise;
  };


  var getPaths = function() {
    let out = {};

    for (let pathId in vm.availablePaths) {
      if (!vm.availablePaths.hasOwnProperty(pathId)) {
        continue;
      }
      out[pathId] = vm.availablePaths[pathId].info;
    }
    console.log("getPaths():", out);
    return out;
  };


  var updatePath = function(pathId) {
    var deferred = $q.defer();
    _getPath(pathId)
    .then((path) => {
      vm.availablePaths[pathId] = path;
      deferred.resolve(path);
    }, (error) => {
      deferred.reject(error);
    });
    return deferred.promise;
  };


  var update = function() {
    let handleError = function(error) {
      console.warn('Failed to update path.', error);
    };

    _getPaths()
    .then(function(paths) {
      for (let path2 of paths) {

        if(!vm.availablePaths[path2.pathId]) {
          vm.availablePaths[path2.pathId] = {info: path2};
          updatePath(path2.pathId)
          .then(notifyListeners, handleError);
        }

        var path1 = vm.availablePaths[path2.pathId].info;

        if(path1.pointsCount !== path2.pointsCount) {
          path1 = path2;
          vm.availablePaths[path2.pathId].info = path2;

          updatePath(path2.pathId)
          .then(notifyListeners, handleError);
        }
      }

    });
  };


  var notifyListeners = function(path) {
    for (let listener of vm.listeners) {
      try {
        listener(path);
      } catch (e) {
        console.warn(e);
      }
    }
  };


  var request = function(req, query) {
    var deferred = $q.defer();

    let config = {
      url: baseUrl + req
    };

    if(query) {
      config.params = query;
    }

    $http(config)
    .then((response) => {
      deferred.resolve(response);
    }, (error) => {
      deferred.reject(error);
    });
    return deferred.promise;
  };


  var _getPath = function(pathId, lastPointTime) {
    var deferred = $q.defer();

    let query = {
      last_point_time: lastPointTime
    };

    request(`/path/${pathId}/`, query)
    .then((response) => {
      if(response.data.status !== 'ok') {
        deferred.reject(['Failed to get the path.', response.data.reason]);
        return;
      }

      let path = {
        info: {
          pathId: Number(response.data.content.info.path_id),
          pointsCount: Number(response.data.content.info.point_count),
          firstPointTime: response.data.content.info.first_point_time,
          lastPointTime: response.data.content.info.last_point_time
        },
        pointsInfo: response.data.content.points,
        points: []
      };

      for (let point of response.data.content.points) {
        path.points.push([Number(point.latitude), Number(point.longitude)]);
      }

      deferred.resolve(path);
    }, (error) => {
      deferred.reject(['Request failed for getting the path.', error]);
    });

    return deferred.promise;
  };


  var _getPaths = function() {
    var deferred = $q.defer();

    request('/paths/')
    .then((response) => {
      if(response.data.status !== 'ok') {
        deferred.reject(['Requesting available paths were succesful, but status was not ok.', response.data.reason, response]);
        return;
      }

      var paths = [];
      for (let path of response.data.content) {
        paths.push({
          pathId: path.path_id,
          pointsCount: path.point_count,
          firstPointTime: path.first_point_time,
          lastPointTime: path.last_point_time
        });
      }

      deferred.resolve(paths);
    }, (error) => {
      deferred.reject(['Got error when requesting available paths.', error]);
    });
    return deferred.promise;
  };

  var onLoad = function() {
    update();
    $interval(update, 15000);
  };
  onLoad();

  return {
    addListener: addListener,
    removeListener: removeListener,
    getPath: getPath,
    getPaths: getPaths
  };
}]);
