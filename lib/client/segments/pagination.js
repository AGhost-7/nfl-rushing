/**
 * A generic pagination component.
 */

import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export default function Pagination() {
  const history = useHistory()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = Number(query.get('page')) || 1

  const onClick = (add) => {
    query.set('page', page + add)
    history.push(`${location.pathname}?${query.toString()}`)
  }

  return (
    <nav className="pagination">
      <a
        onClick={onClick.bind(null, -1)}
        className="pagination-previous"
        disabled={page === 1}
      >
        Previous
      </a>
      <a onClick={onClick.bind(null, 1)} className="pagination-next">
        Next
      </a>
    </nav>
  )
}
