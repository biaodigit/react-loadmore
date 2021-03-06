import * as React from 'react'
import LoadMore from './component/load-more'
import ThreeColList from './component/three-col-list'
import './App.scss'


const arr = Array(18).fill({ image: require('../assets/img/empty.png'), text: 'testtest' })


interface StateType {
    list: Array<{ image: string, text: string }>
    hasMore: boolean
}

class App extends React.Component<{}, StateType> {
    constructor(props) {
        super(props)
        this.state = {
            list: arr.slice(0),
            hasMore: true
        }
    }


    async loadMore() {
        let list = []
        await setTimeout(() => {
            list = this.state.list.slice(0)
            this.setState({
                list: list.concat(arr)
            })
        })
    }

    render() {
        let { list, hasMore } = this.state
        return (
            <div className="wrap">
                <LoadMore onBottom={this.loadMore.bind(this)} hasMore={hasMore}>
                    <ThreeColList data={list} />
                </LoadMore>
            </div>
        )
    }
}

export default App
