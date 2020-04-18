class SocketFactory {

    _createSocket(socketId, query) {
        return {
             socketId: socketId,
             query: query
        };
    };
     
    _createQuery(userId, eventId) {
        return {
            userId: userId,
            eventId: eventId
        };
    };
    
    createSockets(amount, disconnected) 
    {
        const eventId = 'event_' + 0;
        var sockets = [];  
        for (var i = 0; i< amount; i++) {

            const userId = 'user_' + i;
            const socketId = i < disconnected ? null : 'socket_' + i;

            const query = this._createQuery(userId, eventId);
            const socket = this._createSocket(socketId, query);
            sockets.push(socket)
        };
        return sockets;
    };
};

module.exports = SocketFactory;