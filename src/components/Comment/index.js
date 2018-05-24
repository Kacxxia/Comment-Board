import React from 'react'

import styles from './index.css'

import ReplyBox from '../../containers/reply-box'
import Reply from '../Reply'
import ToolBar from '../ToolBar'
export const Comment = ({
    commentID,
    replyList,
    self,
    isReplyListShowing,
    onReplyToThisComment,
    onReplyToReply,
    onToggleReplyList
}) => {

    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <div className={styles.header}>
                    <img className={styles.avatar} alt="avatar" src={self.user.avatar}/>
                    <span className={styles.email}>{self.user.email}</span>
                    <span className={styles.date}>{self.date}</span>
                    <div className={styles.toolbar_container}>
                        <ToolBar onReply={onReplyToThisComment} />                        
                    </div>
                </div>
                <div className={styles.content}>
                    {self.content}
                </div>
                <div className={styles.reply_list_container}>
                    <button className={styles.toggle_reply_list} onClick={onToggleReplyList.bind(null, commentID)}>查看回复({replyList.length})</button>
                    <div className={`${styles.reply_list} ${styles[`showing_${isReplyListShowing}`]}`}>
                        {replyList.map(reply => <Reply reply={reply} onReplyToReply={onReplyToReply} key={reply._id} commentID={commentID}/>)}
                    </div>                
                </div>
            </div>
            <div className="invisible-sm">
                <ReplyBox bindStateTo={commentID} />
            </div>
        </div>
    )
}

export default Comment