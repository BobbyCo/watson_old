module.exports = {
    name: 'delete-channel',
    desc: 'ajoute un salon dans la base de données',

    args: 1,
    usage: '<name>',
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const res = await R.db.delete('channels', {name: args[0]});
    if(res && res.error)
        return msg.channel.send(res.error);
    msg.channel.send('le salon a été supprimé de la base de données !');
}