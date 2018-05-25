import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as mainActions from '../../actions/main'
import * as types from '../../actions/types'



describe('main sync actions', () => {

    //showMoreComments()
    it("should create an action to add more comments(comments' id) to reducer for rendering ", () => {
        const comments = ['reply_id_1', 'reply_id_2']
        const expectAction = {
            type: types.SHOW_MORE_COMMENTS,
            comments
        }
        expect(mainActions.showMoreComments(comments)).toEqual(expectAction)
    })

    //changeReplyContent()
    it("should create an action to reducer for changing target comment/reply's corresponding reply content ", () => {
        const target = 'reply_id_1'
        const text = 'Agreed'
        const expectAction = {
            type: types.CHANGE_REPLY_CONTENT,
            target: target,
            text
        }
        expect(mainActions.changeReplyContent(target, text)).toEqual(expectAction)
    })

    //toggleReplyList()
    it("should create an action to reducer for toggling target comment's reply list showing status", () => {
        const target = 'reply_id_2'
        const expectAction = {
            type: types.TOGGLE_REPLY_LIST,
            target
        }
        expect(mainActions.toggleReplyList(target)).toEqual(expectAction)
    })

})

// describe("syncReducerWithDBThenGetSomeCommentsToRender()", () => {
//     const mockStore = configureStore([thunk])
//     const initialState = {resources: mainActions.mock_state}
//     let store

//     beforeEach(() => {
//         store = mockStore(initialState)
//     })

//     //syncReducerWithDBThenGetSomeCommentsToRender()
//     it("should first dispatch sync action then initilize first board then dispatch showMoreComments action", () => {
//         const commentsToRender = mainActions.mock_state.boards[0].comments.slice(0, mainActions.INITIAL_RENDERED_COMMENTS)
//         return store.dispatch(mainActions.syncReducerWithDBThenGetSomeCommentsToRender())
//             .then(() => {
//                 const actions = store.getActions()
                
//                 expect(actions[0]).toEqual(mainActions.syncReducerWithDB(mainActions.mock_state))
//                 expect(actions[1]).toEqual(mainActions.initializeBoardReply(mainActions.mock_state.boards[0]))
//                 expect(actions[2]).toEqual(mainActions.showMoreComments(commentsToRender))
//             })
//     })

//     //syncReducerWithDBThenGetSomeCommentsToRender(boardID)
//     it("should first dispatch sync action then initialize specific board then dispatch showMoreComments action", () => {
//         const boardID = "board_id_2"
//         const targetBoard = mainActions.mock_state.boards.filter(board => board._id === boardID)[0]
//         const commentsToRender = targetBoard.comments.slice(0, mainActions.INITIAL_RENDERED_COMMENTS)
//         return store.dispatch(mainActions.syncReducerWithDBThenGetSomeCommentsToRender(boardID))
//             .then(() => {
//                 const actions = store.getActions()
                
//                 expect(actions[0]).toEqual(mainActions.syncReducerWithDB(mainActions.mock_state))
//                 expect(actions[1]).toEqual(mainActions.initializeBoardReply(targetBoard))
//                 expect(actions[2]).toEqual(mainActions.showMoreComments(commentsToRender))
//             })
//     })
//     //syncReducerWithDBThenGetSomeCommentsToRender(boardIDNotExist)
//     it("should first dispatch sync action then initialize first board in replace of undefined board then dispatch showMoreComments action", () => {
//         const boardIDNotExist = "not_exist"
//         const targetBoard = mainActions.mock_state.boards[0]
//         const commentsToRender = targetBoard.comments.slice(0, mainActions.INITIAL_RENDERED_COMMENTS)
//         return store.dispatch(mainActions.syncReducerWithDBThenGetSomeCommentsToRender(boardIDNotExist))
//             .then(() => {
//                 const actions = store.getActions()
                
//                 expect(actions[0]).toEqual(mainActions.syncReducerWithDB(mainActions.mock_state))
//                 expect(actions[1]).toEqual(mainActions.initializeBoardReply(targetBoard))
//                 expect(actions[2]).toEqual(mainActions.showMoreComments(commentsToRender))
//             })
//     })
    
// })

// describe("replyTo()", () => {
//     const mockStore = configureStore([thunk])
//     const target = "reply_id_1",
//         to = "user_id_1",
//         placeholder = "回复@: user1@example.com"
//     let store
//     beforeEach(() => {
//         store = mockStore()
//     })

//     it("should only dispatch updateReplyBox action when window size >= 576", () => {
//         store.dispatch(mainActions.replyTo(target, to, placeholder))      
//         const actions = store.getActions()
//         expect(actions[0]).toEqual(mainActions.updateReplyBox(target, to, placeholder))
//     })
//     it("should dispatch action bindBoardReplyBoxTo then updateReplyBox when window size < 576", () => {
//         global.innerWidth = 414
//         store.dispatch(mainActions.replyTo(target, to, placeholder))
//         const actions = store.getActions()
//         expect(actions[0]).toEqual(mainActions.bindBoardReplyBoxTo(target))
//         expect(actions[1]).toEqual(mainActions.updateReplyBox(target, to, placeholder))
//     })
// })