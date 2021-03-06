import React from "react"
import PropTypes from "prop-types"
import invariant from "invariant"

/**
 * A <Subscriber> pulls the value for a channel off of context.broadcasts
 * and passes it to its children function.
 */
class Subscriber extends React.Component {
  static propTypes = {
    channel: PropTypes.string.isRequired,
    children: PropTypes.func,
    quiet: PropTypes.bool
  }

  static defaultProps = {
    quiet: false
  }

  static contextTypes = {
    broadcasts: PropTypes.object
  }

  state = {
    value: undefined
  }

  getBroadcast() {
    const broadcasts = this.context.broadcasts || {}
    const broadcast = broadcasts[this.props.channel]

    invariant(
      this.props.quiet || broadcast,
      '<Subscriber channel="%s"> must be rendered in the context of a <Broadcast channel="%s">',
      this.props.channel,
      this.props.channel
    )

    return broadcast
  }

  componentWillMount() {
    const broadcast = this.getBroadcast()

    if (broadcast) {
      this.setState({
        value: broadcast.getState()
      })
    }
  }

  componentDidMount() {
    const broadcast = this.getBroadcast()

    if (broadcast) {
      this.unsubscribe = broadcast.subscribe(value => {
        this.setState({ value })
      })
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  render() {
    const { children } = this.props
    return children ? children(this.state.value) : null
  }
}

export default Subscriber
