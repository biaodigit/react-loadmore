import * as React from 'react'
// import List from './components/list'
import './App.scss'

interface PropsType {
    // text:string
}

class App extends React.Component<PropsType, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="wrap">
                <h1>react lazyload！</h1>
                <p>hello worlds</p>
                {/* <List/> */}
            </div>
        )
    }
}

export default App
