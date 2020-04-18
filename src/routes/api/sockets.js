const express = require('express');
const router = express.Router();

const SocketManager = require('../../SocketManager');


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
const socketManager = new SocketManager();
const socketFactory = new SocketFactory();

router.post('/', (req, res, next) => {
    const { body } = req
    const { amount, disconnected } = body;

    const sockets = socketFactory.createSockets(amount, disconnected)
 
    sockets.forEach(socket => {
        socketManager.onConnection(socket)
    })

    const events = socketManager.events;
    res.status(200).send(events);   
});


router.get('/disonnected/:eventId', (req, res, next) => {
    const { eventId } =  req.params;
    const disconnected = socketManager.getDisconnected(eventId);

    if (!disconnected) {
        res.status(404).send(`Error: ${eventId} not found!` );
    };
    res.status(200).send(disconnected);
});


router.post('/matches/:eventId', (req, res, next) => {
    const { matches } = req.body;
    const { eventId } = req.params;

    const updated = socketManager.setMatches(eventId, matches);
    if(!updated) {
        res.status(404).send(`Error: ${eventId} not found`);
    }
    res.status(200).send(updated);
});

module.exports = router;