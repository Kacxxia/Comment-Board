import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './email-inputer.css'
import { changeEmail, onSubmitEmail, closeEmailInputer } from '../actions/main'
import { onEnterWrapper } from '../utils'
class EmailInputer extends Component {
  render() {
    return (
      <div className={`${styles.container} ${this.props.isOpen ? '' : styles.hide }`}>
        <div className={`${styles.carousel} ${this.props.status !== 2 ? '' : styles.leftTranslate}`}>
            <div className={styles.step_1}>
                <div className={styles.header}>
                    <button className={`${styles.icon} ${styles.cross}`} onClick={this.props.onClose}>&#x2716;</button>
                    <h2>请输入邮箱</h2>
                    <span>你的头像会根据邮箱到Gravatar上获取</span>
                </div>
                <div className={styles.body}>
                        <input 
                            type="email" 
                            className={styles.input} 
                            onChange={(e) => this.props.onChangeEmail(e.target.value)}
                            onKeyPress={onEnterWrapper(this.props.onSubmitEmail)}
                            data-id="email-inputer"
                            />
                        <div className={`${styles.loading} ${!this.props.status ? styles.show : ''}`}></div>
                        <input type="submit" onClick={this.props.onSubmitEmail} className={styles.btn_email_submit} value="确认" />
                </div>
            </div>
            <div className={styles.step_2}>
                <img src={this.props.avatar} alt="userAvatar" className={styles.avatar}/>
                <h2>欢迎你</h2>
                <span>现在开始发言吧</span>
                <button onClick={this.props.onClose} className={`${styles.cancel} ${styles.icon}`}>&#x2714;</button>
            </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        email: state.main.emailInputer.email,
        isOpen: state.main.emailInputer.isOpen,
        avatar: state.main.emailInputer.avatar,
        status: state.main.emailInputer.status
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeEmail: (value) => dispatch(changeEmail(value)),
        onSubmitEmail: () => dispatch(onSubmitEmail()),
        onClose: () => dispatch(closeEmailInputer())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmailInputer)
