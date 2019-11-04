<?php
require_once 'vendor/autoload.php';
require_once 'MyGPSApi.php';
require_once 'utils.php';


Flight::set('api', new MyGPSApi());
Flight::set('flight.log_errors', true);

Flight::before('json', function () {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE');
    header('Access-Control-Allow-Headers: Content-Type');
});

Flight::map('error', function($ex) {
  $str = array();
  $str[] = $ex->getMessage();
  $str[] = $ex->getCode();

  while(($ex = $ex->getPrevious()) != null) {
    $str[] = '-- ' . $ex->getCode();
  }

  $str = implode("\n", $str);

  Flight::json(failure($str));
});

Flight::route('/', function() {
  print('Hello. This is the API. :)');
});

Flight::route('GET /paths', function() {
  $api = Flight::get('api');
  Flight::json($api->getPaths());
});

Flight::route('GET /path/@id', function($id) {
  $api = Flight::get('api');
  $query = Flight::request()->query;
  Flight::json($api->getPath($id, $query));
});

Flight::route('POST /path/latest/add', function() {
  $api = Flight::get('api');
  $data = Flight::request()->data;
  Flight::json($api->addPointToLatestPath($data));
});

Flight::route('GET /path/latest/add', function() {
  print('This is POST-only.');
});

Flight::route('GET /path/@id/meta', function ($id) {
  $api = Flight::get('api');
  Flight::json($api->getPathMeta($id));
});

Flight::route('GET /path/latest/islive', function() {
  $api = Flight::get('api');
  Flight::json($api->isLive());
});

Flight::start();
