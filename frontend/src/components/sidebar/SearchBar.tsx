import '@fortawesome/fontawesome-free/js/all.js'

import React, { useContext } from 'react'
import { useHistory, withRouter } from 'react-router'

import AppContext from '../other/AppContext'
import styles from '../../stylesheets/sidebar/SearchBar.module.css'
import { useLocation } from 'react-router-dom'

function SearchBar() {
  const { searchQuery, setSearchQuery } = useContext(AppContext)
  const location = useLocation()
  const history = useHistory()
  
  return (
    <div className={styles['search-container']}>
      <form>
        <input
          className={styles['search-bar']}
          onChange={e => setSearchQuery(e.target.value)}
          onClick={(location.pathname === '/notebooks' || '/new-note') ? () => history.push(`/all-notes`) : undefined}
          type='text'
          value={searchQuery}
        />
        <span>
          <button className={styles['search-btn']} type='submit' onClick={e => e.preventDefault()}>
            <i className={'fas fa-search'}></i>
          </button>
        </span>
      </form>
    </div>
  );
}

const finishedSearchBar = withRouter(SearchBar)

export default finishedSearchBar
