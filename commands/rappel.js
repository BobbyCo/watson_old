const {adminRole} = require('../config.json');

module.exports = {
    name: 'rappel',
    desc: 'Ajoute des salons textuels et vocaux temporaires dans une catégorie DS',

    role: adminRole,
    beta: true
}

module.exports.execute = (msg, args, R) => {
    msg.delete();
    msg.channel.send('<@&715593555980058676> CR Journalier');
}