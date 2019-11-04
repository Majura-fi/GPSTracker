# GPSTracker

Collects user submitted GPS-locations and displays them as a path on a webpage in almost real time.

Users can browse recorded paths and explore GPS-point information on each path. Paths are separated into new paths when there is more than one hour delay since the last point.

## Notice

- The Google Maps api key goes to frontend/index.html @ line 11.

- The project supports only one user when recording GPS-locations. Even though multiple users can record at the same time, the data is not separated by users and will be drawn as a single path. There are no restrictions on how many can explore stored paths.

- This project is no longer under development as there is a new version under construction.
