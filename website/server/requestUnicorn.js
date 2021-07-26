
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const awssem = require('aws-serverless-express/middleware');
const randomBytes = require('crypto').randomBytes;


const region = process.env.MOBILE_HUB_PROJECT_REGION || process.env.REGION || 'us-east-1';
AWS.config.update({ region: region })
let databaseTableName = 'Rides';
if (process.env.MOBILE_HUB_DYNAMIC_PREFIX) {
    databaseTableName = process.env.MOBILE_HUB_DYNAMIC_PREFIX + '-Rides';
}


const fleet = [
  { Name: 'Bucephalus', Color: 'Golden', Gender: 'Male' },
  { Name: 'Shadowfax', Color: 'White', Gender: 'Male' },
  { Name: 'Rocinante', Color: 'Yellow', Gender: 'Female'}
];


var app = express()
app.use(awssem.eventContext({ deleteHeaders: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


const ddb = new AWS.DynamoDB.DocumentClient();

app.post('/ride', function(req, res) {
  const requestContext = req.apiGateway.event.requestContext;

  const rideId = randomBytes(16)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const username = requestContext.identity.cognitoIdentityId;
  const pickupLocation = req.body.PickupLocation;


  const unicorn = fleet[Math.floor(Math.random() * fleet.length)];

  
  const ddbItem = {
    RideId: rideId,
    User: username,
    Unicorn: unicorn,
    UnicornName: unicorn.Name,
    RequestTime: new Date().toISOString(),
    PickupLocation: pickupLocation
  };

  console.log(`Inserting data into ${region}:${databaseTableName}`);
  ddb.put({ TableName: databaseTableName, Item: ddbItem },
    function (err, data) {
      if (err) {
        console.log('error: ', err);
        res.status(500).json({
          Error: err.message,
          Reference: req.requestId
        });
      } else {
        console.log('success: ', data);
        res.status(201).json({
          RideId: rideId,
          Unicorn: unicorn,
          UnicornName: unicorn.Name,
          Eta: 30,
          Rider: username
        });
      }
    }
  );
});


app.listen(3000, function() {
    console.log("App started")
});


module.exports = app
