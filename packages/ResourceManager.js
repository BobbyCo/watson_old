/**
 * Author: Guillaume ROUSSIN
 * 
 * Class:       ResourceManager
 * Description: an object capable of reading static variable and modify datasheets
 * 
 * Public functions:
 *  getDataSheet: returns a JSON object of the datasheet from a specefic guild
 *  setDataSheet: modifies the datasheet from a specific guild
 */

const fs = require('fs');

exports.ResourceManager = class {
    #REGEX
    #res_path
    #sheets

    constructor(res_path) {
        this.#REGEX = /<(\w+) name="(\w+)">([\s\S]+?)<\/\1>/gm;

        if(res_path.charAt(res_path.length-1) == '/') res_path.slice(-1);

        this.#res_path = res_path;
        this.#sheets = {}

        this.loadResources(this.#res_path);

        this.#res_path += "/datasheets";
        this.loadDataSheets(this.#res_path);
    }

    // Retrieves XML resources and stores them in the object
    loadResources(path) {
        fs.readdirSync(path)
        .filter(file => file.endsWith('.xml'))
        .forEach(file => {
            let file_content = fs.readFileSync(`${path}/${file}`, 'utf8');
            
            // XML Parsing
            let args = file_content.match(this.#REGEX);
            if(args != null) {
                args.forEach(a => {
                    let args = this.getArgs(a);

                    // Add category if a new one appears
                    if(!this[args.type]) this[args.type] = {};

                    // Handle String to FormatString
                    if(args.type == "string")
                        this[args.type][args.name] = new exports.FormatString(args.content);
                    else
                        this[args.type][args.name] = args.content;
                });
            }
        });
    }



    // Extracts XML args from a tag
    getArgs(xml) {
        let data = (new RegExp(this.#REGEX.source, this.#REGEX.flags)).exec(xml);
        
        if(data == null) return null;
        return {type: data[1], name: data[2], content: data[3].trim()};
    }



    // retrieves all datasheets and stores them by guild (recursively)
    loadDataSheets(path, guild_id = '') {
        fs.readdirSync(path)
        .filter(file => file.endsWith('.json'))
        .forEach(file => this.loadSheet(`${path}/${file}`, guild_id));

        // Load all sheets inside folder
        fs.readdirSync(path)
        .filter(file => fs.lstatSync(`${path}/${file}`).isDirectory())
        .forEach(dir => this.loadDataSheets(`${path}/${dir}`, `${guild_id}["${dir}"]`));
    }



    //loads an individual sheet into memory
    loadSheet(path, guild_id) {
        let file_content = fs.readFileSync(path, 'utf8');
        let file_index = path.split('/').pop().replace('.json', '');

        // Handle missing info/category
        if(guild_id == '') {
            this.#sheets[file_index] = JSON.parse(file_content);
        } else {
            if(file_content == "") file_content = "{}";
            if(!eval(`this.#sheets${guild_id}`)) eval(`this.#sheets${guild_id} = {}`);  
            eval(`this.#sheets${guild_id}["${file_index}"] = JSON.parse(file_content)`);
        }
    }



    // returns a json object with the guild folder
    getDataSheet(guild_id, sheetName) {
        guild_id += ""; // String casting
        if(!this.#sheets[guild_id][sheetName]) return null;
        return this.#sheets[guild_id][sheetName];
    }



    // modifies a datasheet within the guild folder
    setDataSheet(guild_id, sheetName, data) {
        guild_id += ""; // String casting

        // Handle missing category
        if(!this.#sheets[guild_id]) this.#sheets[guild_id] = {}
        if (!fs.existsSync(`${this.#res_path}/${guild_id}`))
            fs.mkdirSync(`${this.#res_path}/${guild_id}`);

        this.#sheets[guild_id][sheetName] = data;

        // Update file asynchronously
        let writePath = `${this.#res_path}/${guild_id}/${sheetName}.json`;
        fs.writeFile(writePath, JSON.stringify(data), (err) => {
            if(err) throw err;
            console.log('Data object updated');
        });
    }


}

/**
 * Author: Guillaume ROUSSIN
 * 
 * Class:       FormatString
 * Description: Formatable string
 * 
 * Public functions:
 *  toString:   returns the original string
 *  format:     replaces all occurences of {} in the string with a supplied argument
 */

exports.FormatString = class {
    
    constructor(string) {
        this.string = string;
    }

    toString() {
        return this.string;
    }

    // Replaces every occurence of {} with a supplied variable
    format() {
        var res = this.string;
        Array.from(arguments).forEach(n => {
            res = res.replace(/\{\}/, ""+n);
        });

        return res;
    }
}