import React from "react";
import styles from './index.css'
export default ({onReply}) => {
    return (
        <ul className={styles.ul}>
            <li>
                <button className={styles.btn_reply} onClick={onReply}>
                    回复
                </button>
            </li>
        </ul>     
    )
};
