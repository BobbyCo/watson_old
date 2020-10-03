const {adminRole} = require('../config.json');

module.exports = {
    name: 'ds-stop',
    desc: 'Supprime les salons liés au DS',

    role: adminRole
}

module.exports.execute = (msg, args, R) => {
    //msg.delete();

    let categoryName = R.string.categoryName.format();
    let cat = msg.guild.channels.cache.find(c => c.name === categoryName);

    if(!cat) {
        return msg.channel.send(R.string.noDs.format());//.then(r => r.delete({timeout: R.int.deleteTimeout}));
    }

    msg.guild.channels.cache.filter(c => c.parentID == cat.id).array().forEach(c => {
        c.delete();
    })
    
    cat.delete();
}