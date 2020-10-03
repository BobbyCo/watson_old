const fs = require('fs');
const rm = require('./packages/ResourceManager');
const dbm = require('./packages/DatabaseManager');

const Discord = require('discord.js');
const {prefix, token, adminRole} = require('./config.json');

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const R = new rm.ResourceManager(__dirname+'/res/');
const db = new dbm.DatabaseManager(__dirname+'/models/');

const roleModify = require('./reaction_manager/role_modify');

// Appending the database to the ressourceManager
R.db = db;

// Loading commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require('./commands/' + file);
    bot.commands.set(command.name, command);
}

// Startup + Ressource loading
bot.on("ready", () => {
    console.log("WATSON is online !");
});

// Create new role on join
bot.on('guildCreate', (guild) => {
    console.log("I joined a guild !");
    // Adds the admin role on joining server
    guild.roles.create({data: {
        name: adminRole,
        color: R.color.adminRoleColor
    }});
    R.db.upsert('timezones', {guild_id: guild.id, timezone: 0});
});

bot.on("messageReactionAdd", async (r, user) => {
    roleModify(r, user, R, 1);
});

bot.on("messageReactionRemove", async (r, user) => {
    roleModify(r, user, R, 0);
});

// Dynamic command processing
bot.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    // Check that the command exists
    if (!bot.commands.has(commandName))
        return msg.channel.send(R.string.errorCommandNotFound.format(commandName));

    const command = bot.commands.get(commandName);

    if(command.role && !msg.member.roles.cache.some(r => r.name == command.role))
        return msg.channel.send(R.string.errorNoRole.format());

    // Check the command can be ran in DMs
    if (command.guildOnly && msg.channel.type !== 'text')
        return msg.reply(R.string.errorNoDM.format());
    
    // Arg count check
    if((command.args && args.length != command.args && command.args != -1) || (command.args == -1 && args.length == 0) || args[0] == '?') {
        let reply = "";

        if((command.args && args.length != command.args && args[0] != '?') || (command.args == -1 && args.length == 0))
            reply += 'Mauvais nombre d\'arguments !\n';
        
        if(command.usage)
            reply += `Usage: \`${prefix}${commandName} ${command.usage}\``;

        return msg.channel.send(reply);
    }

    // Execute command
    try {
        command.execute(msg, args, R);
    } catch (error) {
        console.error(error);
        msg.channel.send(R.string.errorExec.format());
    }
});

bot.login(token);