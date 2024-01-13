function render(el, container) {
    const dom = el.type !== 'TEXT_ELEMENT' ? document.createElement(el.type) : document.createTextNode('')
    // props
    Object.keys(el.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })
    // handle children
    el.props.childern.forEach(child => {
        render(child, dom)
    })
    container.append(dom)
}

const ReactDOM = {
    createRoot(container) {
        return {
            render(el) {
                render(el, container)
            }
        }
    }
}

export default ReactDOM