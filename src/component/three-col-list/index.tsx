import * as React from 'react'
import './index.scss'

interface PropsType {
  data:Array<{image:string,text:string}>
}

const ThreeColList: React.FC<PropsType> = (props) => {
    return (
        <div className="three-col-wrap">
            {props.data.map((item, index) => (
                <div className="col" key={index}>
                    <div className="pic">
                        <img src={item.image} />
                    </div>
                    <p className="txt">{item.text}</p>
                </div>
            ))}

        </div>
    )
}

export default ThreeColList;