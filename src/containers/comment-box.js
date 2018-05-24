import React, { Component } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import Comment from '../components/Comment'

import { replyTo, toggleReplyList } from '../actions/main' 
export class CommentBox extends Component {
  render() {
      const { commentID } = this.props
    return (
        <Comment
            commentID={commentID}
            self={this.props.self}
            replyList={this.props.replyList}
            isReplyListShowing={this.props.isReplyListShowing}
            onReplyToThisComment={this.props.onReplyTo.bind(null, commentID, commentID, `回复@: ${this.props.self.user.email}`)}
            onReplyToReply={(to, email) => this.props.onReplyTo(commentID, to, `回复@: ${email}`)}
            onToggleReplyList={this.props.onToggleReplyList}
        />
    )
  }
}

export const getAllReplies = state => state.resources.replies
export const getAllUsers = state => state.resources.users
export const getAllCommentsOnScreen = state => state.main.comments
export const getCommentID = (state, props) => props.commentID
export const selfSelector = createSelector(
    [getAllReplies, getCommentID, getAllUsers],
    (allRelies, commentID, users) => {
        const self = allRelies.find(reply => reply._id === commentID)
        return AddUserInfoToReply([self], users)[0]
    })

export const replyListSelector = createSelector(
    [getAllReplies, getCommentID, getAllUsers],
    (allRelies, commentID, users) => {
        const filtered = allRelies.filter(reply => reply.belongsTo === commentID)
        return AddUserInfoToReply(filtered, users)
    }
)
export const replyListShowingStatus = createSelector(
    [getAllCommentsOnScreen, getCommentID],
    (allCommentsOnScreen, commentID) => allCommentsOnScreen[commentID].replyList.isShowing
)

export function AddUserInfoToReply(replyList, users) {
    return replyList.map(reply => {
        const targetReply = replyList.find(targetR => targetR._id === reply.to)
        reply.user = users.find((user) => user._id === reply.from) // add sender's self info to reply

        if (targetReply) {  //when userA reply to userB in same comment
            //add userB info to userA's reply   
            reply.toUser = users.find((user) => user._id === targetReply.from)
        }
        return reply
    })
}

function mapStateToProps(state, props) {
    return {
        isReplyListShowing: replyListShowingStatus(state, props),        
        replyList: replyListSelector(state, props),
        self: selfSelector(state, props)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onReplyTo: (target, to, placeholder) => dispatch(replyTo(target, to, placeholder)),
        onToggleReplyList: (target) => dispatch(toggleReplyList(target))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CommentBox)

