
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

function initChidren (fiber) {
    const children = fiber.props.children
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
            fiber.child = newChild
            newChild.parent = fiber
        } else {
            prevChild.sibling = newChild
        }
        prevChild = newChild
    })
}

function performanceNextWork(fiber) {
    if (!fiber.dom) {
        // 创建dom
        const dom = (fiber.dom = createDom(fiber.type))
        fiber.parent.dom.append(dom)
        // 更新props
        updateProps(dom, fiber.props)
    }
    // 处理children
    initChidren(fiber)
    // 返回下一个
    if (fiber.child) return fiber.child
    if (fiber.sibling) return fiber.sibling
    return fiber.parent?.sibling
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