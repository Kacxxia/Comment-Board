import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './hint.css'
class Hint extends Component {
  render() {
    return (
      <div className={`${styles.hint} ${this.props.isOpen ? styles.show : styles.hide}`}>
            {this.props.content}
      </div>
    )
  }
}
function mapStateToProps(state) {
    return {
        isOpen: state.main.hint.isOpen,
        content: state.main.hint.content
    }
}
export default connect(mapStateToProps)(Hint)