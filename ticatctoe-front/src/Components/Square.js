import React from 'react'

const Square = ({val, onClick}) => {
    const style = val ? `squares ${val}` : `squares`;

    return(
        <button className={style} onClick={onClick}>
            {val}
        </button>
    )
}

export default Square;