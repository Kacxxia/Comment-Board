import md5 from 'md5'
import { 
    SYNC_REDUCER_WITH_DB,
    ADD_USER_TO_REDUCER,
    ADD_REPLY_TO_REDUCER,
    ADD_COMMENT_TO_REDUCER_BOARD,
    RENDER_NEW_COMMENT_TO_BOARD_TOP,
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
    SUBMIT_REPLY_SUCCESS,
    SHOW_HINT,
    HIDE_HINT
} from './types'

import { flatArray } from '../utils'

import * as database from '../pouchdb'

import { DEFAULT_AVATAR, GRAVATAR_BASE, xssEscape, validEmailPattern } from '../utils'
export const INITIAL_RENDERED_COMMENTS = 5


export const mock_state = {
    boards: [
        {
            _id: "board_id_1",
            comments: ["reply_id_1"]
        },
        {
            _id: "board_id_2",
            comments: ["reply_id_4"]
        }
    ],
    users: [
        {
            _id: "user_id_1",
            avatar: DEFAULT_AVATAR,
            email: "email1@example.com"
        },
        {
            _id: "user_id_2",
            avatar: DEFAULT_AVATAR,
            email: "email2@example.com"
        }
    ],
    replies: [
        {
            _id: "reply_id_1",
            belongsTo: "board_id_1",            
            to: "board_id_1",
            from: "user_id_1",
            date: 1526726589038,
            content: "Hello board 1"
        },
        {
            _id: "reply_id_2",
            belongsTo: "reply_id_1",
            to: "reply_id_1",
            from: "user_id_1",
            date: 1526726590000,
            content: "Hello comment 1 in board 1"
        },
        {
            _id: "reply_id_3",
            belongsTo: "reply_id_1",
            to: "reply_id_2",
            from: "user_id_2",
            date: 1526726689038,
            content: "Hello reply 2 in comment 1"
        },
        {
            _id: "reply_id_4",
            belongsTo: "board_id_2",
            to: "board_id_2",
            from: "user_id_2",
            date: 1526726689038,
            content: "Hello board 2"
        },
        {
            _id: "reply_id_5",
            belongsTo: "reply_id_4",
            to: "reply_id_4",
            from: "user_id_1",
            date: 1526726690000,
            content: "Hello comment 4 in board 2"
        },
        {
            _id: "reply_id_6",
            belongsTo: "board_id_4",
            to: "board_id_4",
            from: "user_id_2",
            date: 1526726800000,
            content: "Hello comment 4 in board 2"
        }
    ]
}
let cachedData = {}
export function tryInitializeReducerWithDB() {
    return dispatch => {
        fetchDB().then(result => {
            let flattened = flatArray(result)
            let allResourceCount = flattened.reduce((acc, re) => {
                acc += re.total_rows
                return acc
            }, 0)
            if (allResourceCount) {
                flattened.forEach(re => { cachedData[re._id] = true })
                database.db.changes({ live: true, since: "now", include_docs: true}).on('change', (change) =>{
                    if (!cachedData[change.id])  dispatch(updateReducer(change))
                  }).on('error', console.log.bind(console))
                dispatch(syncReducerWithDBThenGetSomeCommentsToRender())
            }
        })
    }
}

export function fetchDB() {
    return database.getAllResources()
}

export function syncReducerWithDB(resources) {
    return {type: SYNC_REDUCER_WITH_DB, resources}
}

export function initializeBoardReply(board) {
    return { type: INITIALIZE_BOARD_REPLY, board }
}

export function showMoreComments(comments) {
    return {
        type: SHOW_MORE_COMMENTS,
        comments
    }
}
export function shouldShow() {
	let scroller = document.getElementById('appBody')
	const rootFontSize = parseInt(getComputedStyle(document.documentElement)['fontSize'], 10)
	return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 4 * rootFontSize
}
export function showMoreCommentsOnScroll(boards, currentBoard, commentsOnBoard) {
    return dispatch => {
        const board = boards.find(b => b._id === currentBoard)
        if (shouldShow()) {
            const newAddedBoards = board.comments.slice(commentsOnBoard.length, commentsOnBoard.length + 3)
            dispatch(showMoreComments(newAddedBoards))
        }
    }
}
export function initialSyncSuccess() {
    return { type: INITIAL_SYNC_SUCCESS }
}
function ifBoardIDReturnTargetBoardElseReturnFirst(boards, boardID) {
    if (!boardID) return boards[0]
    const target = boards.filter(board => board._id === boardID)
    return target.length ? target[0] : boards[0]
}
function formatDBResource(results) {
    let mapV = {
        0: 'boards',
        1: 'users',
        2: 'replies'
    }
    return results.reduce((acc, r, index) => {
        acc[mapV[index]] = r.rows.map((row) => row.doc)
        return acc
    }, { })
}
export function syncReducerWithDBThenGetSomeCommentsToRender(boardID) {
    return (dispatch, getState) => {
        return fetchDB().then(formatDBResource).then((resources) => {
            dispatch(syncReducerWithDB(resources))

            const initial_board = ifBoardIDReturnTargetBoardElseReturnFirst(resources.boards, boardID)
            
            dispatch(initializeBoardReply(initial_board))

            return Promise.resolve(initial_board.comments.slice(0, INITIAL_RENDERED_COMMENTS))
        }).then(commentsTobeRendered => {
            dispatch(showMoreComments(commentsTobeRendered))
            dispatch(initialSyncSuccess())
        })
    }
}
export function addUserToReducer(user) {
    return {
        type: ADD_USER_TO_REDUCER,
        user
    }
}
export function addReplyToReducer(reply) {
    return {
        type: ADD_REPLY_TO_REDUCER,
        reply
    }
}
export function addCommentToReducerBoard(reply) {
    return dispatch => {
        dispatch({ type: ADD_COMMENT_TO_REDUCER_BOARD, reply})
        return Promise.resolve(null)
    }
}
export function renderNewCommentToBoardTop(reply) {
    return { type: RENDER_NEW_COMMENT_TO_BOARD_TOP, reply }
}
export function addReplyToReducerOrIfComment(reply) {
    return dispatch => {
        dispatch(addReplyToReducer(reply))
        if (reply.belongsTo.indexOf("board") === 0) {
            dispatch(addCommentToReducerBoard(reply))
            .then(() => {
                dispatch(renderNewCommentToBoardTop(reply))
            })
        }
    }
}
export function updateReducer(change) {
    //Todo: add-board change
    return dispatch => {
        if (change.id.indexOf("user") === 0) {
            dispatch(addUserToReducer(change.doc))
        }

        if (change.id.indexOf("reply") === 0) {
            dispatch(addReplyToReducerOrIfComment(change.doc))
        }
    }
}


export function changeReplyContent(target, text) {
    return {
        type: CHANGE_REPLY_CONTENT,
        target,
        text
    }
} 

export function submitReply(belongsTo, content, to) {
    return (dispatch, getState) => {
        const { email, id } = getState().main.emailInputer
        if (!email) {
            dispatch(openEmailInputer())
            document.querySelector('[data-id=email-inputer').focus()
        } else {
            database.addReply({
                to,
                content: xssEscape(content),
                belongsTo,
                from: id
            }).then(() => {
                dispatch(submitReplySuccess(belongsTo))
                dispatch(showHintThenHide('发送成功', 1500))
            })
        }
    }
}

export function submitReplySuccess(belongsTo) {
    return {
        type: SUBMIT_REPLY_SUCCESS,
        target: belongsTo
    }
}

export function showHintThenHide(content, duration) {
    return dispatch => {
        dispatch(showHint(content))
        setTimeout(dispatch, duration, hideHint())
    }
}

export function showHint(content) {
    return {
        type: SHOW_HINT,
        content
    }
}

export function hideHint() {
    return {
        type: HIDE_HINT
    }
}

export function toggleReplyList(target) {
    return {
        type: TOGGLE_REPLY_LIST,
        target
    }
}

export function bindBoardReplyBoxTo(target) {
    return {
        type: BIND_BOARD_REPLY_BOX_TO,
        target
    }
}

export function updateReplyBox(target, to, placeholder) {
    return {
        type: REPLY_TO,
        target,
        to,
        placeholder
    }
}

export function replyTo(target, to, placeholder) {
    //todo  focus, in componentDidUpdate
    return dispatch => {
        if (window.innerWidth < 576) {
            dispatch(bindBoardReplyBoxTo(target))
        }
        dispatch(updateReplyBox(target, to, placeholder))
        document.querySelector(`[data-id=reply-box-${target}`).focus()
    }
}

export function changeEmail(text) {
    return {
        type: CHANGE_EMAIL,
        text
    }
}
export function submitEmail(avatar) {
    return {
        type: SUBMIT_EMAIL,
        avatar
    }
}
export function submitEmailSuccess(userID) {
    return {
        type: SUBMIT_EMAIL_SUCCESS,
        userID
    }
}
export function onSubmitEmail() {
    return (dispatch, getState) => {
        const email = getState().main.emailInputer.email.trim().toLowerCase()
        if (!validEmailPattern.test(email)) return dispatch(showHintThenHide('邮箱格式错误', 1500))
        const hash = md5(email)
        const avatarURL = GRAVATAR_BASE.concat(hash)
        dispatch(submitEmail(avatarURL))
        database.addUser({ email, avatar: avatarURL}).then((result) => {
            setTimeout(dispatch, 800, submitEmailSuccess(result.id))
        })
    }
}
export function closeEmailInputer() {
    return {
        type: CLOSE_EMAIL_INPUTER
    }
}
export function openEmailInputer() {
    return {
        type: OPEN_EMAIL_INPUTER
    }
}

// export function syncDBUsers(users) {
//     return {
//         type: SYNC_REDUCER_WITH_DB_
//     }
// }