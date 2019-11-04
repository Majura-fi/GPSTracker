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

```
{
  "status": "ok",
  "content": {
    "islive": true,
    "path_id": Integer
  }
}
```

When the last path is not live:

```
{
  "status": "ok",
  "content": {
    "islive": false
  }
}
```

## GET path/@id/meta

Returns meta information for the path that has given id.

```
{
  "status": "ok",
  "content": {
    "path_id": Integer,
    "point_count": Integer,

    // Format: YYYY-MM-DDTHH:MM:SSZ
    "first_point_time": String,
    "last_point_time": String
  }
}
```

## GET path/@id

Returns full path information, including recorded locations.

```
{
  "status": "ok",
  "content": {
    "info": {
      "path_id": Integer,
      "point_count": Integer,

      // Format: YYYY-MM-DDTHH:MM:SSZ
      "first_point_time": String,
      "last_point_time": String
    },
    "points": [
      {
        "latitude": Float,
        "longitude": Float,

        // Format: YYYY-MM-DDTHH:MM:SSZ
        "time": String,

        "speed": Float,
        "altitude": Float,
        "accuracy": Float
      },
      ...
      {
        "latitude": Float,
        "longitude": Float,

        // Format: YYYY-MM-DDTHH:MM:SSZ
        "time": String,

        "speed": Float,
        "altitude": Float,
        "accuracy": Float
      }
    ]
  }
}
```

## GET paths

Returns every path's meta information.

```
{
  "status": "ok",
  "content": [
    {
      "path_id": Integer,
      "point_count": Integer,

      // Format: YYYY-MM-DDTHH:MM:SSZ
      "first_point_time": String,
      "last_point_time": String
    },
    ...{
      "path_id": Integer,
      "point_count": Integer,

      // Format: YYYY-MM-DDTHH:MM:SSZ
      "first_point_time": String,
      "last_point_time": String
    }
  ]
}
```
