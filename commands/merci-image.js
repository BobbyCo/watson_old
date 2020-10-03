const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    name: 'merci',
    desc: 'Remercie une personne',

    args: 1,
    usage: '<utilisateur>',
}

module.exports.execute = async (msg, args, R) => {
    if(msg.mentions.users.size == 0)
        return msg.channel.send('il faut mentionner la personne à remercier');

    // Profile pics
    const sender = msg.author.avatarURL({format: 'jpg'});
    const receiver = msg.mentions.users.first().avatarURL({format: 'jpg'});

    // Create canvas
    const canvas = Canvas.createCanvas(780,450);
    const ctx = canvas.getContext('2d');

    // Load BG image
    const bg = await Canvas.loadImage(__dirname + '/../res/img/merci.png');
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    //Draw pp
    await drawCirclePP(ctx, {path: receiver, x: 225, y: 180, size: 50});
    await drawCirclePP(ctx, {path: sender, x: 435, y: 225, size: 50});

    // Send the attachements
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'merci.png');
	msg.channel.send(attachment);
}

const drawCirclePP = async (ctx, args) => {
    ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
    ctx.clip();

    try {
        const img = await Canvas.loadImage(args.path);
        ctx.drawImage(img, args.x, args.y, args.size, args.size);
    } catch(e) {
        console.log(e);
        return;
    }
}