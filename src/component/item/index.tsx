import * as React from 'react'
import Projector from '../load-more/projector'
import './index.scss'

interface PropsType {
  renderCell: (item: any) => React.ReactNode
  item: any
  itemIndex: number
  projector?: Projector
}

class Item extends React.Component<PropsType> {
  private itemRef: React.RefObject<HTMLDivElement>
  constructor(props) {
    super(props)
    this.itemRef = React.createRef()
  }

  public componentDidMount() {
    if (this.props.projector) {
      this.setCache()
    }
  }

  public setCache() {
    const { projector, itemIndex } = this.props;
    const cachedItemRect = projector.cachedItemRect;
    const prevItem = cachedItemRect[itemIndex - 3]
    const rect = this.itemRef.current.getBoundingClientRect()

    if (prevItem) {
      const bottom = prevItem.bottom + rect.height;
      const top = prevItem.bottom;
      cachedItemRect[itemIndex] = !cachedItemRect[itemIndex] ? { index: itemIndex, top, bottom, height: rect.height } : cachedItemRect[itemIndex]
    } else {
      const bottom = rect.bottom;
      const top = rect.top;
      cachedItemRect[itemIndex] = !cachedItemRect[itemIndex] ? { index: itemIndex, top, bottom, height: rect.height } : cachedItemRect[itemIndex]
    }
  }

  public render() {
    const { renderCell, item } = this.props
    return (
      <div className="col" ref={this.itemRef}>
        {renderCell(item)}
      </div>
    )
  }
}

export default Item;