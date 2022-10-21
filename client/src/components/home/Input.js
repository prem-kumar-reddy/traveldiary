import React from 'react'
import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Input = () => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <div className="input my-3 d-flex">
            <Avatar src={auth.user.avatar} size="big-avatar" />
            
            <button className="inputBtn flex-fill"
            onClick={() => dispatch({ type: GLOBALTYPES.INPUT, payload: true })}>
                Place to visit?
            </button>
        </div>
    )
}

export default Input
