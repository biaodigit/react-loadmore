import * as React from 'react';
// import IntersectionObserver from 'intersection-observer-polyfill'
import Projector from './projector'
// import Loading from '@/base/loading';

interface PropsType {
    onBottom?: () => Promise<void>
    hasMore: boolean
    footer?: React.ReactNode
    cache?: Array<Cache>

}

interface StateType {
    loading: boolean
    upperPlaceholderHeight: string
    underPlaceholderHeight: string
    startIndex: number
    endIndex: number
}

class LoadMore extends React.Component<PropsType, StateType> {
    public loadMoreRef: React.RefObject<HTMLDivElement>

    private io: any
    private footerRef: React.RefObject<HTMLDivElement>
    private scrollTop: number
    private projector!: Projector


    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            upperPlaceholderHeight: '0px',
            underPlaceholderHeight: '0px',
            startIndex: 0,
            endIndex: 17
        }
        this.footerRef = React.createRef()
        this.loadMoreRef = React.createRef()
        this.scrollTop = 0;
        this.projector = new Projector({})
    }

    private initObserveScrollLoad(entries) {
        const { onBottom, hasMore } = this.props
        if (!hasMore) {
            this.io.disconnect()
        }
        const { loading } = this.state
        entries.forEach(item => {
            if (item.intersectionRatio <= 0 || loading) {
                return
            }

            this.setState({
                loading: true
            })

            onBottom().then(() => {
                this.setState({
                    loading: false
                })
            })
        })
    }

    componentDidMount() {
        const top = this.projector.cachedItemRect[6].top
        this.io = new IntersectionObserver((entries) => this.initObserveScrollLoad(entries))
        this.io.observe(this.footerRef.current)
        this.projector.divDom = document.documentElement
        this.projector.subscribe((startIndex, endIndex, upperPlaceholderHeight, underPlaceholderHeight) => {
            this.setState({
                startIndex,
                endIndex,
                upperPlaceholderHeight: upperPlaceholderHeight + 'px',
                underPlaceholderHeight: underPlaceholderHeight + 'px'
            })
        })
        window.addEventListener('scroll', this.onScroll.bind(this))
        this.projector.initAnchor(6, top)
    }

    public render() {
        let { hasMore } = this.props;
        let { startIndex, endIndex, underPlaceholderHeight, upperPlaceholderHeight } = this.state

        const childrenWithProps = React.Children.map(this.props.children, (child: any) => {
            return React.cloneElement(child, { projector: this.projector || {}, startIndex, endIndex })
        })

        return (
            <div ref={this.loadMoreRef}>
                <div style={{ height: upperPlaceholderHeight }}></div>
                {childrenWithProps}
                <div style={{ height: underPlaceholderHeight }}></div>
                {hasMore && <div ref={this.footerRef}></div>}
            </div>
        )
    }

    componentWillUnmount() {
        if (this.io) {
            this.io = null
        }
    }

    private onScroll() {
        const newScrollTop = document.body.scrollTop || document.documentElement.scrollTop
        if (this.scrollTop < newScrollTop) {
            this.projector.up()
        } else {
            this.projector.down()
        }

        this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    }
}

export default LoadMore