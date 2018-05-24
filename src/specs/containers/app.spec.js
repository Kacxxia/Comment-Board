import React from 'react'
import { shallow } from 'enzyme'

import { App } from '../../containers/app'
import ReplyBox from '../../containers/reply-box'
import CommentBox from '../../containers/comment-box'
import { NoCommentYet } from '../../components/NoCommentYet'
describe("Container <App />", () => {
    const props = {
        boards: [{_id: "board_id_1", comments: ["reply_id_1", "reply_id_2", "reply_id_3"]}],
		commentsOnBoard: ["reply_id_1", "reply_id_2"],
		currentBoard: "board_id_1",
		boardScopeReplyBoxStateSource: "board_id_1"
    }
    const propsWithInitialZeroCommentsToRender = Object.assign({}, props, { commentsOnBoard: []})
    

    it("should render two comment boxes", () => {
        const wrapper = shallow(<App {...props} />)
        expect(wrapper.find(CommentBox)).toHaveLength(2)
    })

    it("should render <NoCommentYet />", () => {
        const wrapper = shallow(<App {...propsWithInitialZeroCommentsToRender} />)
        expect(wrapper.find(NoCommentYet)).toHaveLength(1)
    })


    it("should render comment box with props", () => {
        const expectProps = {
            commentID: "reply_id_2",
        }
        const wrapper = shallow(<App {...props} />)
        expect(wrapper.find(CommentBox).at(1).props()).toEqual(expectProps)
    })

    it("should render one reply box", () => {
        const wrapper = shallow(<App {...props} />)
        expect(wrapper.find(ReplyBox)).toHaveLength(1)
    })

    it("should render reply box with props", () => {
        const expectProps = {
            bindStateTo: "board_id_1"
        }
        const wrapper = shallow(<App {...props} />)
        expect(wrapper.find(ReplyBox).props()).toEqual(expectProps)
    })

})
