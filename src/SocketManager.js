
const CONNECTED = "CONNECTED";
const DISCONNECTED = 'DISCONNECTED';
const NEVER = "NEVER";
const INVALID = "INVALID";

class EventSockets {

    eventId = null;
    matches = {};

    connected = {};    
    diconnected = {};
    invalidMatches = {};

    never_connected = {};

    constructor(eventId) {
        this.eventId = eventId;
    };

    _validate(matchArray) {
        if(matchArray.length === 0 ) {
            return null;
        };

        if (matchArray.length === 1) {
            this._handleInvalid[matchArray[0]]
            return null;
        };

        if (matchArray.length > 2 ) {
            return null;
        };
        return matchArray
    }

    _match(match) {
        const validated = this._validate(match);
        
        const one = validated[0];
        const two = validated[1];    
        
        const socketOne = this.connected[one];
        const socketTwo = this.connected[two];


        // CONNCETED
        const ONE_CONNECTED = socketOne === CONNECTED;
        const TWO_CONNCETED = socketTwo === CONNECTED;
     
        // DISCONNECTED
        const ONE_DISCONNECTED = socketOne == DISCONNECTED;
        const TWO_DISCONNECTED = socketTwo == DISCONNECTED;

        // DO NOT EXIST
        const ONE_DOES_NOT_EXIST = socketOne == null;
        const TWO_DOES_NOT_EXIST = socketTwo == null;

        // ONE AND TWO
        const BOTH_CONNECTED = ONE_CONNECTED && TWO_CONNCETED;

        const ONE_AND_TWO_DISCONNECTED = ONE_DISCONNECTED && TWO_DISCONNECTED;
        const ONE_AND_TWO_DO_NOT_EXIST = ONE_DOES_NOT_EXIST && TWO_DOES_NOT_EXIST;

        const ONE_DISCONNETED__AND__TWO_DOES_NOT_EXIST = ONE_DISCONNECTED && TWO_DOES_NOT_EXIST;
        const TWO_DISCONNECTED__AND__ONE_DOE_NOT_EXIST = TWO_DISCONNECTED && ONE_DOES_NOT_EXIST;

        // IDS
        const ONE = [one];
        const TWO = [two];
        const ONE_AND_TWO = [one, two];


        if (ONE_AND_TWO_DISCONNECTED) 
        {
            this._handleDisconnected(ONE_AND_TWO);
        }
        else if (ONE_AND_TWO_DO_NOT_EXIST) 
        { 
            this._handleNeverConnected(ONE_AND_TWO);
        } 
        else if (ONE_DISCONNETED__AND__TWO_DOES_NOT_EXIST) 
        {
            this._handleDisconnected(ONE);
            this._handleNeverConnected(TWO);
        }
        else if (TWO_DISCONNECTED__AND__ONE_DOE_NOT_EXIST) 
        {
            this._handleDisconnected(TWO);
            this._handleNeverConnected(ONE);
        }
        else if(TWO_DISCONNECTED) 
        {
            this._handleDisconnected(TWO)
            this._handleInvalid(ONE);
        
        } else if (ONE_DISCONNECTED) 
        {
            this._handleDisconnected(ONE);
            this._handleInvalid(TWO);
        } 
        else if (BOTH_CONNECTED) 
        {
            this.matches[one] = two;
            this.matches[two] = one;
        };
    };

    _handleNeverConnected(ids) {
        console.log(NEVER);
        ids.forEach(userId => {
            this.never_connected[userId] = NEVER;
        });
    };

    _handleDisconnected(ids) {
        console.log(DISCONNECTED);
        ids.forEach(userId => {
            delete this.connected[userId];
            this.diconnected[userId] = DISCONNECTED;
        });
    };

    _handleInvalid(ids) {
        console.log(INVALID);
        ids.forEach(userId => {
            this.invalidMatches[userId] = INVALID
        });
    };

    setMatches(matches) {
        
        for (const match of matches) 
        {
            this._match(match);
        };
        return this;
    };

    getDisconnected() 
    {
        Object.keys(this.connected).forEach(key => {
            const disconnected = this.connected[key] === null;
            if(disconnected) {
                this.diconnected[key] = DISCONNECTED;
            };
        });
        return this.diconnected;
    };
    

    addConnection(userId, socketId) {
        if (socketId) {
            this.connected[userId] = CONNECTED;
        } else {
            this.diconnected[userId] = DISCONNECTED;
        };
    };
};


class SocketManager {

    constructor() {}

    // stores connections via eventid
    events = {};
    /**
     * @Inerface
     * setMatches
     * getDisconnected
     * onConnection
    */

    /**
     * Set matches in event
     * @param {*} eventId 
     * @param {*} matches 
     */
    setMatches(eventId, matches) {
    
        const event = this.events[eventId];
        if (!event) {
            return null
        }
        const updated = event.setMatches(matches);
        return updated  
    };

    /**
     * get diconnected
     * @param {*} eventId 
     */
    getDisconnected(eventId) {
        const event = this.events[eventId];
        if (!event) {
            return null;
        };
        const diconnected = event.getDisconnected();
        return diconnected;
    };

    /**
     * On user connected
     * @param {*} socket 
     */
    onConnection(socket) {
        const { query, socketId} = socket;
        const { userId, eventId} = query;

        if (!this.events[eventId])  {
            this.events[eventId] = new EventSockets(eventId);
        };
        this.events[eventId].addConnection(userId, socketId);
    };
};

module.exports = SocketManager;

