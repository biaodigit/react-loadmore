export type Cache = {
   index:number
   top:number
   bottom:number
   height:number
}

class Projector {
    public startIndex: 0
    public endIndex:0
    public anchorItem:Cache = {index:0,top:0,bottom:0,height:0}
    public cached: any[]
    constructor(opt) {
        this.cached = opt.cached
    }

    public next() {}

    public up() {}

    public down() {}

    public computeUpperPlaceholederHeigt(){}

    public subscribe() {}
}

export default Projector