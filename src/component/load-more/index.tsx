import * as React from 'react'
import Projector from './projector'


interface PropsType {
    onBottom: () => void
    hasMore: boolean
}

interface StateType {
    loading: boolean
    startIndex: number
    endIndex: number
}

class LoadMore extends React.Component<PropsType, StateType> {
    public divDom: React.RefObject<HTMLDivElement>

    private io: any
    private footerRef: React.RefObject<HTMLDivElement>
    private scrollTop: number
    private projector: Projector

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            startIndex: 0,
            endIndex: 17
        }
        this.footerRef = React.createRef()
        this.divDom = React.createRef()
    }

    private initScrollLoad(entries) {
        const { onBottom, hasMore } = this.props
        entries.forEach(item => {
            if (item.intersectionRatio <= 0 || !hasMore) {
                return
            }

            this.setState({
                loading: true
            })

            onBottom()
        })
    }

    public componentWillMount() {
        this.projector = new Projector({ divDom: this.divDom.current })
        this.projector.subscribe((startIndex, endIndex) => {
            this.setState({
                startIndex,
                endIndex
            })
        })
    }

    public componentDidMount() {
        this.io = new IntersectionObserver((entries) => this.initScrollLoad(entries))
        this.io.observe(this.footerRef.current)
        window.addEventListener('scroll', this.onScroll.bind(this))
    }

    public render() {
        let { startIndex, endIndex } = this.state
        const childrenWithProps = React.Children.map(this.props.children, (child: any) => {
            return React.cloneElement(child, { startIndex, endIndex, projector: this.projector })
        })
        return (
            <div ref={this.divDom} className="container">
                {childrenWithProps}
                <div ref={this.footerRef}></div>
                {/* {loading ? <Loading /> : null} */}
            </div>
        )
    }

    private onScroll() {
        const newScrollTop = this.scrollTop = this.divDom.current.scrollTop
        if (this.scrollTop < newScrollTop) {
            this.projector.up()
        } else {
            this.projector.down()
        }

        this.scrollTop = this.divDom.current.scrollTop
    }
}

export default LoadMore;