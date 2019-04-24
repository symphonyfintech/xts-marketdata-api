# XTS-MarketData-API
Welcome to the XTS-MarketData-API SDK, This repository is Official Node.js library for Symphony XTS-MarketData-API.  

API Documentation for XTS-MarketData API can be found in the below link.

https://symphonyfintech.com/xts-market-data-front-end-api/

The XTS market data API provides developer, data-scientist, financial analyst and investor the market data with very low latency. 
It provides market data from various Indian electronic exchanges. 

With the use of the socket.io library, the API has streaming capability and will push data notifications in a JSON format.

There is also an examples folder available which illustrates how to create a connection to XTS marketdata component in order to subscribe to real-time events.
Please request for apikeys with Symphony Fintech developer support team to start integrating your application with XTS OEMS.

## Installation 
```bash
npm install xts-marketdata-api
```

## Usage

Access the interactive component of xts-marketdata-api like below. 
```js
var XtsMarketDataAPI  = require('xts-marketdata-api').XtsMarketDataAPI;
```

Creating the instance of xtsMarketDataAPI 

```js
xtsMarketDataAPI  = new XtsMarketDataAPI(“https://api.symphonyfintech.com”);   
```

call the login API to generate the token

```js

var loginRequest ={
	"userID": "PAVAN",
	"password": "Abcd@123",
	"publicKey": "5a75a3616cabe678",
	"source": "WEBAPI",
}

let logIn = await xtsMarketDataAPI.logIn(loginRequest);
```

Once the token is generated you can call any api provided in the documentation. All API’s are easy  to integrate and implemented with async-await mechanism.
Below is the sample Code snippet which calls the client config API.

```js
 let clientConfigRequest = {
        source: source,
        userID: userID
    }
let response = await xtsMarketDataAPI.clientConfig(clientConfigRequest);

console.log(response);

```
## Instantiating the XtsMarketDataWS 

This component provides functionality to access the socket related events. All real-time events can be registered via XtsMarketDataWS .
After token is generated, you can access the socket component and instantiate the socket Instance and call the init method of the socket like below

```js
var XtsMarketDataWS = require('xts-marketdata-api').WS;
xtsMarketDataWS  = new XtsMarketDataWS(“https://api.symphonyfintech.com”);
var socketInitRequest = {
	userID: “PAVAN”,
	token: logIn.result.token,   // Token Generated after successful LogIn
	publishFormat: "JSON",
	broadcastMode: "Full"
}
xtsMarketDataWS.init(socketInitRequest);
```

You can now register events to listen to the real time market data events and will be receiving the json objects in the response.

```js
xtsMarketDataWS.onConnect((connectData) => {
	console.log(connectData);
});
xtsMarketDataWS.onJoined((joinedData) => {
	console.log(joinedData);    
});
xtsMarketDataWS.onError((errorData) => {
	console.log(errorData); 
});
xtsMarketDataWS.onDisconnect((disconnectData) => {   
	console.log(disconnectData);
});
xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
	console.log(marketDepthData);
});
xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {
	console.log(openInterestData);
});
xtsMarketDataWS.onIndexDataEvent((indexData) => {
    console.log(indexData);
});
xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {
    console.log(marketDepth100Data);
});
xtsMarketDataWS.onCandleDataEvent((candleData) => {
    console.log(candleData);
});
xtsMarketDataWS.onLogout((logoutData) => {
    console.log(logoutData);
});
```

## Detailed explanation of API and socket related events

Below is the brief information related to api’s  provided by XTS-marketdata-API SDK.

## instruments API

## subscription

Calls POST /instruments/subscription.

```js
let response = await xtsMarketDataAPI.subscription(let subscriptionRequest = {
        userID: userID,
        clientID: userID,
        source: source,
        instruments: [
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 22
            },
            {
                exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
                exchangeInstrumentID: 11536
            }
        ],
        marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
    });
```

## unSubscription 

Calls PUT /instruments/subscription.

```js
let response = await xtsMarketDataAPI.unSubscription({
	userID: userID,
	clientID: userID,
	source: source,
	instruments : [
		{
		  exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
		  exchangeInstrumentID: 2885
		},
		{
		  exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
		  exchangeInstrumentID: 11536
		}
	],
	marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
});
```
## quotes

Calls POST /instruments/quotes.

```js
let response = await xtsMarketDataAPI.getQuotes({
	userID: userID,
	clientID: userID,
	source: source,
	instruments: [
		{
			exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
			exchangeInstrumentID: 2885
		},
		{
			exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM,
			exchangeInstrumentID: 11536
		}
	],
	marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent,
	publishFormat: xtsMarketDataAPI.publishFormat.JSON
});
```
## clientConfig

Calls POST /config/clientConfig.

```js
let response = await xtsMarketDataAPI.clientConfig({
        source: source,
        userID: userID
    });
```
## search API

## searchInstrumentsById 

Calls POST /search/instrumentsbyid.

```js
let response = await xtsMarketDataAPI.searchInstrumentsById({
        source: source,
        userID: userID,
        instruments: [
            { exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM, exchangeInstrumentID: "3045" }
        ]
    }
});
```

## searchInstruments 

Calls POST /search/instruments.

```js
let response = await xtsMarketDataAPI.searchInstrument({
        searchString: "REL",
        source: source,
        userID: userID
});
```

Below is the brief information related to  streaming events provided by XTS-Interactive-API SDK.

```js
xtsMarketDataWS.init(socketInitRequest); // Init the socket instance
xtsMarketDataWS.onConnect((connectData) => {}); //"connect" event listener
xtsMarketDataWS.onJoined((joinedData) => {});//"joined" event listener
xtsMarketDataWS.onError((errorData) => {});//"error" event listener
xtsMarketDataWS.onDisconnect((disconnectData) => {});//"disconnect" event listener
xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {});//"marketDepthEvent" event listener
xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {});//"openInterestEvent" event listener
xtsMarketDataWS.onIndexDataEvent((indexData) => {});//"indexDataEvent" event listener
xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {});//"marketDepth100Event" event listener
xtsMarketDataWS.onCandleDataEvent((candleData) => {});//"candleDataEvent" event listener
xtsMarketDataWS.onLogout((logoutData) => {});//"logout" event listener
```
We do have a trading API component which will provide the trading capability of our application.  For more info please check the following link.

https://symphonyfintech.com/xts-trading-front-end-api/
