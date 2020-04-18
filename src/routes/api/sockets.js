const express = require('express');
const router = express.Router();

const SocketController = require('./../../Controller/SocketController');
const SocketFactory = require('./../../Factory/SocketFactory');

const controller = new SocketController();
const factory =  new SocketFactory();


router.post('/', (req, res, next) => {

    const { body } = req
    const { amount, disconnected } = body;

    if (!body, !amount, !disconnected ) {
        return res.status(400).send("Error: Bad Request")
    }

    const sockets = factory.createSockets(amount, disconnected);

    sockets.forEach(socket => {
        controller.onConnection(socket);
    });

    const events = controller.getEvents();
    res.status(200).send(events);   
});


router.get('/disonnected/:eventId', (req, res, next) => {
    const { eventId } = req.params;

    if (!eventId ) {
        return res.status(400).send("Error: Bad Request")
    };
    const disconnected = socketManager.getDisconnected(eventId);

    if (!disconnected) {
        res.status(404).send(`Error: ${eventId} not found!` );
    };
    res.status(200).send(disconnected);
});

router.post('/messages', (req, res, next) => {
    const { message } = req.body;
    console.log(message);
    if (!message)  {
        return res.status(400).send("Error: Bad Request");
    }
    const result = controller.message(message);
    if (!result) {
        return  res.status(500).send("Error: Internal Server Error");
    };
    return res.status(200).send(result);
});

router.post('/matches/:eventId', (req, res, next) => {
    const { matches } = req.body;
    const { eventId } = req.params;

    if (!matches, !eventId ) {
        return res.status(400).send("Error: Bad Request");
    };

    const updated = controller.setMatches(eventId, matches);

    if(!updated) {
        res.status(404).send(`Error: ${eventId} not found`);
    };
    res.status(200).send(updated);
});

router.post('/broadcast/:eventId', (req, res, next) => {
    const { eventId } = req.params;
    const { type, data } = req.body;

    if (!type, !data, !eventId ) {
        return res.status(400).send("Error: Bad Request");
    };

    const result = controller.broadcast(eventId, type, data);

    if (!result) {
        return res.status(404).send(`Error: ${eventId} not found`);
    };
    return res.status(200).send(result);
})

module.exports = router;