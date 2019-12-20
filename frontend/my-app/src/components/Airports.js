import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap'
import SearchAirportBox from './SearchAirportBox'


export default class Airports extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      loading: false,
      codes: [],
    }
  }

  componentDidMount() {
    this.fetchAll()
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
        this.setState({codes: codes})
        // console.log(this.state)
      });
    fetch(`/app/airports`)
      .then(response => response.json())
      .then(res => {
        // console.log(res.result)
        const result = res.result
        const data = result.airports
        this.setState({data: data})
        // console.log(this.state)
      });
  }

  render() {
    const {data, codes} = this.state
    return (
        <div>
          {/* <h1>Airports</h1> */}
          <div className="inputs">
            <Row>
              <Col>
                <SearchAirportBox
                  airportList={data}
                  airportCodes={codes}
                ></SearchAirportBox>
              </Col>
            </Row>
          </div>
      </div>
    );
  }
}
