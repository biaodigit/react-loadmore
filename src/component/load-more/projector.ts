type Cache = {
    index: number
    top: number
    bottom: number
    height: number
  }
  
  type CallBack = (startIndex: number, endIndex: number, upContentPlacehloderHeight?: number, underContentPlaceholderHeight?: number) => void
  
  class Projector {
    public startIndex = 0
    public endIndex = 0
    public anchorItem = { index: 6, offset: 458 }
    public cachedItemRect: Array<Cache> = []
  
    public divDom: HTMLElement
    // private averageHeight: number
    private callback: (CallBack)
  
    constructor(opt: { divDom?: HTMLElement, averageHeight?: number }) {
      this.divDom = opt.divDom
      // this.anchorItem.offset = opt.averageHeight || 0
      // this.averageHeight = opt.averageHeight
    }
  
    public up() {
      const offset = this.divDom.scrollTop - this.anchorItem.offset;
      // console.log(this.divDom.scrollTop)
      const anchorItem = this.cachedItemRect[this.anchorItem.index]
      
      if (offset > anchorItem.height) {
        const currentAnchorItemTop = anchorItem.top + offset
        // console.log(offset, anchorItem.top)
        const itemIndex = this.cachedItemRect.findIndex(item => item.bottom > currentAnchorItemTop)
        if (itemIndex !== -1) {
          this.startIndex = itemIndex > 6 ? itemIndex - 6 : 0
          this.endIndex = itemIndex + 11
          this.anchorItem.index = itemIndex
          this.anchorItem.offset = this.cachedItemRect[itemIndex].top
          // console.log(this.anchorItem)
          // console.log(currentAnchorItemTop)
          // console.log(itemIndex)
          // console.log(this.cachedItemRect)
        } else {
  
        }
        this.next()
      }
    }
  
    public down() {
      const offset = this.divDom.scrollTop - this.anchorItem.offset;
      const beforeAnchorItem = this.cachedItemRect[this.anchorItem.index - 3]
      if (!beforeAnchorItem) return
      if (-1 * offset > beforeAnchorItem.height) {
        const currentAnchorItemBottom = beforeAnchorItem.bottom + offset
        const itemIndex = this.cachedItemRect.findIndex(item => item.top > currentAnchorItemBottom)
        if (itemIndex !== -1) {
          this.startIndex = itemIndex > 6 ? itemIndex - 6 : 0
          this.endIndex = itemIndex + 11
          this.anchorItem.index = itemIndex
          this.anchorItem.offset = this.cachedItemRect[itemIndex].top
        } else {
        }
        this.next()
      }
    }
  
    public next() {
      // console.log('next')r
      const cachedItemRectLength = this.cachedItemRect.length
      const startItem = this.cachedItemRect[0]
      const startCachedItem = this.cachedItemRect[this.startIndex]
      const startCachedItemTop = startCachedItem ? startCachedItem.top : 0
      const upContentPlacehloderHeight = startCachedItemTop - startItem.top
      const lastCachedItem = this.cachedItemRect[cachedItemRectLength - 1]
      const lastCachedItemBottom = lastCachedItem ? lastCachedItem.bottom : 0
      const lastItemRect = this.endIndex >= cachedItemRectLength ? this.cachedItemRect[cachedItemRectLength - 1] : this.cachedItemRect[this.endIndex]
      const lastItemRectBottom = lastItemRect ? lastItemRect.bottom : 0
      const underContentPlaceholderHeight = lastCachedItemBottom - lastItemRectBottom
      // console.log(this.cachedItemRect)
      // console.log(`this.startIndex:${this.startIndex}`)
      // console.log(`this.endIndex:${this.endIndex}`)
      // console.log(this.anchorItem)
      // console.log(`upContentPlacehloderHeight:${upContentPlacehloderHeight}`)
      // console.log(`underContentPlaceholderHeight:${underContentPlaceholderHeight}`)
      this.callback(this.startIndex, this.endIndex, upContentPlacehloderHeight, underContentPlaceholderHeight)
    }
  
    public subscribe(callback: CallBack) {
      this.callback = callback
    }
  }
  
  export default Projector