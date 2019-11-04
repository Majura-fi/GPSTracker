# GPSTracker Api

All responses will be in JSON-form.

## POST path/latest/add

Stores a new GPS-location. If earlier location is missing or over an hour old, the location will be treated as a beginning of a new path.

Data is taken as multipart/form-data:

```
// Required.
latitude: float
longitude: float

// Optional.
// Default value: 0
speed: float
altitude: float
accuracy: float

// Optional.
// Default: Current timestamp.
// Format: yyyy-mm-dd hh:mm:ss
time: string
```

If everything went well, the response will be:

```json
{
  "status": "ok",
  "content": []
}
```

If there were errors, the response status will change and the content field will hold an error message.

```json
{
  "status": "error",
  "content": ["Missing latitude."]
}
```

## GET path/latest/islive

Checks if latest path is still considered as live. When the last recorded point becomes over an hour old, the path is then considered as not live.

When the last path is live:

```json
{
  "status": "ok",
  "content": {
    "islive": true,
    "path_id": 1
  }
}
```

When the last path is not live:

```json
{
  "status": "ok",
  "content": {
    "islive": false
  }
}
```

## GET path/@id/meta

Returns meta information for the path that has given id.

```json
{
  "status": "ok",
  "content": {
    "path_id": 1,
    "point_count": 4,
    "first_point_time": "2019-11-04T12:13:00Z",
    "last_point_time": "2019-11-04T14:56:00Z"
  }
}
```

## GET path/@id

Returns full path information, including recorded locations.

```json
{
  "status": "ok",
  "content": {
    "info": {
      "path_id": 1,
      "point_count": 4,
      "first_point_time": "2019-11-04T12:13:00Z",
      "last_point_time": "2019-11-04T14:56:00Z"
    },
    "points": [
      {
        "latitude": "61.4991",
        "longitude": "23.7871",
        "time": "2019-11-04T12:13:00Z",
        "speed": "1.2",
        "altitude": "0",
        "accuracy": "1"
      },
      ...{
        "latitude": "61.5012",
        "longitude": "23.8053",
        "time": "2019-11-04T14:56:00Z",
        "speed": "1",
        "altitude": "2",
        "accuracy": "3"
      }
    ]
  }
}
```

## GET paths

Returns every path's meta information.

```json
{
  "status": "ok",
  "content": [
    {
      "path_id": 1,
      "point_count": 4,
      "first_point_time": "2019-11-04T12:13:00Z",
      "last_point_time": "2019-11-04T14:56:00Z"
    },
    ...{
      "path_id": 4,
      "point_count": 43,
      "first_point_time": "2019-11-04T20:13:00Z",
      "last_point_time": "2019-11-04T21:56:00Z"
    }
  ]
}
```
