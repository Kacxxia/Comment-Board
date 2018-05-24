import React from "react";
import styles from "./index.css";
import ToolBar from '../ToolBar'
export default ({ reply, onReplyToReply, commentID }) => {
	const prefix = reply.to === commentID ? '' : `回复 ${reply.toUser.email}:`
    return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.toolbar_container}>
					<ToolBar onReply={() => onReplyToReply(reply._id, reply.user.email)} />
				</div>
				<img className={styles.avatar} src={reply.user.avatar} alt="avatar" />
				<span className={styles.email}>{reply.user.email}</span>
				<span className={styles.date}>{reply.date}</span>\
			</div>
			<div className={styles.content}>
				<div className={styles.content_prefix}>
					{prefix}
				</div>
				{reply.content}
			</div>
		</div>
	)
};
