const { Thesis, ResultSetup, Result } = require('../../Classes/Classes');

class EventFactory {

    data
    theses = [];
    groups = 0;
    users = [];

    addGroup(users) {
        const group = Array(users).fill().map((num, i ) =>  `group${this.groups}__user${i}`);
        this.groups++;
        this.users.push(group);
    };

    getGroup() {
        return this.groups;
    }
    
    addThesis(entropy) {
        const num = this.theses.length;
        const thesis =  {
            text: "thesis_" + num,
            entropy
        }
        this.theses.push(thesis);
    };

    create() {
        const setup = {
            theses : this.theses,
            users : this.users
        };
        this.data = new ResultSetup(this.theses, this.users);
        return this.data;
    };

    clear() {
        this.data = undefined;
        this.theses = [];
        this.users = [];
    };
};


module.exports = EventFactory