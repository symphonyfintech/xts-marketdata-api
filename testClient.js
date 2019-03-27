var request = require("request");
var socketIoClient = require("socket.io-client");

module.exports.init = function () {
	
    let userID="AJITKUMAR1";
    let password="Xts@1234";
    let publicKey="e730208fd7b25571";
   // let url="http://192.168.55.35:3001";
   let url="http://103.69.169.10:10826";
    var data = {
		"source":"WEB",
        "userID": userID,
        "password": password,
        "publicKey": publicKey
    };
    request.post({
        url: url+"/marketdata/auth/login",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
        body: data
    }, function (err, res, body) {
	//	console.log("err is"+err+" res is "+JSON.stringify(res));
	//	console.og(body);
        if (body.result.token) {
			 console.log(body.result.token);
            if (body.result.token) {
                var token = body.result.token;
                var socket = socketIoClient(url, {path: "/marketdata/socket.io", query: {token: token, userID: userID,publishFormat: "JSON",
                    broadcastMode: "Full"}});
                socket.on('connect', function () {
                    console.log("socket connected successfully");
                    var subscribeInstrument = {
                        "userID":userID,
                        "clientID":"AJITKUMAR",
                        "source":"WEB",
                        "instruments": [{
                            "exchangeSegment": 1,
                            "exchangeInstrumentID": 22
                        }, {
                            "exchangeSegment": 1,
                            "exchangeInstrumentID": 2885
                        }],
                        "marketDataPort": 1505
						
                    }
                    request.post({
                        url: url+"/marketdata/instruments/subscription",
                        json: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': subscribeInstrument.length,
							'authorization':token
                        },
                        body: subscribeInstrument
                    }, function (err, res, body) {
						console.log("instrument subscription is"+JSON.stringify(body));
                    });
                 });
                socket.on('event', function (data) {console.log("some event"); });
                
                socket.on("1501-json-full",function(data){
                  console.log("1501 data is "+data);
                });
				 socket.on("1502-json-full",function(data){
                  console.log("data is "+data);
                });
				 socket.on("1503-json-partial",function(data){
                  console.log("data is "+data);
                });
				// socket.on("1504-json-full",function(data){
                //  console.log("1504 data is of Index "+data);
               // });
				socket.on("1510-json-partial",function(data){
                  console.log("1510 data is "+data);
                });
				
				socket.on('disconnect', function () { console.log("Disconnected");});
                socket.on("1502-json-partial",function(data){
                    console.log("1502-json-partial data is "+data);
                });
				//candle Data Event message for binary full and json both (full and partial)
                socket.on("1505-json-partial",function(data){
                    console.log("data is "+data);
                });
                //candle Data Event message for binary full and json both (full and partial)
                socket.on("1505-json-full",function(data){
                    console.log("data is "+data);
                });
                //candle Data Event message for binary full and json both (full and partial)
                socket.on("1505-binary-full",function(data){
				console.log("data is "+data);});
            }
        }
    });
}

module.exports.init();