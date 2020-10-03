const Util = require('../packages/Util');

module.exports = {
    name: 'add-timer',
    desc: 'displays a timer at the top of the channels that auto updates',

    args: 1,
    usage: '<type>',
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const TIMER_CATEGORY = "timers";

    // CHECK CHANNEL TYPE
    let type = args[0].toLowerCase();
    if(type != "text" && type != "voice") type = "text";

    // GET TIMESTAMP
    const date = await Util.getUserInput(msg, "Date: `dd/MM`", /^[0-9]{2}\/[0-9]{2}$/g);
    const time = await Util.getUserInput(msg, "Time: `hh:mm`", /^[0-9]{2}:[0-9]{2}$/g);
    const timestamp = getTimeStamp(date, time);
    
    // CREATE CHANNEL
    let eventName = "";
    let channelTitle = formatTimeUntil(getTimeUntil(timestamp));
    if(type === "voice") {
        eventName = await Util.getUserInput(msg, "Event name: `15 characters max`", /^.{1,15}$/g);
        channelTitle = `${eventName}: ${channelTitle}`;
    }
    let parentCat = msg.guild.channels.cache.find(c => c.name === TIMER_CATEGORY);
    if(!parentCat) {
        await createChannel(msg, TIMER_CATEGORY, "category", null);
        parentCat = msg.guild.channels.cache.find(c => c.name === TIMER_CATEGORY);
    }  
    const channelID = await createChannel(msg, channelTitle, type, parentCat);

    // CHECK REMINDER
    const reminder = await Util.getUserInput(msg, "Should I schedule a reminder ? `Y/N`", /^[ynYN]$/g);
    const isReminderActive = (reminder.toLowerCase() === "y");
    let reminderMessage = "";
    let reminderChannel = "";
    if(isReminderActive) {
        reminderMessage = await Util.getUserInput(msg, "What should the message be ?");
        reminderChannel = await Util.getUserInput(msg, "Where should I post the reminder ? `#general`", /^<#[0-9]{18}>$/g);
    }

    // ADD TO DATABASE
    const payload = {
        channel_id: channelID,
        type: type,
        name: eventName,
        timestamp: String(timestamp),
        event: isReminderActive,
        event_content: reminderMessage,
        event_channel: reminderChannel.slice(2,-1)
    };
    R.db.upsert("timers", payload);
    msg.channel.send('successfully created timer');
}



/* TIME RELATED FUNCTIONS */
const getTimeStamp = (date, time) => {
    const y = now().getFullYear();
    const [d, m] = date.split('/');
    const [h, i] = time.split(':');

    return new Date(y, m-1, d, h, i, 0, 0).getTime();
}

const getTimeUntil = (date) => {
    const diff = Math.abs(date-now());
    const d = new Date(diff);

    return {
        d: d.getUTCDate()-1,
        h: d.getUTCHours(),
        m: d.getUTCMinutes()+1
    }
}

const formatTimeUntil = (o) => {
    const addzero = (x) => (x<10) ? "0"+x : x;
    
    if(o.d == 0)
        return `${o.h}h${addzero(o.m)}`; 
    else
        return `${o.d} days`;
}

const now = () => {
    return new Date();
}



/* CHANNEL CREATION */
const createChannel = async (msg, name, type, parentCategory) => {
    const perms = {
        'text': {VIEW_CHANNEL: false},
        'voice': {CONNECT: false},
        'category': {VIEW_CHANNEL: false}
    }

    let c = await msg.guild.channels.create(name, {type: type})
    c.updateOverwrite(c.guild.roles.everyone, perms[type]);

    if(type == "text")
        c.setParent(parentCategory);

    return c.id;
}