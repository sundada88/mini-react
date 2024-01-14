
function createTextNode (text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'string' ? createTextNode(child) : child)
        }
    }
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    // console.log(el)
    // container.append(dom)
}

const React = {
    createElement,
    render
}

let nextWorkOfUnit = null

function createDom(type) {
    return type !== 'TEXT_ELEMENT' ? document.createElement(type) : document.createTextNode('')
}

function updateProps(dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function performanceNextWork(work) {
    if (!work.dom) {
        // 创建dom
        const dom = (work.dom = createDom(work.type))
        work.parent.dom.append(dom)
        // 更新props
        updateProps(dom, work.props)
    }
    // 处理children
    const children = work.props.children
    let prevChild = null
    children.forEach((child, index) => {
        const newChild = {
            type: child.type,
            props: child.props,
            parent: null,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            work.child = newChild
            newChild.parent = work
        } else {
            prevChild.sibling = newChild
        }
        prevChild = newChild
    })
    // 返回下一个
    if (work.child) return work.child
    if (work.sibling) return work.sibling
    return work.parent?.sibling
}

function workLoop(deadline) {
    // 任务锁
    let sholdYield = false;
    while (!sholdYield && nextWorkOfUnit) {
        nextWorkOfUnit = performanceNextWork(nextWorkOfUnit)
        // console.log(`run task ${taskId}`)
        sholdYield = deadline.timeRemaining() < 1;
    }
  
    window.requestIdleCallback(workLoop);
  }

requestIdleCallback(workLoop)


export default React