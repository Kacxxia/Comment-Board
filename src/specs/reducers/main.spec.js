import { INITIAL_STATE, mainReducer} from '../../reducers/main'
import { 
    SHOW_MORE_COMMENTS,
    INITIALIZE_BOARD_REPLY,
    TOGGLE_REPLY_LIST,
    CHANGE_REPLY_CONTENT,
    REPLY_TO
 } from '../../actions/types'

describe("main reducer", () => {
    it("should return initial state", () => {
        expect(mainReducer(undefined, {})).toEqual(INITIAL_STATE)
    })

    it("should handle initialize board", () => {
        const expectState = Object.assign({}, INITIAL_STATE, {
            comments: {
                board_id_1: {
                    writeReply: {
                        placeholder: "留言",
                        to:"board_id_1",
                        content: ""
                    },
                    replyList: {
                        isShowing: false
                    }
                }
            },
            currentBoard: "board_id_1",
            boardScopeReplyBoxStateSource: "board_id_1"
        })
        expect(mainReducer(undefined, {
            type: INITIALIZE_BOARD_REPLY,
            board: { _id: "board_id_1", comments: ["reply_id_1"]}
        })).toEqual(expectState)
    })

    it("should handle add more comments to render", () => {
        const expectState = Object.assign({}, INITIAL_STATE, {
            commentsOnBoard: ["reply_id_1"],
            comments: {
                reply_id_1: {
                    writeReply: {
                        to: "reply_id_1",
                        placeholder: "评论",
                        content: ""
                    },
                    replyList: {
                        isShowing: false
                    }
                }
            }
        })
        expect(mainReducer(undefined, {
            type: SHOW_MORE_COMMENTS,
            comments: ["reply_id_1"]
        })).toEqual(expectState)
    })

    it("should handle toggle target reply list showing status", () => {
        const initialState = {
            comments: {
                reply_id_1: {
                    replyList: {
                        isShowing: false
                    },
                    writeReply: {}
                }
            }
        }
        const expectState = {
            comments: {
                reply_id_1: {
                    replyList: {
                        isShowing: true
                    },
                    writeReply: {}
                }
            }
        }
        expect(mainReducer(initialState, {
            type: TOGGLE_REPLY_LIST,
            target: 'reply_id_1'
        })).toEqual(expectState)
    })

    it("should handle change target reply content", () => {
        const initialState = {
            comments: {
                reply_id_1: {
                    replyList: {
                        isShowing: false
                    },
                    writeReply: {
                        to: "回复",
                        content: "he"
                    }
                }
            }
        }
        const expectState = {
            comments: {
                reply_id_1: {
                    replyList: {
                        isShowing: false
                    },
                    writeReply: {
                        to: "回复",
                        content: "hello"
                    }
                }
            }
        }
        expect(mainReducer(initialState, {
            type: CHANGE_REPLY_CONTENT,
            target: "reply_id_1",
            text: "hello"
        })).toEqual(expectState)
    })
    it("should handle reply to", () => {
        const initial_state = {
            comments: {
                reply_id_1: {
                    writeReply: {
                        to: "reply_id_2",
                        placeholder: "回复user2@example.com",
                        content: "hello "
                    }
                }
            }
        }
        const expectState = {
            comments: {
                reply_id_1: {
                    writeReply: {
                        to: "reply_id_3",
                        placeholder: "回复user3@example.com",
                        content: ""
                    }
                }
            }
        }
        expect(mainReducer(initial_state, {
            type: REPLY_TO,
            to: "reply_id_3",
            placeholder: "回复user3@example.com",
            target: "reply_id_1"
        })).toEqual(expectState)
    })
})