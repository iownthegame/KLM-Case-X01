import React, { Component } from 'react';
import { Table } from 'react-bootstrap'
// import Spinner from './Spinner'


export default class Stats extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      requestsData: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.fetchAll(this.props.type)
  }

  fetchAll() {
    this.setState({data: [], requestsData: {}, loading: true})
    fetch(`/app/stats`)
      .then(response => response.json())
      .then(res => {
        const result = res.result
        const data = result.records
        const requestsData = {}
        data.forEach(d => {
          if (!d.api.includes('app')) {
            return
          }
          if (!d.response_time || !d.request_time) {
            return
          }
          if (!(d.api in requestsData)) {
            requestsData[d.api] = {
              num: 0,
              num_ok: 0,
              num_4xx: 0,
              num_5xx: 0,
              response_times: [],
              avg_time: 0,
              min_time: 0,
              max_time: 0,
            }
          }
          requestsData[d.api].num += 1
          const status_key = (d.status_code === 200) ? 'num_ok' : parseInt(d.status_code / 100) === 4 ? 'num_4xx' : 'num_5xx'
          requestsData[d.api][status_key] += 1
          requestsData[d.api].response_times.push(parseFloat(d.response_time))
        });
        Object.keys(requestsData).forEach(idx => {
          const r = requestsData[idx]
          const time_total = r.response_times.reduce((a, b) => a + b, 0)
          r.avg_time = 1.0 * time_total / r.num
          r.min_time = Math.min.apply(Math, r.response_times)
          r.max_time = Math.max.apply(Math, r.response_times)
        })
        // console.log(requestsData)
        this.setState({data, requestsData, loading: false})
        // console.log(this.state)
      });
  }

  render() {
    const { requestsData } = this.state
    // console.log(requestsData)
    return (
        <div>
          <h1>Request Stats</h1>
          <div className="inputs">
            <Table striped hover variant="dark" size="sm">
              <thead>
                <tr>
                  <th>API</th>
                  <th># requests</th>
                  <th># OK requests</th>
                  <th># 4xx requests</th>
                  <th># 5xx requests</th>
                  <th>avg response time</th>
                  <th>min response time</th>
                  <th>max response time</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(requestsData).map(idx => {
                    const d = requestsData[idx]
                    // console.log(d)
                    return (
                      <tr key={idx}>
                        <td>{idx}</td>
                        <td>{d.num}</td>
                        <td>{d.num_ok}</td>
                        <td>{d.num_4xx}</td>
                        <td>{d.num_5xx}</td>
                        <td>{d.avg_time}</td>
                        <td>{d.min_time}</td>
                        <td>{d.max_time}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
      </div>
    );
  }
}
