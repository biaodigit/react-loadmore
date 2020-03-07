import * as React from 'react'
import Item from '../item'
import Projector from '../load-more/projector'
import './index.scss'

interface PropsType {
    data: Array<{ image: string, text: string }>
    startIndex?: number
    endIndex?: number
    projector?: Projector
}

const ThreeColList: React.FC<PropsType> = React.memo((props) => {
    const { projector, startIndex, endIndex } = props
    const renderCell = (item: any) => {
        return (
            <React.Fragment>
                <div className="pic">
                    <img src={item.image} />
                </div>
                <p className="txt">{item.text}</p>
            </React.Fragment>
        )
    }

    return (
        <div className="three-col-wrap">
            {props.data.map((item, index) => {
                if (index >= startIndex && index <= endIndex) {
                    return <Item renderCell={renderCell} projector={projector} item={item} itemIndex={index} key={index} />
                }
            })}
        </div>
    )
})

export default ThreeColList;