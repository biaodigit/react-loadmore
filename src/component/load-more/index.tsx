import * as React from 'react'
import Projector from './projector'
import './index.scss'


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
        console.log(this.divDom)
        this.projector = new Projector({ divDom: document.documentElement })
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
        // this.projector = new Projector({ divDom: this.divDom.current })
        // this.projector.subscribe((startIndex, endIndex) => {
        //     this.setState({
        //         startIndex,
        //         endIndex
        //     })
        // })

        // let container = document.querySelector('.container')
        window.addEventListener('scroll', this.onScroll.bind(this))
        document.documentElement.scrollTop = 500
        // this.divDom.current.scrollTop

    }

    public render() {
        let { startIndex, endIndex } = this.state
        const childrenWithProps = React.Children.map(this.props.children, (child: any) => {
            return React.cloneElement(child, { startIndex, endIndex, projector: this.projector })
        })
        return (
            <div  className="container">
                <div ref={this.divDom}>
                    {childrenWithProps}
                    <div ref={this.footerRef}></div>
                    {/* {loading ? <Loading /> : null} */}
                </div>
            </div>
        )
    }

    private onScroll() {
        // console.log(this.divDom.current.scrollTop)
        const newScrollTop = document.body.scrollTop || document.documentElement.scrollTop
        // console.log(newScrollTop)
        if (this.scrollTop < newScrollTop) {
            this.projector.up()
        } else {
            this.projector.down()
        }

        this.scrollTop = this.divDom.current.scrollTop
    }
}

export default LoadMore;
