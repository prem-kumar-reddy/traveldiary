import React from 'react'
import CardBody from './home/post_card/CardBody'


const TovisitCard = ({post, theme}) => {
    return (
        <div className="card my-3"> 
            <CardBody post={post} theme={theme} />
        </div>
    )
}

export default TovisitCard
