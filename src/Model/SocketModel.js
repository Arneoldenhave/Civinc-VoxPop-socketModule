const SocketEvent = require('./SocketEvent');

class SocketModel {

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
            return null;
        };
        const updated = event.setMatches(matches);
        return updated;
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
            this.events[eventId] = new SocketEvent(eventId);
        };
        this.events[eventId].addConnection(userId, socketId);
    };

    broadcast(eventId, type, data) {
        const event = this.events[eventId];
        if (!event) {
             return null;
        };
        return event.broadcast(type, data);
        
    };

    getEventById(eventId) {
        return this.events[eventId];
    }

    /**
     * Get al events
    */
    getEvents() {
        return this.events;
    }
};

module.exports = SocketModel;

