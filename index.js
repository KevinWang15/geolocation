const express = require('express');
const Reader = require('@maxmind/geoip2-node').Reader;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors())

const port = 7520;

// Path to the MaxMind database file
const dbPath = path.join(__dirname, 'GeoLite2-City.mmdb');

// Create a reader instance
let reader;
Reader.open(dbPath).then((r) => {
    reader = r;
    console.log('MaxMind database loaded successfully');
}).catch((error) => {
    console.error('Error loading MaxMind database:', error);
    process.exit(1);
});


app.get('/', (req, res) => {
    let ipv6 = undefined;
    let ip = req.socket.remoteAddress;

    // Handle IPv4-mapped IPv6 addresses
    if (ip.indexOf("::") >= 0) {
        ipv6 = ip;
    }
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
    }

    try {
        const geoData = reader.city(ip);

        const responseData = {
            ip: ip,
            ipv6,
            city: geoData.city?.names?.en || null,
            region: geoData.subdivisions?.[0]?.names?.en || null,
            country: geoData.country?.names?.en || null,
            latitude: geoData.location?.latitude || null,
            longitude: geoData.location?.longitude || null
        };

        // Check if all values are non-null
        const allDataPresent = Object.values(responseData).every(value => value !== null);

        if (allDataPresent) {
            res.json({
                success: true,
                data: responseData
            });
        } else {
            res.status(206).json({
                error: 'Incomplete geolocation data',
                data: responseData
            });
        }
    } catch (error) {
        console.error('Error processing geolocation:', error);

        res.status(500).json({
            error: 'Unable to process geolocation: ' + error.toString(),
            data: {ip, ipv6}
        });
    }
});

app.listen(port, () => {
    console.log(`Geolocation service listening at :${port}`);
});
