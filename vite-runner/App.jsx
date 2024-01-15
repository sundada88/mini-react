
import React from "./Core/React.js"



// const App = React.createElement('div', {id: 'app'}, 'hello->', 'world')

function  Counter({count}) {
    return <div>{count}</div>
}

function CounterContainer() {
    return <Counter></Counter>
}

function App () {
    return (
        <div id="app">
            hello --- world 
            <Counter count={10}></Counter>
            <Counter count={20}></Counter>
        </div>
    )
}

// const App = <div id="app">
//     hello --- world 
//     {/* <Counter></Counter> */}
//     <CounterContainer></CounterContainer>
// </div>


export default App