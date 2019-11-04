<?php
require_once "utils.php";
require_once "database.php";
require_once "map_point.php";
require_once "path_info.php";

class MyGPSApi
{
  private $database;
  function __construct()
  {
    $this->database = new Database();
  }

  public function getPaths() {
    try {
      $paths = $this->database->getPaths();
      $results = array();
      foreach ($paths as $pathInfo) {
        $results[] = $pathInfo->flatten();
      }
      return success($results);
    } catch (Exception $e) {
      return failure($e->getMessage());
    }
  }

  public function getPath($id, $query) {
    try {
      $lastPointTime = '1940-01-01T00:00:00Z';
      if(isset($query['last_point_time'])) {
        $lastPointTime = new DateTime(
          $query['last_point_time'],
          new DateTimeZone('UTC')
        );
        $lastPointTime = $lastPointTime->format("Y-m-d\TH:i:s\Z");
      }

      $path = $this->database->getPath($id, $lastPointTime);
      return success($path->flatten());
    } catch (Exception $e) {
      return failure(array($e->getMessage(), $query['last_point_time']));
    }
  }

  public function getPathMeta($id) {
    try {
      $path = $this->database->getPathInfo($id);
      return success($path->flatten());
    } catch (Exception $e) {
      return failure($e->getMessage());
    }
  }

  public function isLive() {
    try {
      $pathInfo = $this->database->getLatestPathInfo();

      if(!$pathInfo) {
        return success(array('islive' => false));
      }

      $dt30SecondsAgo = new DateTime(gmdate("Y-m-d\TH:i:s\Z"));
      $dt30SecondsAgo->modify('-30 seconds');

      // Older than 30 seconds.
      if($pathInfo->getLastPointTime() < $dt30SecondsAgo) {
        return success(array('islive' => false));
      }
      return success(array(
        'islive' => true,
        'path_id' => $pathInfo->getId()
      ));

    } catch (Exception $e) {
      return failure($e->getMessage());
    }
  }

  public function addPointToLatestPath($data) {
    /*
    Required:
    latitude => 61.4979425
    longitude => 23.8184076

    Optional:
    altitude => 0.0 // Zero values are considered as missing. Meters from surface.
    speed => 0.0 // Zero values are considered as missing. Metre per second.
    accuracy => 22.94700050354004 // In meters.
    */
    try {
      $mapPoint = MapPoint::create($data);

      $latestPath = $this->database->getLatestPathInfo();
      $pathId = 1;

      if($latestPath) {
        $hourAgo = new DateTime(gmdate("Y-m-d\TH:i:s\Z"));
        $hourAgo->modify('-1 hour');
        $pathId = $latestPath->getId();
        if(!is_numeric($pathId)) {
          throw new Exception("Latest path returned NaN as path id!");
        }

        if($latestPath->getLastPointTime() < $hourAgo) {
          // Latest path is older than 1 hour. Start a new path.
          $pathId += 1;
        }
      }

      $this->database->addLocation($pathId, $mapPoint);

      return success();
    } catch (Exception $e) {
      return failure(array($e->getMessage()));
    }
  }
}
