const express = require('express');
const router = express.Router();

const SocketController = require('./../../Controller/SocketController');
const SocketFactory = require('./../../Factory/SocketFactory');


const controller = new SocketController();
const factory =  new SocketFactory();

router.post('/', (req, res, next) => {

    const { body } = req
    const { amount, disconnected } = body;
    const sockets = factory.createSockets(amount, disconnected);

    sockets.forEach(socket => {
        controller.onConnection(socket);
    });

    const events = controller.getEvents();
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
    const updated = controller.setMatches(eventId, matches);

    if(!updated) {
        res.status(404).send(`Error: ${eventId} not found`);
    };
    res.status(200).send(updated);
});

router.post('/broadcast/:eventId', (req, res, next) => {
    const { eventId } = req.params;
    const { type, message } = req.body;
    const result = controller.broadcast(eventId, type, message);

    if (!result) {
        res.status(404).send(`Error: ${eventId} not found`)
    };
    res.status(200).send(result);
})

module.exports = router;