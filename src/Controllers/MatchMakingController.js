const EventFactory = require('../Factories/EventFactory/Factory');
const ResultsFactory = require('./../Factories/Results/Factory');
const MatchMakingModel = require('./../Models/MatchMakingModel');

const eventfactory   = new EventFactory();
const resultsFactory = new ResultsFactory();
const matchMakingModel = new MatchMakingModel();

class MatchMakingController {

    createMatches = async (req, res, next) => {

        try {

            eventfactory.addGroup(5);
            eventfactory.addGroup(5); 
             eventfactory.addGroup(5);
            // eventfactory.addGroup(30);
            // eventfactory.addGroup(30);
            // eventfactory.addGroup(30);
            
            eventfactory.addThesis([0.2, 0.3, 0.5]);
            eventfactory.addThesis([0.9, 0.0, 0.1]);
            // eventfactory.addThesis([0.9, 0.0, 0.1]);
            // eventfactory.addThesis([0.2, 0.5, 0.3]);
            // eventfactory.addThesis([0.2, 0.5, 0.3]);

            const lastRrounds = [];
            const setup   = eventfactory.create();
            const results = resultsFactory.create(setup);
            const matches = matchMakingModel.match(results, lastRrounds);
                    
            eventfactory.clear();
            resultsFactory.clear();

            const body = matches; //`${raster}`
            res.status(200).send(body)
            resultsFactory.clear();
        
        } catch(err) {
            console.log(err)
            res.status(500).send(err)
        };
    };
}


module.exports = MatchMakingController;     