<?php

class PathInfo {
  private $firstPointTime;
  private $lastPointTime;
  private $pointCount;
  private $id;

  function __construct() {
    $this->firstPointTime = new DateTime(gmdate("Y-m-d\TH:i:s\Z"));
    $this->lastPointTime = new DateTime(gmdate("Y-m-d\TH:i:s\Z"));
    $this->pointCount = 0;
    $this->id = 0;
  }

  public function getId() {
    return $this->id;
  }

  public function getPointCount() {
    return $this->pointCount;
  }

  public function getFirstPointTime() {
    return $this->firstPointTime;
  }

  public function getLastPointTime() {
    return $this->lastPointTime;
  }

  public function getLastPointTimeFormatted($format="Y-m-d\TH:i:s\Z") {
    return $this->lastPointTime->format($format);
  }

  public function getFirstPointTimeFormatted($format="Y-m-d\TH:i:s\Z") {
    return $this->firstPointTime->format($format);
  }

  public function isLastPointTimeOlderThan($value) {
    if($value instanceof DateTime) {
      return $this->time < $value;
    } else if(is_string($value)) {
      $tmp = new DateTime($value);
      return $this->time < $tmp;
    } else {
      throw new Exception("Expected DateTime object or string!");
    }
  }

  public function setId($value) {
    if(!is_numeric($value)) {
      throw new Exception("Path id must be numeric!");
    }
    if(!is_integer($value)) {
      throw new Exception("Path id must be integer!");
    }
    if($value < 1) {
      throw new Exception("Path id cannot be smaller than one (1)!");
    }
    $this->id = $value;
  }

  public function setFirstPointTime($value) {
    if($value instanceof DateTime) {
      $this->firstPointTime = $value;
    } else if(is_string($value)) {
      $this->firstPointTime = new DateTime($value);
    } else {
      throw new Exception("Expected DateTime object or string!");
    }
  }

  public function setLastPointTime($value) {
    if($value instanceof DateTime) {
      $this->lastPointTime = $value;
    } else if(is_string($value)) {
      $this->lastPointTime = new DateTime($value);
    } else {
      throw new Exception("Expected DateTime object or string!");
    }
  }

  public function setPointCount($value) {
    if(!is_numeric($value)) {
      throw new Exception("Point count must be numeric!");
    }
    if(!is_integer($value)) {
      throw new Exception("Point count must be integer!");
    }
    if($value < 0) {
      throw new Exception("Point count cannot be less than zero!");
    }
    $this->pointCount = $value;
  }

  public function flatten() {
    return array(
      'path_id' => $this->getId(),
      'point_count' => $this->getPointCount(),
      'first_point_time' => $this->getFirstPointTimeFormatted(),
      'last_point_time' => $this->getLastPointTimeFormatted()
    );
  }

  /**
   * Creates a new PathInfo-object from an array.
   * 
   * The array contains following info:
   * <code>
   * $data = array(
   *   // When the first point was recorded. 
   *   // String format: YYYY-MM-DD HH:MM:SS
   *   "first_point_time" => DateTime or String,
   * 
   *   // When the first point was recorded. 
   *   // String format: YYYY-MM-DD HH:MM:SS
   *   "last_point_time" => DateTime or String,
   * 
   *   // How many points are in this path.
   *   "point_count" => Integer,
   * 
   *   // Unique path ID.
   *   "path_id" => Integer
   * );
   * </code>
   */
  public static function create($data) {
    $pi = new PathInfo();
    $pi->setFirstPointTime($data['first_point_time']);
    $pi->setLastPointTime($data['last_point_time']);
    $pi->setPointCount(intval($data['point_count']));
    $pi->setId(intval($data['path_id']));
    return $pi;
  }
}
