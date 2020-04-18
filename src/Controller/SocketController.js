const SocketModel = require('../Model/SocketModel');

const MESSAGE = "message";

class SocketController {

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
    

    connect(io) {
        io.on('connection', async(socket) => {

            var handshakeData = socket.request;
            let eventId = handshakeData._query["eventId"];
            let userId = handshakeData._query["userId"];

            const connection = {userId: userId, eventId: eventId, socket: socket };
            this.model.onConnection(connection);

            socket.emit(MESSAGE, "connected")

            socket.on(MESSAGE, data => {
                const { eventId, chatId, userId, matchId, message} = data;
                const result = this.model.broadcastToSpecific(eventId, [matchId], MESSAGE, message);
                console.log(result);
                // handle message
            });
        });
    };
};

module.exports = SocketController;