<?php

require_once "coordinates.php";

class MapPoint {
  private $coordinates;
  private $time;
  private $speed;
  private $altitude;
  private $accuracy;

  function __construct() {
    $this->coordinates = new Coordinates();
    $this->speed = 0;
    $this->altitude = 0;
    $this->accuracy = 0;
    $this->time = new DateTime(gmdate("Y-m-d\TH:i:s\Z"));
  }

  public function setLatitude($value) {
    $this->coordinates->setLatitude($value);
  }

  public function setLongitude($value) {
    $this->coordinates->setLongitude($value);
  }

  public function setAltitude($value) {
    if(!is_numeric($value)) {
      throw new Exception("Altitude is not numeric!");
    }
    $this->altitude = $value;
  }

  public function setTime($value) {
    if($value instanceof DateTime) {
      $this->time = $value;
    } else if(is_string($value)) {
      $this->time = new Datetime($value);
    } else {
      throw new Exception("Expected DateTime object or string!");
    }
  }

  public function setSpeed($value) {
    if(!is_numeric($value)) {
      throw new Exception("Speed is not numeric!");
    }
    if($value < 0) {
      throw new Exception("Speed cannot be negative value!");
    }
    $this->speed = $value;
  }

  public function setAccuracy($value) {
    if(!is_numeric($value)) {
      throw new Exception("Accuracy is not numeric!");
    }
    if($value < 0) {
      throw new Exception("Accuracy cannot be negative value!");
    }
    $this->accuracy = $value;
  }

  public function getLatitude() {
    return $this->coordinates->getLatitude();
  }

  public function getLongitude() {
    return $this->coordinates->getLongitude();
  }

  public function getSpeed() {
    return $this->speed;
  }

  public function getAltitude() {
    return $this->altitude;
  }

  public function getAccuracy() {
    return $this->accuracy;
  }

  public function getTimeFormatted($format="Y-m-d\TH:i:s\Z") {
    return $this->time->format($format);
  }

  public function getTime() {
    return $this->time;
  }

  public function isOlderThan($value) {
    if($value instanceof DateTime) {
      return $this->time < $value;
    } else if(is_string($value)) {
      $tmp = new DateTime($value);
      return $this->time < $tmp;
    } else if($value instanceof MapPoint) {
      return $this->time < $value->getTime();
    } else {
      throw new Exception("Expected DateTime object or string!");
    }
  }

  public function flatten() {
    return array(
      'latitude' => $this->getLatitude(),
      'longitude' => $this->getLongitude(),
      'time' => $this->getTimeFormatted(),
      'speed' => $this->getSpeed(),
      'altitude' => $this->getAltitude(),
      'accuracy' => $this->getAccuracy()
    );
  }

  /**
   * Creates a new MapPoint-object from an array.
   * 
   * The array contains following info:
   * <code>
   * $data = array(
   *    // Required.
   *    "latitude" => Float, 
   * 
   *    // Required.
   *    "longitude" => Float,
   * 
   *    // Optional.
   *    // String format: YYYY-MM-DD HH:MM:SS
   *    // Default value: Current time.
   *    "time" => DateTime or String,
   * 
   *    // Optional.
   *    // Default value: 0
   *    "speed" => Float,
   * 
   *    // Optional.
   *    // Default value: 0
   *    "altitude" => Float,
   * 
   *    // Optional.
   *    // Default value: 0
   *    "accuracy" => Float
   * )
   * </code>
   */
  public static function create($data) {
    if(!isset($data['latitude'])) {
      throw new Exception("Latitude is missing!");
    }
    if(!isset($data['longitude'])) {
      throw new Exception("Longitude is missing!");
    }

    $point = new MapPoint();
    $point->setLatitude($data['latitude']);
    $point->setLongitude($data['longitude']);

    if(isset($data['time'])) {
      $point->setTime($data['time']);
    }
    if(isset($data['speed'])) {
      $point->setSpeed($data['speed']);
    }
    if(isset($data['altitude'])) {
      $point->setAltitude($data['altitude']);
    }
    if(isset($data['accuracy'])) {
      $point->setAccuracy($data['accuracy']);
    }

    return $point;
  }
}
