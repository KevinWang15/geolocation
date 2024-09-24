# Geolocation Service

This is a simple, self-hosted geolocation service built with Node.js and Express. It uses the MaxMind GeoLite2 database to provide geolocation data for IP addresses.

## Features

- Lightweight Express server
- IP geolocation using MaxMind's GeoLite2 database
- Returns city, region, country, latitude, and longitude for a given IP

## Usage

1. Start the service:

   ```
   node geolocation-service.js
   ```

2. The service will be available at `http://localhost:7520`

3. To get geolocation data, simply send a GET request to the root URL. The service will use the IP address of the incoming request.

## API Response

The service returns a JSON object with the following structure:

```json
{
  "ip": "123.45.67.89",
  "city": "Shanghai",
  "region": "Shanghai",
  "country": "China",
  "latitude": 31.2222,
  "longitude": 121.4581
}
```

If there's an error processing the geolocation, it will return:

```json
{
  "ip": "123.45.67.89",
  "error": "Unable to process geolocation: [error details]"
}
```

## Running with docker

```
docker run --name geolocation -p 7520:7520 ghcr.io/kevinwang15/geolocation:main
```
