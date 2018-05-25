import React from "react";
import styles from './index.css'
import { onEnterWrapper } from '../../utils'
export default   ({ 
    replyState, 
    onChangeReplyContent,
    belongsToBoard,
    bindStateTo, 
    onSubmitReply
}) => {
	const belongsToBoardClass = belongsToBoard ? styles['belongsToBoard'] : styles.container
    return (
        <div className={belongsToBoardClass} >
            <textarea 
                type="text" 
                onChange={e => onChangeReplyContent(e.target.value)} 
                value={replyState.content}
                placeholder={replyState.placeholder}
                data-id={`reply-box-${bindStateTo}`}
                onKeyPress={onEnterWrapper(() => onSubmitReply())}
            >
            </textarea>
			<button className={styles.submit} onClick={onSubmitReply}>提交</button>
        </div>
    );
};
