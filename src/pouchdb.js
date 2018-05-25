import PouchDB from 'pouchdb'
import uuid from 'uuid/v4'
import { DEFAULT_AVATAR } from './utils'
export const db = new PouchDB('myDB')
PouchDB.sync('myDB', "https://e78842ad-75be-4e74-b06f-69247b06cb3c-bluemix:1e452ef4e6e845f9acd82369924595727f1ed2f225f2c6ccbc96302bbb5d1657@e78842ad-75be-4e74-b06f-69247b06cb3c-bluemix.cloudant.com/comment-board-cloud")

export function addReply(reply) {
    const newReply = {
        _id: `reply_id_${uuid()}`,
        to: reply.to,
        from: reply.from,
        belongsTo: reply.belongsTo,
        date: new Date().getTime(),
        content: reply.content
    }
    const addNewReplyPromise = db.put(newReply)
    let addReplyToBoardPromise = void 0;
    if (/board/.test(reply.to)) {
        addReplyToBoardPromise = db.get(newReply.to).then(doc => db.put({
            _id: newReply.to,
            _rev: doc._rev,
            comments: doc.comments.concat([newReply._id])
        }))
    }
    return new Promise(resolve => {
        return resolve(Promise.all([addReplyToBoardPromise, addNewReplyPromise]))
    })
}

export function addUser(user) {
    const newUser = {
        _id: `user_id_${uuid()}`,
        email: user.email,
        avatar: user.avatar ? user.avatar : DEFAULT_AVATAR 
    }
    return db.put(newUser)
}

export function getAllResources() {
    return Promise.all([
        db.allDocs({ include_docs: true, startkey: 'board', endkey: 'board\ufff0' }),
        db.allDocs({ include_docs: true, startkey: 'user', endkey: 'user\ufff0' }),
        db.allDocs({ include_docs: true, startkey: 'reply', endkey: 'reply\ufff0' }),
    ])
}
