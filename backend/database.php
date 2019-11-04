<?php
require_once "config.php";
require_once "map_point.php";
require_once "path.php";
require_once "path_info.php";

class Database {
  protected $connection;

  public function __construct() {
    $CONFIG = getConfig();
    $host = $CONFIG["database"]["host"];
    $user = $CONFIG["database"]["user"];
    $password = $CONFIG["database"]["password"];
    $database = $CONFIG["database"]["database"];

    $this->connection = new PDO("mysql:host=$host;dbname=$database", $user, $password);
    $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }

  public function getLatestPathInfo() {
    $sql = "
      SELECT
        path_id
      FROM locations
      ORDER BY time_utc DESC
      LIMIT 1;";
    $stmt = $this->connection->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();

    if(!$row) {
      return null;
    }

    return $this->getPathInfo($row['path_id']);
  }

  public function getPaths() {
    $sql = "
      SELECT
        path_id
      FROM locations
      GROUP BY path_id";
    $stmt = $this->connection->prepare($sql);

    $stmt->execute();
    $results = array();
    foreach ($stmt as $row) {
      $pi = $this->getPathInfo($row['path_id']);
      array_push($results, $pi);
    }

    return $results;
  }

  public function getPathInfo($id) {
    $sql = "
      SELECT
        path_id,
        DATE_FORMAT(MIN(time_utc), '%Y-%m-%dT%TZ') as first_point_time,
        DATE_FORMAT(MAX(time_utc), '%Y-%m-%dT%TZ') as last_point_time,
        COUNT(*) as point_count
      FROM locations
      WHERE path_id = :path_id";
    $stmt = $this->connection->prepare($sql);
    $stmt->bindParam(':path_id', $id);
    $stmt->execute();

    $row = $stmt->fetch();
    if(!$row) {
      return null;
    }

    return PathInfo::create($row);
  }

  public function getPath($id, $lastPointTime) {
    $pathInfo = $this->getPathInfo($id);

    $sql = "
      SELECT
        latitude,
        longitude,
        altitude,
        speed,
        accuracy,
        DATE_FORMAT(time_utc, '%Y-%m-%dT%TZ') as time
      FROM locations
      WHERE
        path_id = :path_id
        AND
        time_utc > :lastPointTime";
    $stmt = $this->connection->prepare($sql);
    $stmt->bindParam(':path_id', $id);
    $stmt->bindParam(':lastPointTime', $lastPointTime);
    $stmt->execute();

    $path = new Path();
    $path->setInfo($pathInfo);

    foreach ($stmt as $row) {
      $mp = MapPoint::create($row);
      $path->addMapPoint($mp);
    }
    return $path;
  }

  public function addLocation($pathId, $mapPoint) {
    $sql = "
      INSERT INTO locations (
        path_id,
        latitude,
        longitude,
        altitude,
        speed,
        accuracy,
        time_utc
      ) VALUES (
        :path_id,
        :latitude,
        :longitude,
        :altitude,
        :speed,
        :accuracy,
        :time
      );";

    if(empty($pathId)) {
      throw new Exception("Path id cannot be null!");
    }
    if(!is_numeric($pathId)) {
      throw new Exception("Path id must be numeric!");
    }
    if(!($mapPoint instanceof MapPoint)) {
      throw new Exception("Expected instance of MapPoint!");
    }

    $stmt = $this->connection->prepare($sql);
    $stmt->bindValue(':path_id', $pathId);
    $stmt->bindValue(':latitude', $mapPoint->getLatitude());
    $stmt->bindValue(':longitude', $mapPoint->getLongitude());
    $stmt->bindValue(':altitude', $mapPoint->getAltitude());
    $stmt->bindValue(':speed', $mapPoint->getSpeed());
    $stmt->bindValue(':accuracy', $mapPoint->getAccuracy());
    $stmt->bindValue(':time', $mapPoint->getTimeFormatted());
    $stmt->execute();
  }
}
