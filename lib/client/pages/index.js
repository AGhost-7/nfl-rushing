import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Pagination from '../segments/pagination'
import { useLocation, useHistory } from 'react-router-dom'

import { faFootballBall } from '@fortawesome/free-solid-svg-icons/faFootballBall'
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort'
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp'
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'

const fields = [
  { name: 'player', label: 'Player', sort: false },
  { name: 'team', label: 'Team', sort: false },
  { name: 'position', label: 'Position', sort: false },
  {
    name: 'rushingAttemptsPerGameAverage',
    label: 'Rushing Attempts Per Game Average',
    sort: false,
  },
  { name: 'rushingAttempts', label: 'Rushing Attempts', sort: false },
  { name: 'totalRushingYards', label: 'Total Rushing Yards', sort: true },
  {
    name: 'rushingAverageYardsPerAttempt',
    label: 'Rushing Average Yards Per Attempt',
    sort: false,
  },
  {
    name: 'rushingYardsPerGame',
    label: 'Rushing Yards Per Game',
    sort: false,
  },
  {
    name: 'totalRushingTouchdowns',
    label: 'Total Rushing Touchdowns',
    sort: true,
  },
  { name: 'longestRush', label: 'Longest Rush', sort: true },
  {
    name: 'longestRushTouchdown',
    label: 'Longest Rush Touchdown',
    sort: true,
  },
  { name: 'rushingFirstDowns', label: 'Rushing First Downs', sort: false },
  {
    name: 'rushingFirstDownPercentage',
    label: 'Rushing First Down Percentage',
    sort: false,
  },
  {
    name: 'rushingTwentyYardsEach',
    label: 'Rushing 20 Yards Each',
    sort: false,
  },
  {
    name: 'rushingFortyYardsEach',
    label: 'Rushing 40 Yards Each',
    sort: false,
  },
  { name: 'rushingFumbles', label: 'Rushing Fumbles', sort: false },
]

function PlayerCell({ value }) {
  if (typeof value === 'boolean' && value) {
    return (
      <td>
        <FontAwesomeIcon icon={faCheck} />
      </td>
    )
  }

  return <td>{value}</td>
}

function PlayerRow({ player }) {
  return (
    <tr>
      {fields.map((field) => (
        <PlayerCell key={field.name} value={player[field.name]} />
      ))}
    </tr>
  )
}

function TableHeader({ field }) {
  const props = {}
  const awesomeIcon = []
  if (field.sort) {
    const location = useLocation()
    const history = useHistory()

    const query = new URLSearchParams(location.search)
    const sort = query.getAll('sort')
    const order = query.getAll('order')
    const index = sort.indexOf(field.name)

    props.onClick = () => {
      if (index === -1) {
        query.append('sort', field.name)
        query.append('order', 'desc')
      } else {
        const fieldOrder = order[index]
        if (fieldOrder === 'desc') {
          order[index] = 'asc'
        } else {
          order.splice(index)
          sort.splice(index)
        }

        query.delete('order')
        query.delete('sort')

        order.forEach((item, index) => {
          query.append('order', order[index])
          query.append('sort', sort[index])
        })
      }

      history.push('/?' + query.toString())
    }

    let icon = faSort
    switch (order[index]) {
      case 'desc':
        icon = faSortDown
        break
      case 'asc':
        icon = faSortUp
        break
    }
    awesomeIcon.push(<FontAwesomeIcon key="icon" icon={icon} />)
  }
  return (
    <th key={'header' + field.field} {...props}>
      {awesomeIcon}
      {field.label}
    </th>
  )
}

export default function Index() {
  const location = useLocation()

  const [players, setPlayers] = useState({
    pending: true,
    error: null,
    data: null,
  })

  useEffect(() => {
    const search = location.search
    fetch('/api/players' + location.search)
      .then((response) => response.json().then((body) => ({ response, body })))
      .then(({ response, body }) => {
        if (location.search !== search) return
        if (response.status === 200) {
          setPlayers({
            pending: false,
            error: null,
            data: body,
          })
        } else {
          setPlayers({
            pending: false,
            error: body,
            data: null,
          })
        }
      })
  }, [location.search])

  return (
    <section className="section mb-4">
      <div className="container">
        <h1 className="title">
          <FontAwesomeIcon icon={faFootballBall} /> NFL Rushing Statistics
        </h1>
        <table className="table">
          <thead>
            <tr>
              {fields.map((field) => (
                <TableHeader key={field.name} field={field} />
              ))}
            </tr>
          </thead>

          <tbody>
            {players.data
              ? players.data.map((player) => (
                  <PlayerRow key={player.player} player={player} />
                ))
              : []}
          </tbody>
        </table>

        <Pagination />
        <a href="/api/players/export" className="button is-pulled-right">
          Export CSV
        </a>
      </div>
    </section>
  )
}
