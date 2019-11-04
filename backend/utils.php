<?php

function randCoord($min, $max) {
  return rand($min*10000, $max*10000)/10000;
}

function utf8ize($array) {
    if (is_array($array)) {
        foreach ($array as $k => $v) {
            $array[$k] = utf8ize($v);
        }
    } else if (is_string ($array)) {
        return utf8_encode($array);
    }
    return $array;
}

function success($content = null) {
  $res = array('status' => 'ok');
  if(empty($content)) {
    $res['content'] = array();
  } else {
    $res['content'] = $content;
  }
  return utf8ize($res);
}

function failure($reason = null) {
  $res = array('status' => 'error');
  if($reason) {
    $res['reason'] = $reason;
  } else {
    $res['reason'] = 'No error message given.';
  }
  return utf8ize($res);
}

function valueOrDefault($array, $index, $default) {
  if(array_key_exists($index, $array)) {
    return $array[$index];
  }
  return $default;
}

function valueOrError($array, $index, $msg) {
  if(array_key_exists($index, $array)) {
    return $array[$index];
  }
  throw new Exception($msg);
}

function numberOrDefault($value, $default) {
  if(is_numeric($value)) {
    return $value;
  }
  return $default;
}
