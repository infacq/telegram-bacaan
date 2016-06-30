'use strict'

const User = require('./User')
const Message = require('./Message')

/**
 * This object represents an incoming callback query from a callback button in an inline keyboard. If the button that originated the query was attached to a message sent by the bot, the field message will be presented. If the button was attached to a message sent via the bot (in inline mode), the field inline_message_id will be presented.
 */

class CallbackQuery {
   /**
    *
    * @param {string} id
    * @param {User} from
    * @param {Message|null} [message]
    * @param {string|null} [inlineMessageId]
    * @param {string} data
   */
   constructor(id, from, message, inlineMessageId, data) {
       this._id = id
       this._from = from
       this._message = message
       this._inlineMessageId = inlineMessageId
       this._data = data
   }

   /**
    * Unique identifier for this query
    * @returns {string}
   */
   get id() {
       return this._id
   }

   /**
    * Sender
    * @returns {User}
   */
   get from() {
       return this._from
   }

   /**
    * Message with the callback button that originated the query. Note that message content and message date will not be available if the message is too old
    * @returns {Message|null}
   */
   get message() {
       return this._message
   }

   /**
    * Identifier of the message sent via the bot in inline mode, that originated the query
    * @returns {string|null}
   */
   get inlineMessageId() {
       return this._inlineMessageId
   }

   /**
    * Data associated with the callback button. Be aware that a bad client can send arbitrary data in this field
    * @returns {string}
   */
   get data() {
       return this._data
   }

   /**
    *
    * @param {Object} raw
    * @returns {CallbackQuery}
    */
   static deserialize(raw) {
      return new CallbackQuery(
          raw['id'], 
          raw['from'] ? User.deserialize(raw['from']) : null, 
          raw['message'] ? Message.deserialize(raw['message']) : null, 
          raw['inline_message_id'] ? raw['inline_message_id'] : null, 
          raw['data']
      )
   }

   /**
    *
    * @returns {Object}
    */
   serialize() {
      return { 
          id: this.id ? this.id : undefined, 
          from: this.from ? this.from.serialize() : undefined, 
          message: this.message ? this.message.serialize() : undefined, 
          inline_message_id: this.inlineMessageId ? this.inlineMessageId : undefined, 
          data: this.data ? this.data : undefined
      }
   }

   /**
    *
    * @returns {string}
    */
   toJSON() {
      return this.serialize()
   }
}

module.exports = CallbackQuery