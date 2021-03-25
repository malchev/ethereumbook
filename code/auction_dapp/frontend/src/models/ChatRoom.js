import Config from '../config'

export class ChatRoom {
    conn = null
    http = null

    constructor(http) {
        this.http = http
    }

    async subscribeToTopic(topic, fn) {
        this.conn = new WebSocket(`ws://${Config.BZZ_ENDPOINT}/pss/subscribe/${topic}`)
        this.conn.onmessage = fn
    }
    
    async sendJoinEvent(identity, room, data) {
        const messageRaw = {
            identity: identity,
            type: "join",
            data: data
        }
        return await this.sendRawMessage(messageRaw, room)
    }
    
    async sendMessageEvent(identity, room, data) {
        const messageRaw = {
            identity: identity,
            type: "msg",
            data: data
        }
        return await this.sendRawMessage(messageRaw, room)
    }
    
    async sendRawMessage(msg, topic){
        const response = await this.http.post(`http://${Config.BZZ_ENDPOINT}/pss/send/${topic}/ff`, msg)
    }

}
