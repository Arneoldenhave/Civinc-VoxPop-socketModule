const SocketModel = require('../Model/SocketModel');

class SocketController  {

    model = new SocketModel();

    onConnection(socket) {
        this.model.onConnection(socket);
    };

    getDisconnected(eventId) {
        return this.socketManager.getDisconnected(eventId);
    }

    setMatches(eventId, matches) {
        return this.model.setMatches(eventId, matches);
    };

    getEvents() {
        return this.model.getEvents();
    };

    broadcast(eventId, type, data) {
       return this.model.broadcast(eventId, type, data);
    };

};

module.exports = SocketController;