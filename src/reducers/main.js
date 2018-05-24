import {
    INITIALIZE_BOARD_REPLY,
    SHOW_MORE_COMMENTS,
    CHANGE_REPLY_CONTENT,
    TOGGLE_REPLY_LIST,
    REPLY_TO,
    BIND_BOARD_REPLY_BOX_TO,
    INITIAL_SYNC_SUCCESS,
    CHANGE_EMAIL,
    SUBMIT_EMAIL,
    CLOSE_EMAIL_INPUTER,
    OPEN_EMAIL_INPUTER,
    SUBMIT_EMAIL_SUCCESS,
    SHOW_HINT,
    HIDE_HINT,
    SUBMIT_REPLY_SUCCESS,
    RENDER_NEW_COMMENT_TO_BOARD_TOP
} from '../actions/types'

export const INITIAL_STATE = {
    isInitialSyncSuccess: false,
    currentBoard: '',
    boardScopeReplyBoxStateSource: '', 
    commentsOnBoard: [],
    comments: {},
    emailInputer: {
        id: '',
        email: '',
        avatar: '',
        isOpen: false,
        status: 1
    },
    hint: {
        isOpen: false,
        content: ''
    }
}

export function mainReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case INITIAL_SYNC_SUCCESS:
            return Object.assign({}, state, { isInitialSyncSuccess: true })
        case SHOW_MORE_COMMENTS:
            return Object.assign({}, state, { 
                commentsOnBoard: state.commentsOnBoard.concat(action.comments),
                comments: initilizeCommentReply(state.comments, action.comments)
            })
        case RENDER_NEW_COMMENT_TO_BOARD_TOP:
            return Object.assign({}, state, {
                commentsOnBoard: [action.reply._id].concat(state.commentsOnBoard),
                comments: initilizeCommentReply(state.comments, [action.reply._id])
            })
        case INITIALIZE_BOARD_REPLY:
            return Object.assign({}, state, {
                commentsOnBoard: [],
                currentBoard: action.board._id,
                boardScopeReplyBoxStateSource: action.board._id,
                comments: initilizeCommentReply(state.comments, [action.board._id], true)
            })
        case BIND_BOARD_REPLY_BOX_TO:
            return Object.assign({}, state, { boardScopeReplyBoxStateSource: action.target})
        case SUBMIT_REPLY_SUCCESS:
        case REPLY_TO:
        case TOGGLE_REPLY_LIST:
        case CHANGE_REPLY_CONTENT:
            return Object.assign({}, state, {
                comments: Object.assign({}, state.comments, {
                    [action.target]: handleChangeReply(state.comments[action.target], action)
                })
            })
        case CHANGE_EMAIL:
        case SUBMIT_EMAIL:
        case CLOSE_EMAIL_INPUTER:
        case OPEN_EMAIL_INPUTER:
        case SUBMIT_EMAIL_SUCCESS:
            return Object.assign({}, state, { emailInputer: emailInputerReducer(state.emailInputer, action)})
        case SHOW_HINT:
        case HIDE_HINT:
            return Object.assign({}, state, { hint: hintReducer(state.hint, action)})
        default:
            return state
    }
}

//every comment/board has its comment box, initilize them accordingly
function initilizeCommentReply(origin, commentIDs, isBoard) {
    const intialPlaceHolder = isBoard ? '留言' : '评论'
    const initializedComments = commentIDs.reduce((acc, _id) => {
        acc[_id] = {
            writeReply: {
                to: _id,
                placeholder: intialPlaceHolder,
                content: ''
            },
            replyList: {
                isShowing: false
            }
        }
        return acc
    }, {})
    return Object.assign({}, origin, initializedComments)
}

function handleChangeReply(state, action) {
    switch(action.type) {
        case TOGGLE_REPLY_LIST:
            return Object.assign({}, state, { 
                replyList: Object.assign({}, state.replyList, {
                    isShowing: !state.replyList.isShowing
                })
            })
        case CHANGE_REPLY_CONTENT:
            return Object.assign({}, state, { 
                writeReply: Object.assign({}, state.writeReply, {
                    content: action.text
                })
            })
        case REPLY_TO:
            return Object.assign({}, state, { 
                writeReply: Object.assign({}, state.writeReply, {
                    placeholder: action.placeholder,
                    to: action.to,
                    content: ""
                })
            })
        case SUBMIT_REPLY_SUCCESS:
            return Object.assign({}, state, {
                writeReply: Object.assign({}, state.writeReply, { content: "" })
            })
        default:
            return state
    }
}

function emailInputerReducer(state, action) {
    switch (action.type) {
        case CHANGE_EMAIL:
            return Object.assign({}, state, { email: action.text })
        case SUBMIT_EMAIL:
            return Object.assign({}, state, { status: 0, avatar: action.avatar })
        case SUBMIT_EMAIL_SUCCESS:
            return Object.assign({}, state, { status: 2, id: action.userID })
        case CLOSE_EMAIL_INPUTER:
            return Object.assign({}, state, { isOpen: false })
        case OPEN_EMAIL_INPUTER:
            return Object.assign({}, state, { isOpen: true })
        default: 
            return state
    }
}

function hintReducer(state, action) {
    switch(action.type) {
        case SHOW_HINT:
            return Object.assign({}, state, {
                isOpen: true,
                content: action.content
            })
        case HIDE_HINT:
            return Object.assign({}, state, {
                isOpen: false,
                content: ''
            })
        default:
            return state
    }
}