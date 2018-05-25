import React from 'react'
import { shallow } from 'enzyme'

import { ReplyBox, getBindingReplyState, getAllReplyBoxState, getBindingStateSource } from '../../containers/reply-box'
import WriteReply from '../../components/WriteReply'
describe("Container <ReplyBox />", () => {
    const state = {
        main: {
            comments: {
                reply_id_1: {
                    writeReply: {
                        target: "reply_id_1",
                        to: "reply_id_1",
                        content: "hello comment 1"
                    }
                },
                reply_id_2: {
                    writeReply: {
                        target: "reply_id_2",
                        to: "reply_id_2",
                        content: "hello comment 2"
                    }
                }
            }
        },
        resources: {}
    }
    const props = {
        bindStateTo: "reply_id_2"
    }
    it("should do basic selecting correctly", () => {
        expect(getBindingStateSource(state, props)).toBe(props.bindStateTo)
        expect(getAllReplyBoxState(state)).toEqual(state.main.comments)
    })

    it("should filter out bindding reply state", () => {
        expect(getBindingReplyState(state, props)).toEqual(state.main.comments["reply_id_2"].writeReply)
    })


    it("should render one <WriteReply />", () => {
        const wrapper = shallow(<ReplyBox />)
        expect(wrapper.find(WriteReply)).toHaveLength(1)
    })

})