class ResultsFactory
{

    setup  
    results = [];
    constructor()
    {

        this.results = [];
    };

    addMeta() {
        const data = {
            total : this.results.length,
            results : this.results
        };
        return data;
    }; 

    create(setup)  {
        this.setup = setup;
        this._create();
        return this.results
    };

    clear() {
        this.setup = null;
        this.results = [];
    }

    _createId(type, id) {
        return `${type}_${id}`
    };
    

    /**
     * @param thesis
     * entropy = [0.2, 0.5, 0.3];
     *             f  + n +  t  = 1
     */
    _createAnswer(thesis) {
        const n = thesis.entropy[1];
        const f = thesis.entropy[0] * 1 / n;
        const t = thesis.entropy[2] * 1 / n;

        const neutral = Math.random() < n;
        if (neutral === true) { return 1 };

        const answer = Math.random() > t;
        if  (answer === true) {
            return 0;
        } else {
            return  2;
        };
    };

    _create()
    {
        const setup    = this.setup;
        const theses   = setup.theses;
        const users    = setup.users;
        const eventId  = this._createId('event', 0);
        let r = 0;
        let t = 0;

        for (const thesis of theses)
        {
            const text       = thesis.text;
            const thesisId   = this._createId('thesis', t); t++;

            let g = 0;
            for (const group of users)
            {
                const groupId = this._createId('group', g);

                let u = 0;
                for (const user of group)
                {
                    const resultId = this._createId('result',r);     r++;
                    const userId   = this._createId( `group${g}_user`  ,u);     u++;
                    const answer   = this._createAnswer(thesis);
                    const result   = 
                    {
                        userId,
                        thesisId,
                        eventId,
                        groupId,
                        answer,
                        text,
                        _id: resultId,
                        __v: 0
                    };
                    this.results.push(result);
                };
                g++;
            };
        };
    };
};

module.exports = ResultsFactory;
