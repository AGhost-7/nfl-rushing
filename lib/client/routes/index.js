import React from 'react'
import IndexPage from '../pages/index'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default function Index() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <IndexPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
