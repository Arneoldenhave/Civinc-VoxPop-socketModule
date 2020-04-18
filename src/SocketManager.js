
class EventSockets {

    eventId 
    matches

    connected = {};    
    diconnected = {};


    constructor(eventId) {
        this.eventId = eventId;
    };

    getDisconnected()  {};

    setMatches(matches) {};

    getDiconnected() {
        Object.keys(this.connected).forEach(key => {
            const disconnected = this.connected[key] === null;
            
            if(disconnected) {
                this.diconnected[key] = 'disconnected'
            };
        });
        return this.diconnected;
    };
    
    addConnection(userId, socketId) {
        this.connected[userId] = socketId;
    };

};



class SocketManager {

    constructor() {}



    // stores connections via eventid
    events = {};

    // setMatches


    // getDisconnected


    // publish events:

    setMatches(eventId, matches) {}


    getDisconnected(eventId) {
        const event = this.events[eventId];

        if (!event) {
            return null;
        };
        const diconnected = event.getDiconnected()
        return diconnected
    }

    

    onConnection(socket) {
        const { query, socketId} = socket;
        const { userId, eventId} = query;

        if (!this.events[eventId])  {
            this.events[eventId] = new EventSockets(eventId);
        };

        this.events[eventId].addConnection(userId, socketId);
    };

}

module.exports = SocketManager;

