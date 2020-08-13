import React, { useState, useEffect, useRef } from 'react'

function DataTable({ data }) {

  const [rows, setRows] = useState(<tr></tr>)

  useEffect(() => {
    if (data) {
      const newRows = data.paths.map((v,i,a) => {
        const cells = v.map((c,j) => <td key={j}>{c}</td>)
        return <tr key={i}>{cells}</tr>
      })
      // console.log(newRows)
      setRows(newRows);
      
    } else {
      console.log('DataTable waiting for data')
    }
  }, [data])


  return (
    <div>
      Paths table
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
      <style jsx>{`
        table {
          border: 1px solid grey;
        }
      `}</style>
    </div>
  )
}

export default DataTable;