import React from 'react'
import styles from './index.css'
export default ({style}) => {
  return (
    <div className={styles.container} style={style}>
        <div className={styles.loading} style={style}></div>
    </div>
  )
}
