import * as React from 'react'
import Projector, {Cache} from '../load-more/projector'

interface PropsType {
  renderCell: (item: any, itemIndex: number) => React.ReactNode
  item: any
  itemIndex: number
  projector: Projector
}

class Item extends React.Component<PropsType> {
  private itemRef: React.RefObject<HTMLDivElement>
  constructor(props) {
    super(props)
    this.itemRef = React.createRef()
  }

  public setCache() {

  }
  render() {
    const { renderCell, item, itemIndex } = this.props
    return (
      <div ref={this.itemRef}>
        {renderCell(item, itemIndex)}
      </div>
    )
  }
}

export default Item;