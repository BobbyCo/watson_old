module.exports = class {
    static async getUserInput(msg, question, format = /.+/g) {
        return this.getDMInput(msg.channel, msg.author, question, format);
    }

    static async getDMInput(channel, author, question, format = /.+/g) {
        const f = m => (m.author == author);
        
        channel.send(question);
        
        try {
            let answers = await channel.awaitMessages(f, { max: 1, time: 300000, errors: ['time'] });
            let content = answers.first().content
            if(!content.match(format)) {
                channel.send("**Error:** Wrong format !");
                return await getUserInput(channel, author, question, format);
            } else
                return content;
        } catch(e) {
            return "";
        }
    }


}