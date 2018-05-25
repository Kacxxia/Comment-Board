import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import WriteReply from '../components/WriteReply'

import { changeReplyContent, submitReply } from '../actions/main'
export class ReplyBox extends Component {
  render() {
    return (
        <WriteReply 
            replyState={this.props.writeReplyState}
            onChangeReplyContent={(text) => this.props.onChangeReplyContent(this.props.bindStateTo, text)}
            belongsToBoard={this.props.belongsToBoard}
            bindStateTo={this.props.bindStateTo}
            onSubmitReply={() => this.props.onSubmitReply(
                this.props.bindStateTo, 
                this.props.writeReplyState.content,
                this.props.writeReplyState.to
            )}
        />
    )
  }
}
export const getBindingStateSource = (state, props) => props.bindStateTo
export const getAllReplyBoxState = state => state.main.comments
export const getBindingReplyState = createSelector(
    [getAllReplyBoxState, getBindingStateSource],
    (allState, source) => allState[source].writeReply
)
function mapStateToProps(state, props) {
    return {
        writeReplyState: getBindingReplyState(state, props)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeReplyContent: (target, text) => dispatch(changeReplyContent(target, text)),
        onSubmitReply: (belongsTo, content, to ) => dispatch(submitReply(belongsTo, content, to))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyBox)