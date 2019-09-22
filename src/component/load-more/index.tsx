import * as React from 'react'


interface PropsType {
    onBottom: () => Promise<void>
    hasMore: boolean
}

interface StateType {
    loading: boolean
}

class LoadMore extends React.Component<PropsType, StateType> {
    private io: any
    private footerRef: React.RefObject<HTMLDivElement>
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this.footerRef = React.createRef()
    }

    private initScrollLoad(entries) {
        const { onBottom, hasMore } = this.props
        // if(!hasMore){
        //   this.io.unobserve(this.footerRef)
        // }
        const { loading } = this.state
        entries.forEach(item => {
            if (item.intersectionRatio <= 0 || loading || !hasMore) {
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
        this.io = new IntersectionObserver((entries) => this.initScrollLoad(entries))
        this.io.observe(this.footerRef.current)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
                <div ref={this.footerRef}></div>
                {/* {loading ? <Loading /> : null} */}
            </React.Fragment>
        )
    }
}

export default LoadMore;