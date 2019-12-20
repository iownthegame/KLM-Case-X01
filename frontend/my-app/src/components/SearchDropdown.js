import React, { Component } from 'react';
import { Table } from 'react-bootstrap'


export default class SearchDropdown extends Component {

  render() {
    const { data, show, onCodeSelected } = this.props
    // console.log(show)
    if (!show) {
      return null
    }
    return (
      <div>
        <div className="dropdown-list">
          <div className="table-wrapper">
            <Table striped hover variant="dark" size="sm">
              <tbody>
                {
                  data.map((d, idx) => {
                    return (
                      <tr onClick={(e) => onCodeSelected(d.code)} key={idx}>
                        <td>{`${d.name} (${d.code})`}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

