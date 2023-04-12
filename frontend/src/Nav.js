import React from 'react'
import {Link} from 'react-router-dom'

function Nav({name}) {


    console.log(name)
    return (
        <div className='nav'>
            <h4><Link onClick={()=>{localStorage.clear();window.location.reload(true);}}>SignOut</Link></h4>
            <h4>loginned User: {name.toUpperCase()}</h4>

        </div>
    )

}

export default Nav;