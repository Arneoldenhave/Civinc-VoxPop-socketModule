class SocketFactory {

    _newSocket(socketId, active) {
        return {
             socketId: socketId,
             connected : active,
             emit: (type, data) => {
                console.log(`Emit: ${type} data: ${data} socket: ${socketId}`);
            }
        };
    };
     
    _create(eventId, userId, socketId, connected) {
        return {
            eventId, 
            userId, 
            socket: this._newSocket(socketId, connected)
        };
    };
    
    createSockets(amount, disconnected) 
    {
        const eventId = 'event_' + 0;
        var sockets = [];  
        for (var i = 0; i< amount; i++) 
        {
            const userId = 'user_' + i;
            const socketId = 'socket_' + i;
            const connected = i < disconnected ? false: true 
            const socket = this._create(eventId,userId, socketId, connected) ;
            sockets.push(socket)
        };

        return sockets;
    };
};

module.exports = SocketFactory;