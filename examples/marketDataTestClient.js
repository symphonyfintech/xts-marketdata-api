//Accessing the XtsMarketDataAPI and XtsMarketDataWS from xts-marketdata-api library

var XtsMarketDataAPI = require('xts-marketdata-api').xtsMarketDataAPI;
var XtsMarketDataWS = require('xts-marketdata-api').WS;

var config = require('./config/config.json');

let userID = config.userID;
let password = config.password;
let publicKey = config.publicKey;
let source = config.source;
let publishFormat = config.publishFormat;
let broadcastMode = config.broadcastMode;
let url = config.url;


//xtsInteractive for API calls and xtsMarketDataWS for events related functionality
var xtsMarketDataAPI = null;
var xtsMarketDataWS = null;

(async () => {

    //creating the instance of XTSRest
    xtsMarketDataAPI = new XtsMarketDataAPI(url);

    //calling the logIn API
    var loginRequest = {
        userID,
        password,
        publicKey,
        source
    }

    let logIn = await xtsMarketDataAPI.logIn(loginRequest);

    // checking for valid loginRequest
    if (logIn && logIn.type == xtsMarketDataAPI.responseTypes.success) {

        //creating the instance of xtsMarketDataWS
        xtsMarketDataWS = new XtsMarketDataWS(url);

        //Instantiating the socket instance
        var socketInitRequest = {
            userID,
            publishFormat,
            broadcastMode,
            token: logIn.result.token   // Token Generated after successful LogIn
        }
        xtsMarketDataWS.init(socketInitRequest);

        //Registering the socket Events
        await registerEvents();

        //calling the remaining methods of the Interactive API
        testAPI();

    } else {
        //In case of failure
        console.error(logIn);
    }
})();





async function testAPI() {

    let clientConfigRequest = {
        source: source,
        userID: userID
    }

    await clientConfig(clientConfigRequest);

    let searchInstrumentRequest = {
        searchString: "REL",
        source: source,
        userID: userID
    }

    await searchInstrument(searchInstrumentRequest);

    let searchInstrumentByIdRequest = {
        source: source,
        userID: userID,
        instruments: [
            { exchangeSegment: xtsMarketDataAPI.exchangeSegments.NSECM, exchangeInstrumentID: "3045" }
        ]
    }

    await searchInstrumentById(searchInstrumentByIdRequest);

    let getQuotesRequest = {
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
        publishFormat: "JSON"
    }

    await getQuotes(getQuotesRequest);

    let subscriptionRequest = {
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
    }

    await subscription(subscriptionRequest);


    let unSubscriptionRequest = {
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
        marketDataPort: xtsMarketDataAPI.marketDataPorts.marketDepthEvent
    }

     await unSubscription(unSubscriptionRequest);

     await logOut();

}

var subscription = async function (subscriptionRequest) {

    let response = await xtsMarketDataAPI.subscription(subscriptionRequest);
    console.log(response);
    return response;

}

var unSubscription = async function (unSubscriptionRequest) {

    let response = await xtsMarketDataAPI.unSubscription(unSubscriptionRequest);
    console.log(response);
    return response;

}

var getQuotes = async function (getQuotesRequest) {

    let response = await xtsMarketDataAPI.getQuotes(getQuotesRequest);
    console.log(response);
    return response;

}

var searchInstrumentById = async function (searchInstrumentByIdRequest) {

    let response = await xtsMarketDataAPI.searchInstrumentById(searchInstrumentByIdRequest);
    console.log(response);
    return response;

}

var searchInstrument = async function (searchInstrumentRequest) {

    let response = await xtsMarketDataAPI.searchInstrument(searchInstrumentRequest);
    console.log(response);
    return response;

}

var clientConfig = async function (clientConfigRequest) {

    let response = await xtsMarketDataAPI.clientConfig(clientConfigRequest);
    console.log(response);
    return response;

}

var logOut = async function () {

    let response = await xtsMarketDataAPI.logOut();
    console.log(response);
    return response;

}


var registerEvents = async function () {


    //instantiating the listeners for all event related data

    //"connect" event listener
    xtsMarketDataWS.onConnect((connectData) => {

        console.log(connectData);

    });

    //"joined" event listener
    xtsMarketDataWS.onJoined((joinedData) => {

        console.log(joinedData);

    });

    //"error" event listener
    xtsMarketDataWS.onError((errorData) => {

        console.log(errorData);

    });

    //"disconnect" event listener
    xtsMarketDataWS.onDisconnect((disconnectData) => {

        console.log(disconnectData);

    });

    //"marketDepthEvent" event listener
    xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {

        console.log(marketDepthData);

    });

    //"openInterestEvent" event listener
    xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {

        console.log(openInterestData);

    });

    //"indexDataEvent" event listener
    xtsMarketDataWS.onIndexDataEvent((indexData) => {

        console.log(indexData);

    });

    //"marketDepth100Event" event listener
    xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {

        console.log(marketDepth100Data);

    });

    //"candleDataEvent" event listener
    xtsMarketDataWS.onCandleDataEvent((candleData) => {

        console.log(candleData);

    });

    // //"logout" event listener
    xtsMarketDataWS.onLogout((logoutData) => {

        console.log(logoutData);

    });
}