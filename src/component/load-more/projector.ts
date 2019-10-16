type Cache = {
    index: number
    top: number
    bottom: number
    height: number
}

type CallBack = (startIndex: number, endIndex: number, upContentPlacehloderHeight?: number, underContentPlaceholderHeight?: number) => void

class Projector {
    // 渲染开始坐标
    public startIndex = 0
    // 渲染结束坐标
    public endIndex = 0
    // 锚点
    public anchorItem: { index: number, offset: number }
    // 缓存数组
    public cachedItemRect: Array<Cache> = []
    public divDom: HTMLElement
    // item的平均高度
    private averageHeight: number
    private callback: (CallBack)

    constructor(opt: { divDom?: HTMLElement, averageHeight?: number }) {
        this.divDom = opt.divDom
        this.averageHeight = opt.averageHeight
    }

    public initAnchor(index: number, offset: number) {
        this.anchorItem = {
            index,
            offset
        }
    }

    public up() {
        // 滑动值与锚点到顶端距离差值
        const scrollTop = this.divDom.scrollTop
        const offset = scrollTop - this.anchorItem.offset;
        // 缓存数组中锚点item
        const anchorItem = this.cachedItemRect[this.anchorItem.index]
        // 如果差值超过锚点高度，则更新锚点、渲染坐标
        if (offset > anchorItem.height) {
            // 新锚点到顶部距离
            const currentAnchorItemTop = anchorItem.top + offset
            // 寻找是否有缓存元素botom值大于新锚点顶部距离
            const itemIndex = this.cachedItemRect.findIndex(item => item.bottom > currentAnchorItemTop)
            if (itemIndex !== -1) {
                // 更新渲染坐标
                this.startIndex = itemIndex > 6 ? itemIndex - 6 : 0
                this.endIndex = itemIndex + 11
                // 更新锚点
                this.anchorItem.index = itemIndex
                this.anchorItem.offset = this.cachedItemRect[itemIndex].top
            } else {
                // 滑得太快，猜一个itemIndex
                const cachedItemRectLength = this.cachedItemRect.length
                const unCachedOffset = scrollTop - this.cachedItemRect[cachedItemRectLength - 1].bottom
                const guestCachedCount = Math.ceil(unCachedOffset / this.averageHeight)
                this.startIndex = this.endIndex + guestCachedCount
                this.endIndex = this.startIndex + 17
            }
            this.next()
        }
    }

    public down() {
        // 滑动值与锚点到顶端距离差值
        const offset = this.divDom.scrollTop - this.anchorItem.offset;
        // 锚点前面一个元素
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