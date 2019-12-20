import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap'

import SearchDropdown from './SearchDropdown'


export default class SearchBox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      data: [],
      loading: false,
      show: false,
    }
  }

  fetchData(input) {
    const {airportCodes, airportList} = this.props
    // console.log('fetch', input)
    if (!input) {
      // fetch airport default list
      this.setState({ data: airportList, loading: false})
    } else {
      // fetch airport by input
      this.setState({data: [], loading: true})
      if (input.length === 3 && airportCodes.includes(input.toUpperCase())) {
        fetch(`/app/airports?code=${input}`)
        .then(response => response.json())
        .then(res => {
          // console.log(res.result)
          const result = res.result
          const airport = result.airport
          this.setState({ data: [airport], loading: false})
          // console.log(this.state)
        });
      } else {
        fetch(`/app/airports?term=${input}`)
        .then(response => response.json())
        .then(res => {
          // console.log(res.result)
          const result = res.result
          const data = result.airports
          this.setState({ data: data, loading: false})
          // console.log(this.state)
        });
      }
    }
  }

  onInputFocus() {
    // console.log("onInputFocus")
    const { input } = this.state
    if (!input) {
      this.fetchData(input)
      this.setState({show: true})
    }
  }

  updateInputValue(e) {
    const val = e.target.value
    this.setState({input: val})
    this.fetchData(val)
    this.setState({show: true})
  }

  onCodeSelected(code) {
    const { type } = this.props
    // console.log('onCodeSelected')
    this.props.onCodeUpdated(code, type)
    this.setState({show: false})
    this.setState({input: code})
  }

  render() {
    const { type } = this.props
    const { input, data, show } = this.state
    return (
      <React.Fragment>
        <Form.Group as={Col} md="12" controlId="">
          <Form.Control
            controlid={type === 'from'? 'From': 'To'}
            placeholder={type === 'from'? 'From': 'To'}
            onFocus={this.onInputFocus.bind(this)}
            onChange={this.updateInputValue.bind(this)}
            value={input}
          />
          {/* <InputGroup.Append>
            <Button variant="outline-secondary">X</Button>
          </InputGroup.Append> */}
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="">
          <SearchDropdown
            type={type}
            data={data}
            onCodeSelected={this.onCodeSelected.bind(this)}
            show={show}
          />
        </Form.Group>
      </React.Fragment>
    );
  }
}