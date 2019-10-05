type Cache = {
    index: number
    top: number
    bottom: number
    height: number
}

type CallBack = (startIndex:number,endIndex:number, upContentPlacehloderHeight?: number, underContentPlaceholderHeight?: number) => void

class Projector {
    public startIndex = 0
    public endIndex = 0
    public anchorItem = { index: 0, offset: 0 }
    public cachedItemRect: Array<Cache> = []

    private divDom: HTMLDivElement
    // private averageHeight: number
    private callback: (CallBack)

    constructor(opt: { divDom: HTMLDivElement, averageHeight?: number }) {
        this.divDom = opt.divDom
        // this.averageHeight = opt.averageHeight
    }

    public up() {
        const offset = this.divDom.scrollTop - this.anchorItem.offset;
        const anchorItemRect = this.cachedItemRect[this.anchorItem.index]
        if (offset > anchorItemRect.height) {
            const currentAnchorItemTop = anchorItemRect.top + offset
            const itemIndex = this.cachedItemRect.findIndex(item => item.bottom > currentAnchorItemTop)
            this.startIndex = itemIndex > 8 ? itemIndex - 8 : 0
            this.endIndex += itemIndex - this.anchorItem.index
            this.anchorItem.index = itemIndex
            this.anchorItem.offset = this.cachedItemRect[itemIndex].top
            this.next()
        }
    }

    public down() { }

    public next() {
        // const projectedItem = this.items.slice(this.startIndex, this.endIndex + 1)
        //   const startItem = this.cachedItemRect[this.startIndex]
        //   const upContentPlacehloderHeight = startItem ? startItem.top : 0
        this.callback(this.startIndex,this.endIndex)
    }

    public subscribe(callback: CallBack) {
        this.callback = callback
    }
}

export default Projector