import ReactDOM from "./React/ReactDOM.js"
import React from "./React/React.js"



const App = React.createElement('div', {id: 'app'}, 'hello->', 'world')

ReactDOM.createRoot(document.getElementById('root')).render(App)

