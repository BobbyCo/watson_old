const {adminRole} = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: 'add-role',
    desc: 'modifie un pour avoir lui permettre d\'assigner des roles selon les réactions mises',

    role: adminRole,
}

module.exports.execute = async (msg, args, R) => {
    const link = await Util.getUserInput(msg, "Lien vers le message qui sera le poll");
    const emoji = await Util.getUserInput(msg, "Quel emoji faudra-il utiliser ?");
    const role = await Util.getUserInput(msg, "Quel role ajouter quand l'emoji est utilisé ?");

    const post_id = link.split('/').filter(x => !isNaN(x)).join('/').slice(1);
    const ids = post_id.split('/');

    const reactChannel = msg.guild.channels.cache.get(ids[1])
    if(reactChannel.type === "text") {
        reactChannel.messages.fetch(ids[2]).then(m => m.react(emoji));
    } else {
        msg.channel.react("Faut mettre un lien en rapport avec un message");
    }

    await R.db.insert("role_adders", {post_id: post_id, emoji: emoji, role: role.slice(3,-1)});
    msg.channel.send("Listener succesfully added");
}