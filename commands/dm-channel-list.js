module.exports = {
    name: 'list-channels',
    desc: 'liste les salons de la base de données',

    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const channels = await R.db.fetchAll('channels', {});
    const list = channels.map(c => `**${c.get('name')}** - ${c.get('desc')}`).join('\n');

    msg.channel.send(list);
}