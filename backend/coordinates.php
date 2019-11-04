<?php

class Coordinates {
  private $latitude;
  private $longitude;

  function __construct($lat=0, $lng=0) {
    $this->setLatitude($lat);
    $this->setLongitude($lng);
  }

  public function getLongitude() {
    return $this->longitude;
  }

  public function getLatitude() {
    return $this->latitude;
  }

  public function setLongitude($value) {
    if(!is_numeric($value)) {
      throw new Exception("Longitude must be numeric!");
    }
    if($value < -180) {
      throw new Exception("Longitude cannot be less than zero!");
    }
    if($value > 180) {
      throw new Exception("Longitude cannot be more than 180!");
    }
    $this->longitude = $value;
  }

  public function setLatitude($value) {
    if(!is_numeric($value)) {
      throw new Exception("Latitude must be numeric!");
    }
    if($value < -90) {
      throw new Exception("Latitude cannot be less than zero!");
    }
    if($value > 90) {
      throw new Exception("Latitude cannot be more than 180!");
    }
    $this->latitude = $value;
  }

  public function flatten() {
    return array(
      'latitude' => $this->getLatitude(),
      'longitude' => $this->getLongitude()
    );
  }
}
