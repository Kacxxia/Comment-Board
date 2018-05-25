import React from 'react'
import { shallow } from 'enzyme'

import { App } from '../../containers/app'
import ReplyBox from '../../containers/reply-box'
import CommentBox from '../../containers/comment-box'
import EmailInputer from '../../containers/email-inputer'
import Hint from '../../containers/hint'

import { NoCommentYet } from '../../components/NoCommentYet/'
import Loading from '../../components/Loading'

describe("Container <App /> ", () => {
    const props = {
        boards: [{_id: "board_id_1", comments: ["reply_id_1", "reply_id_2", "reply_id_3"]}],
		commentsOnBoard: ["reply_id_1", "reply_id_2"],
		currentBoard: "board_id_1",
        boardScopeReplyBoxStateSource: "board_id_1",
        isInitialSyncSuccess: true
    }
    const propsWithInitialZeroCommentsToRender = Object.assign({}, props, { commentsOnBoard: []})
    let wrapper
    it("should only render <Loading /> when reducer hasn't synced with remote db", () => {
        wrapper = shallow(<App isInitialSyncSuccess={false} />)
        expect(wrapper.find(Loading)).toHaveLength(1)
    })

    it("should render <NoCommentYet /> when there is no comment on board to render", () => {
        wrapper = shallow(<App {...propsWithInitialZeroCommentsToRender} />)
        expect(wrapper.find(NoCommentYet)).toHaveLength(1)
    })

    it("should render two <CommentBox /> when board has two comments", () => {
        wrapper = shallow(<App {...props} />)
        expect(wrapper.find(CommentBox)).toHaveLength(2)
    })

    it("should also render <ReplyBox />, <EmailInputer />, <Hint /> if reducer has synced with remote db", () => {
        wrapper = shallow(<App {...propsWithInitialZeroCommentsToRender}/>)
        expect(wrapper.find(ReplyBox)).toHaveLength(1)
        expect(wrapper.find(EmailInputer)).toHaveLength(1)
        expect(wrapper.find(Hint)).toHaveLength(1)
    })
})
