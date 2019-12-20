import React, { Component } from 'react';
import { Form, Row, Col, Table, Pagination } from 'react-bootstrap'


export default class SearchAirportBox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      data: [],
      loading: false,
      show: false,
      searched: false,
      currentPage: 1,
      totalPage: 42,
    }
  }

  componentDidMount() {
    this.fetchData('', 1)
  }

  fetchData(input, page) {
    const { airportCodes, airportList } = this.props
    const { searched } = this.state
    // console.log('fetch', input, 'page', page)
    // console.log(airportList)
    if (!input) {
      // fetch airport default list
      if (page === 1 && !searched) {
        this.setState({ data: airportList, loading: false})
      } else {
        this.setState({searched: true})
        fetch(`/app/airports?page=${page}`)
        .then(response => response.json())
        .then(res => {
          // console.log(res.result)
          const result = res.result
          const data = result.airports
          // console.log(data)
          const page = result.page
          const totalPage = page.totalPages
          const currentPage = page.number
          this.setState({ data, loading: false, currentPage, totalPage})
          // console.log(currentPage, totalPage)
          // console.log(this.state)
        });
      }
    } else {
      // fetch airport by input
      this.setState({data: [], loading: true})
      if (input.length === 3 && airportCodes.includes(input.toUpperCase())) {
        fetch(`/app/airports?code=${input}&page=${page}`)
        .then(response => response.json())
        .then(res => {
          // console.log(res.result)
          const result = res.result
          const airport = result.airport
          const totalPage = 1
          const currentPage = 1
          this.setState({ data: [airport], loading: false, currentPage, totalPage})
          // console.log(this.state)
        });
      } else {
        fetch(`/app/airports?term=${input}&page=${page}`)
        .then(response => response.json())
        .then(res => {
          // console.log(res.result)
          const result = res.result
          const data = result.airports
          const page = result.page
          const totalPage = page.totalPages
          const currentPage = page.number
          this.setState({ data, loading: false, currentPage, totalPage})
          // console.log(this.state)
        });
      }
    }
  }

  updateInputValue(e) {
    const val = e.target.value
    this.setState({input: val, searched: true})
    this.fetchData(val, 1)
    this.setState({show: true})
  }

  updatePage(ins) {
    // console.log('updatePage', ins)
    const {currentPage, totalPage, input} = this.state
    let newCurrentPage = currentPage
    if (ins === 'first') {
      newCurrentPage = 1
    } else if (ins === 'prev') {
      newCurrentPage -= 1
    } else if (ins === 'next') {
      newCurrentPage += 1
    } else if (ins === 'last') {
      newCurrentPage = totalPage
    }
    this.fetchData(input, newCurrentPage)
  }

  render() {
    const { input, data, searched, currentPage, totalPage } = this.state
    const { airportList } = this.props
    const tableData = !searched ? airportList : data
    return (
      <React.Fragment>
        <Form.Group as={Col} md="12" controlId="">
          <Form.Control
            controlid="airport-input"
            placeholder="Search airport"
            onChange={this.updateInputValue.bind(this)}
            value={input}
          />
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="" className="table-airport">
          <Table striped hover variant="dark" size="sm">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Coordinates</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {
                tableData.map((d, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{d.code}</td>
                      <td>{d.name}</td>
                      <td>{d.coordinates ? `${d.coordinates.longitude}, ${d.coordinates.latitude}` : ''}</td>
                      <td>{d.description? d.description : ''}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Form.Group>
        {
          searched && data.length === 0 ? null :
          <Row className="row-page">
            <Pagination className="page" size="sm">
              <Pagination.First
                disabled={currentPage === 1}
                onClick={(e) => this.updatePage('first')}
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={(e) => this.updatePage('prev')}
              />
              <Pagination.Item disabled>{currentPage}</Pagination.Item>
              <Pagination.Next
                disabled={currentPage === totalPage}
                onClick={(e) => this.updatePage('next')}
              />
              <Pagination.Last
                disabled={currentPage === totalPage}
                onClick={(e) => this.updatePage('last')}
              />
            </Pagination>
          </Row>
        }

      </React.Fragment>
    );
  }
}