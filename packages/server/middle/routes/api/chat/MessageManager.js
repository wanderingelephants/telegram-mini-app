const path = require('path');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const _getFilePath = function (basePath, sessionId, activity, filename) {
  const date = new Date();
  const year = date.getFullYear() + "";
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return path.join(basePath, year, month, day, sessionId, activity, filename);
}

const _ensureDirectory = async function (filePath) {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
}
  
class MessageManager {
    constructor(basePath) {
        this.basePath = basePath;
    }
    async saveMessage(sessionId, activity, message, filename) {
        const filePath = _getFilePath(this.basePath, sessionId, activity, filename);
        await _ensureDirectory(filePath);

        let messages = [];
        try {
            const data = await readFile(filePath, 'utf-8');
            messages = JSON.parse(data);
        } catch (err) {
            console.log("err in saveMessage", err)
            //if (err.code !== 'ENOENT') throw err;
        }
        messages.push(message);
        await writeFile(filePath, JSON.stringify(messages, null, 2));
    }
    async getMessages(sessionId, activity, filename) {
        const filePath = _getFilePath(this.basePath, sessionId, activity, filename);
        let messages = [];
        try {
            const data = await readFile(filePath, 'utf-8');
            messages = JSON.parse(data);
        } catch (err) {
            console.log("err in getMessages", err)
            //if (err.code !== 'ENOENT') throw err;
        }
        return messages
    }
    async getLastMessage(sessionId, activity, filename) {
        const filePath = _getFilePath(this.basePath, sessionId, activity, filename);
        let messages = [];
        try {
            const data = await readFile(filePath, 'utf-8');
            messages = JSON.parse(data);
        } catch (err) {
            console.log("error in getLastMessage", err)
            //console.error(err)
            return []
        }
        return messages.length > 0 ? messages[messages.length - 1] : []
    }


}
module.exports = MessageManager  