var config = require('./config/app/config.json');
var settings = require('./config/app/settings.json');
var CustomError = require('./customError');
var config = require('./config/app/config.json');
var request = require('./request');
var logger = require('./logger');
var inMemoryStore = require('./inMemoryStore');

module.exports = class MDRestAPI {



    /**
     * Constructs an MDRestAPI instance to enable data transfer via restful API's.
     *  
     * @constructor
     *
     * @param {String} url
     *   url parameter is used to connect to the particular server.
     * 
     */
    constructor(url) {
        this.url = url == "undefined" ? config.url+"/marketData" : url+"/marketData";
        this.responseTypes = { success: "success", failure: "failure" };
        this.isLoggedIn = false;
        logger.init();
    }

    /**
     * set the token value by providing the token in the input
     *
     * @param {string} token
     *  token parameter will be generated after successful login and will be used in other private API's
     *
     */
    set token(token) {
        this._token = token;
    }

    /**
     * Returns the token generated after successful logIn
     *
     *
     * @return
     *   the value of token generated after successful logIn
     */
    get token() {
        return this._token;
    }

    /**
     * set the userID value by providing the userID in the input
     *
     * @param {string} userID
     *  userID for the particular user
     */
    set userID(userID) {
        this._userID = userID;
    }

    /**
     * Returns userID for the particular user
     *
     *
     * @return
     *   the userID for the particular user
     */
    get userID() {
        return this._userID;
    }

    /**
     * set the source value by providing the source in the input
     *
     * @param {string} source
     *  source used by the particular user
     */
    set source(source) {
        this._source = source;
    }

    /**
     * Returns source used by the particular user
     *
     *
     * @return
     *   the source used by the particular user
     */
    get source() {
        return this._source;
    }

    /**
     * set the url value by providing the url in the input
     *
     * @param {string} url
     *  url parameter is used to connect to the particular server.
     */
    set url(url) {
        this._url = url;
    }

    /**
     * Returns url used to connect to the particular server.
     *
     *
     * @return
     *   the url used to connect to the particular server.
     */
    get url() {
        return this._url;
    }

    /**
     * set the enums value obtained after successful LogIn.
     *
     * @param {Object} enums
     *  sets the enums value obtained after successful LogIn.
     */
    set enums(enums) {
        this._enums = enums;
    }

    /**
     * Returns enums value obtained after successful LogIn.
     *
     * @return
     *   enums value obtained after successful LogIn.
     */
    get enums() {
        return this._enums;
    }

    /**
     * LogIn API of the application provides functionality of logIn into the application
     *
     *  @param {Object} reqObject request object.
     * 
     * @param {string} reqObject.userID
     *  userID of the particular user.
     * 
     * @param {string} reqObject.password
     *  password of the particular user.
     * 
     * @param {string} reqObject.publicKey
     *  publicKey of the particular user.
     * 
     * @param {string} reqObject.source
     *  source used by the particular user.
     * 
     */

    async logIn(reqObject) {
        try {
            var response = await request.processRequest("POST", this.url + settings.restApi.login, {}, reqObject);
            this.isLoggedIn = true;
            this.userID = reqObject.userID;
            this.source = reqObject.source;
            this.token = response.result.token;
            return response;
        } catch (error) {
            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;
        }
    }

    /**
     * Logout API of the application provides functionality of logOut from the application
     * 
     */
    async logOut() {

        try {
            await this.checkLoggedIn();
            let response = await request.processRequest("POST", this.url + settings.restApi.logout, { 'authorization': this.token }, { userID: this.userID, source: this.source });
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    /**
     * subscription API of the application provides functionality of subscribing the instruments into the subscriptionList. 
     * 
     * @param {Object} reqObject request object.
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     *  @param {string} reqObject.clientID
     *  clientID of the user
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     * @param {Array} reqObject.instruments
     * Combination of JSONObjects of exchangeSegment and exchangeInstrumentID
     * 
     * @param {number} reqObject.marketDataPort
     *  marketDataPort required for the user
     * 
     */
    async subscription(reqObject) {

        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("POST", this.url + settings.restApi.subscription, { 'authorization': this.token }, reqObject);
            for(let listQuote of response.result.listQuotes){
                let marketData= JSON.parse(listQuote);
                 await inMemoryStore.loadInMemory(marketData.MessageCode, marketData.ExchangeSegment, marketData.ExchangeInstrumentID, marketData);
            }
            return response;
           
        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    /**
     * unsubscription API of the application provides functionality of unsubscribing the instruments from subscriptionList. 
     * 
     * @param {Object} reqObject request object.
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     *  @param {string} reqObject.clientID
     *  clientID of the user
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     * @param {Array} reqObject.instruments
     * Combination of JSONObjects of exchangeSegment and exchangeInstrumentID
     * 
     * @param {number} reqObject.marketDataPort
     *  marketDataPort required for the user
     * 
     */
    async unSubscription(reqObject) {

        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("PUT", this.url + settings.restApi.subscription, { 'authorization': this.token }, reqObject);
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    /**
     * getQuotes API of the application provides functionality of fetching the quote information. 
     * 
     * @param {Object} reqObject request object.
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     *  @param {string} reqObject.clientID
     *  clientID of the user
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     * @param {Array} reqObject.instruments
     * Combination of JSONObjects of exchangeSegment and exchangeInstrumentID
     * 
     * @param {number} reqObject.marketDataPort
     *  marketDataPort required for the user
     * 
     * @param {string} reqObject.publishFormat
     *  publishFormat required for the user
     * 
     * 
     */
    async getQuotes(reqObject) {

        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("POST", this.url + settings.restApi.quotes, { 'authorization': this.token }, reqObject);
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }

    }

    /**
     * searchInstrumentById API of the application provides functionality of searching instruments with the instrumentID
     * 
     * @param {Object} reqObject request object.
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     * @param {Array} reqObject.instruments
     * Combination of JSONObjects of exchangeSegment and exchangeInstrumentID
     * 
     */
    async searchInstrumentById(reqObject) {

        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("POST", this.url + settings.restApi.searchInstrumentsById, { 'authorization': this.token }, reqObject);
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    /**
     * searchInstrument API of the application provides functionality of searching instruments with the search instrument string
     * 
     * @param {Object} reqObject request object.
     * 
     * @param {string} reqObject.searchString
     *  searchString for searching the instrument
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     */
    async searchInstrument(reqObject) {
        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("GET", this.url + settings.restApi.searchInstruments + "?searchString=" + reqObject.searchString + "&userID=" + reqObject.userID + "&source=" + reqObject.source, { 'authorization': this.token }, null);
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    /**
     * clientConfig API of the application provides functionality of getting client configuration details from the application
     * 
     * @param {Object} reqObject request object.
     * 
     * @param {string} reqObject.source
     *  source used by the user
     * 
     *  @param {string} reqObject.userID
     *  userID of the user
     * 
     */
    async clientConfig(reqObject) {
        try {

            await this.checkLoggedIn();
            let response = await request.processRequest("POST", this.url + settings.restApi.clientConfig, { 'authorization': this.token }, reqObject);
            this.populateEnums(response.result);
            return response;

        } catch (error) {

            let customError = new CustomError(error.message, error.stack, error.statusCode);
            return customError;

        }
    }

    async checkLoggedIn() {

        if (this.isLoggedIn) {
            return true;

        } else {

            throw { message: "Login is Required", stack: "login is mandatory", statusCode: 404 };
        }
    }

    populateEnums(enums) {

        for (var i in enums) {

            var enumKey = i;
            var enumValue = enums[i];

            if (enumValue.length == undefined) {
                this[enumKey] = enumValue;
            } else {
                var object = {};

                for (var j of enumValue) {
                    object[j] = j;
                }

                this[enumKey] = object;
            }

        }
    }
}