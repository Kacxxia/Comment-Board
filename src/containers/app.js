import React, { Component } from 'react';
import { connect } from 'react-redux'

import { 
	changeReplyContent, 
	toggleReplyList,
	replyTo,
	syncReducerWithDBThenGetSomeCommentsToRender,
	showMoreCommentsOnScroll,
	tryInitializeReducerWithDB
} from '../actions/main'

import CommentBox from './comment-box.js'
import ReplyBox from './reply-box.js'
import EmailInputer from './email-inputer'
import Hint from './hint'

import NoCommentYet from '../components/NoCommentYet/'
import Loading from '../components/Loading/'

// import { throttle } from '../utils'

import { throttle } from 'lodash'

import styles from './app.css'

export class App extends Component {
	constructor(props) {
		super(props)
		this.state = {dbResourceGetter: null}
	}
	componentWillUpdate() {
		if(this.state.dbResourceGetter) {
			clearInterval(this.state.dbResourceGetter)
			this.setState({dbResourceGetter: null})
		}
	}
	componentDidMount() {
		const t = setInterval(this.props.onTryInitializeReducerWithDB, 200)
		this.setState({dbResourceGetter: t})
	}
	render() {
		if (!this.props.isInitialSyncSuccess) return <Loading />
		const commentList = this.props.commentsOnBoard.length ? 
			this.props.commentsOnBoard.map(commentID => {
				return <CommentBox 
							key={commentID}
							commentID={commentID}							
						/>

			}) : <NoCommentYet />
		return (
			<div className={styles.container} id="app" ref={this.appContainer}>
				<div className={styles.body} id="appBody" onScroll={() => this.props.onShowMoreComments(this.props.boards, this.props.currentBoard, this.props.commentsOnBoard)}>
					{commentList}
				</div>
				<ReplyBox bindStateTo={this.props.boardScopeReplyBoxStateSource} belongsToBoard={true}	/>
				<EmailInputer />
				<Hint />
			</div>
		)
  	}
}


function mapStateToProps(state) {
	return {
		boards: state.resources.boards,
		commentsOnBoard: state.main.commentsOnBoard,
		currentBoard: state.main.currentBoard,
		boardScopeReplyBoxStateSource: state.main.boardScopeReplyBoxStateSource,
		isInitialSyncSuccess: state.main.isInitialSyncSuccess
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onchangeReplyContent: (targetCommentId, text) => dispatch(changeReplyContent(targetCommentId, text)),
		onToggleReplyList: (targetCommentId) => dispatch(toggleReplyList(targetCommentId)),
		onReplyTo: (targetCommentId, targetUserId) => dispatch(replyTo(targetCommentId, targetUserId)),
		onSyncReducerWithDBThenGetSomeCommentsToRender: () => dispatch(syncReducerWithDBThenGetSomeCommentsToRender()),
		onShowMoreComments: throttle((boards, currentBoard, commentsOnBoard) => dispatch(showMoreCommentsOnScroll(boards, currentBoard, commentsOnBoard), 1000, { leading: false })),
		onTryInitializeReducerWithDB: () => dispatch(tryInitializeReducerWithDB())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

