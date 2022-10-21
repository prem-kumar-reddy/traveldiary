import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TovisitCard from '../TovisitCard'

import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'


const Tovisits = () => {
    const { homeTovisits, auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`tovisits?limit=${homeTovisits.tovisits * 9}`, auth.token)

        dispatch({
            type: POST_TYPES.GET_TOVIST, 
            payload: {...res.data, tovisits: homeTovisits.tovisits + 1}
        })

        setLoad(false)
    }

    return (
        <div className="tovisitsContainer">
            {console.log(homeTovisits)}
            {
                homeTovisits.tovisits.map(tovisit => (
                    <TovisitCard key={tovisit._id} post={tovisit} theme={theme} />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            
            <LoadMoreBtn result={homeTovisits.result} page={homeTovisits.tovisit}
            load={load} handleLoadMore={handleLoadMore} />
        </div>
    )
}

export default Tovisits
