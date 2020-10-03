const {adminRole} = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: 'start-poll',
    desc: 'Adds a poll',

    args: 2,
    usage: '<nom> <nb_options>',
    
    role: adminRole
}

module.exports.execute = async (msg, args, R) => {
    const tag = args.shift();
    const nb_args = args.shift();
    const content = await Util.getUserInput(msg, "Quel sera le message affiché ?");

    const data = JSON.stringify((new Array(Number(nb_args))).fill(0));

    await R.db.insert('polls', {
        name: tag,
        content: content,
        num_options: nb_args,
        data: data
    });
    msg.channel.send('sondage ajouté !');
}