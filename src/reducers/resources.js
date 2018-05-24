import {
    SYNC_REDUCER_WITH_DB,
    ADD_USER_TO_REDUCER,
    ADD_REPLY_TO_REDUCER,
    ADD_COMMENT_TO_REDUCER_BOARD,
} from '../actions/types'

export const INITIAL_STATE = {
    boards: [],
    replies: [],
    users: []
}

export function resourcesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SYNC_REDUCER_WITH_DB:
            return Object.assign({
                boards: action.resources.boards,
                replies: action.resources.replies,
                users: action.resources.users
            })
        case ADD_USER_TO_REDUCER:
            return Object.assign({}, state, {
                users: state.users.concat(action.user)
            })
        case ADD_REPLY_TO_REDUCER:
            return Object.assign({}, state, {
                replies: state.replies.concat(action.reply)
            })
        case ADD_COMMENT_TO_REDUCER_BOARD:
            return Object.assign({}, state, {
                boards: addCommentToBoard(state.boards, action.reply)
            })
        default:
            return state
    }
}

function addCommentToBoard(boards, reply) {
    let index = 0
    for (let i in boards) {
        if (boards[i]._id === reply.belongsTo) {
            index = i
            break;
        }
    }
    let newBoard = Object.assign({}, boards[index], {
        comments: boards[index].comments.concat(reply._id)
    })
    return [...boards.slice(0, index), newBoard, ...boards.slice(index + 1)]
}