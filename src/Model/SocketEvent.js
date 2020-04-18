
const CONNECTED = "CONNECTED";
const DISCONNECTED = 'DISCONNECTED';
const NEVER = "NEVER";
const INVALID = "INVALID";

class SocketEvent {

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
        const ONE_CONNECTED = socketOne ? socketOne.connected : false;
        const TWO_CONNCETED = socketTwo ? socketTwo.connected : false;

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
        ids.forEach(userId => {
            this.never_connected[userId] = NEVER;
        });
    };

    _handleDisconnected(ids) {
        ids.forEach(userId => {
            delete this.connected[userId];
            this.diconnected[userId] = DISCONNECTED;
        });
    };

    _handleInvalid(ids) {
        ids.forEach(userId => {
            this.invalidMatches[userId] = INVALID;
        });
    };

    _handleConnection(userId, socket)
    {
        if (socket.connected === false) {
            delete this.connected[userId];
            this.disconnected[userId] = socket;
        } 
    };

    setMatches(matches) {
        for (const match of matches) 
        {
            this._match(match);
        };
        return this;
    };

    getConnected() {
        this.checkConnections()
        const array = Object.keys(this.connected).map( userId => userId);
        return array;
    };

    checkConnections() {
        Object.keys(this.connected).forEach(userId => {
            const socket = this.connected[userId];
            this._handleConnection(userId, socket)
        });
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
    
    broadCastToSelected(ids, TYPE, data) 
    {
        var success = 0;
        var failed = 0;
        var disconnected = 0;
        var invalid = 0;

        ids.forEach(userId => {
            const socket = this.connected[userId];

            if (socket && socket.connected) {
                success++;
                socket.emit(TYPE, data);
            } 
            else if (!socket) 
            {
                failed++;
                invalid++;
                this._handleInvalid([userId]);
            }
            else  if(!socket.connected) 
            {
                failed++;
                disconnected++;
                this._handleDisconnected([userId]);
            };
        });

        const result = {
            success,
            failed,
            disconnected,
            invalid
        };
        return result;
    };

    broadcastToAll(TYPE, data) {
        var i = 0;
        Object.values(this.connected).forEach(socket => {
            socket.emit(TYPE, data)
            i++
        });
        return { result: `Sent ${i} messages of ${TYPE}`}
    };

    addConnection(userId, socket) {
        if (socket.connected) 
        {
            delete this.diconnected[userId];
            this.connected[userId] = socket;
        } 
        else 
        {
            delete this.connected[userId];
            this.diconnected[userId] = socket;
        };
    };
};

module.exports = SocketEvent;