import React from 'react'
import { shallow } from 'enzyme'

import { 
    CommentBox,
    getAllReplies,
    getAllUsers,
    getCommentID,
    getAllCommentsOnScreen,
    selfSelector,
    replyListSelector,
    replyListShowingStatus,
    AddUserInfoToReply
} from '../../containers/comment-box'

import Comment from '../../components/Comment'

describe("Container <CommentBox />", () => {
    const state = {
        main: {
            comments: {
                reply_id_1: {
                    writeReply: {
                        target: "reply_id_1",
                        to: "reply_id_1",
                        content: "hello comment 1"
                    },
                    replyList: {
                        isShowing: false
                    }
                },
                reply_id_2: {
                    writeReply: {
                        target: "reply_id_2",
                        to: "reply_id_2",
                        content: "hello comment 2"
                    },
                    replyList: {
                        isShowing: true
                    }
                }
            }
        },
        resources: {
            users: [
                {
                    _id: "user_id_1",
                    email: "user1@example.com",
                    avatar: "https://avatar.com/user1"
                },
                {
                    _id: "user_id_2",
                    email: "user2@example.com",
                    avatar: "https://avatar.com/user2"
                }
            ],
            replies: [
                {
                    _id: "reply_id_1",
                    from: "user_id_1",
                    belongsTo: "board_id_1",
                    content: "hello board 1",
                    date: 30288809992
                },
                {
                    _id: "reply_id_2",
                    from: "user_id_2",
                    belongsTo: "reply_id_1",
                    content: "hello reply 1",
                    date: 30288823133
                }
            ]
        }
    }
    const props = {
        commentID: "reply_id_1"
    }
    const connectedProps = Object.assign({}, props, {
        isReplyListShowing: replyListShowingStatus(state, props),        
        replyList: replyListSelector(state, props),
        self: selfSelector(state, props),
        onReplyTo: function replyTo() {}
    })
    const wrapper = shallow(<CommentBox {...connectedProps}/>)
    

    it("should do basic selecting correctly", () => {
        expect(getAllReplies(state)).toEqual(state.resources.replies)
        expect(getAllUsers(state)).toEqual(state.resources.users)
        expect(getAllCommentsOnScreen(state)).toEqual(state.main.comments)
        expect(getCommentID(state, props)).toEqual(props.commentID)
    })
    it("should add user info to reply list", () => {
        const expectResult = [
            {
                _id: "reply_id_1",
                from: "user_id_1",
                belongsTo: "board_id_1",
                content: "hello board 1",
                date: 30288809992,
                user: {
                    _id: "user_id_1",
                    email: "user1@example.com",
                    avatar: "https://avatar.com/user1"
                }
            },
            {
                _id: "reply_id_2",
                from: "user_id_2",
                belongsTo: "reply_id_1",
                content: "hello reply 1",
                date: 30288823133,
                user: {
                    _id: "user_id_2",
                    email: "user2@example.com",
                    avatar: "https://avatar.com/user2"
                
                }
            }
        ]
        expect(AddUserInfoToReply(state.resources.replies, state.resources.users)).toEqual(expectResult)
    })

    it("should filter related reply list showing status", () => {
        expect(replyListShowingStatus(state, props)).toBe(false)
    })
    
    it("should filter current comment with user info added", () => {
        const expectResult = {
            _id: "reply_id_1",
            from: "user_id_1",
            belongsTo: "board_id_1",
            content: "hello board 1",
            date: 30288809992,
            user: {
                _id: "user_id_1",
                email: "user1@example.com",
                avatar: "https://avatar.com/user1"
            }
        }
        expect(selfSelector(state, props)).toEqual(expectResult)
    })

    it("should filter relevant replies with user info added", () => {
        const expectResult = [
            {
                _id: "reply_id_2",
                from: "user_id_2",
                belongsTo: "reply_id_1",
                content: "hello reply 1",
                date: 30288823133,
                user: {
                    _id: "user_id_2",
                    email: "user2@example.com",
                    avatar: "https://avatar.com/user2"
                
                }
            }
        ]
        expect(replyListSelector(state, props)).toEqual(expectResult)
    })

    it("should render one <Comment />", () => {
        expect(wrapper.find(Comment)).toHaveLength(1)
    })
})