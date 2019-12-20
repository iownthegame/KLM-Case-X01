import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import SearchBox from './SearchBox'
import Spinner from './Spinner'


export default class Search extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      loading: false,
      codes: [],
      srcCode: '',
      dstCode: '',
      fareLoading: false,
      price: '',
      currency: ''
    }
  }

  componentDidMount() {
    this.fetchAll(this.props.type)
  }

  fetchAll() {
    this.setState({data: [], loading: true})
    fetch(`/app/airport_list`)
      .then(response => response.json())
      .then(res => {
        // console.log(res.result)
        const result = res.result
        const data = result.airport_list
        const codes = data.map((d) => d.code)
        this.setState({data: data, loading: false, codes: codes})
        // console.log(this.state)
      });
  }

  onCodeUpdated(code, type) {
    console.log(code, type)
    if (type === 'from') {
      this.setState({srcCode: code})
    } else {
      this.setState({dstCode: code})
    }
  }

  onButtonClick() {
    const {srcCode, dstCode} = this.state
    this.setState({fareLoading: true})
    fetch(`/app/fares?orig=${srcCode}&dst=${dstCode}`)
      .then(response => response.json())
      .then(res => {
        // console.log(res.result)
        const result = res.result
        const fare = result.fare
        // "fare": {
        //   "amount": 1909.72,
        //   "currency": "EUR",
        //   "origin": "TPE",
        //   "destination": "AMS"
        //   }
        // const codes = data.map((d) => d.code)
        this.setState({
          price: fare.amount,
          currency: fare.currency,
          fareLoading: false}
        )
        // console.log(this.state)
      });
  }

  render() {
    const {data, codes, srcCode, dstCode, fareLoading, price, currency} = this.state
    // console.log('src', srcCode, 'dst', dstCode)
    return (
        <div>
          <h1>Explore the world</h1>
          <div className="inputs">
            <Row>
              <Col>
                <SearchBox
                  type="from"
                  airportList={data}
                  airportCodes={codes}
                  onCodeUpdated={this.onCodeUpdated.bind(this)}
                ></SearchBox>
              </Col>
              <Col>
                <SearchBox
                  type="to"
                  airportList={data}
                  airportCodes={codes}
                  onCodeUpdated={this.onCodeUpdated.bind(this)}
                ></SearchBox>
              </Col>
            </Row>
          </div>
          <div>
            <div>
              <Button
                onClick={this.onButtonClick.bind(this)}
                disabled={!srcCode || !dstCode}
                variant="info">
                  Ready to fly
              </Button>
            </div>
            <div>
              <Spinner loading={fareLoading} />
            </div>
            <div>
              {fareLoading ? null: (
                <div className="fare">
                  <span className="price">{price}</span> <span className="currency">{currency}</span>
                </div>
              )}
            </div>
          </div>
      </div>
    );
  }
}
