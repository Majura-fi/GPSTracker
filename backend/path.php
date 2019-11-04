<?php

require_once "path_info.php";
require_once "map_point.php";

class Path {
  private $mapPoints;
  private $pathInfo;

  function __construct() {
    $this->mapPoints = array();
    $this->pathInfo = new PathInfo();
  }

  public function setInfo($value) {
    if(!($value instanceof PathInfo)) {
      throw new Exception("Expected PathInfo object!");
    }
    $this->pathInfo = $value;
  }

  public function addMapPoint($value) {
    if(!($value instanceof MapPoint)) {
      throw new Exception("Expected MapPoint object!");
    }
    array_push($this->mapPoints, $value);
  }

  public function flatten() {
    $points = array();
    foreach ($this->mapPoints as $value) {
      array_push($points, $value->flatten());
    }

    return array(
      'info' => $this->pathInfo->flatten(),
      'points' => $points
    );
  }
}
