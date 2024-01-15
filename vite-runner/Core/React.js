
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
            children: children.map(child => {
                const isTextNode = typeof child === 'string' || typeof child === 'number'
               return isTextNode ? createTextNode(child) : child
            })
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
    root = nextWorkOfUnit
    // console.log(el)
    // container.append(dom)
}


let nextWorkOfUnit = null

function createDom(type) {
    console.log(type)
    return type !== 'TEXT_ELEMENT' ? document.createElement(type) : document.createTextNode('')
}

function updateProps(dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function initChidren (fiber, children) {
    // const children = fiber.props.children
    let prevChild = null
    children.forEach((child, index) => {
        const newChild = {
            type: child.type,
            props: child.props,
            parent: fiber,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            fiber.child = newChild
        } else {
            prevChild.sibling = newChild
        }
        prevChild = newChild
    })
}

function performanceNextWork(fiber) {
    const isFunctionComponenet = typeof fiber.type === 'function'
    if (!isFunctionComponenet) {
        if (!fiber.dom) {
            // 创建dom
            const dom = (fiber.dom = createDom(fiber.type))
            // fiber.parent.dom.append(dom)
            // 更新props
            updateProps(dom, fiber.props)
        }
    }

    const children = isFunctionComponenet ? [fiber.type(fiber.props)] : fiber.props.children
    // 处理children
    initChidren(fiber, children)
    // 返回下一个
    if (fiber.child) return fiber.child
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
}

let root = null

function commitRoot () {
    commitWork(root.child)
    root = null
}

function commitWork(fiber) {
    if (!fiber) return
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function workLoop(deadline) {
    // 任务锁
    let sholdYield = false;
    while (!sholdYield && nextWorkOfUnit) {
        nextWorkOfUnit = performanceNextWork(nextWorkOfUnit)
        // console.log(`run task ${taskId}`)
        sholdYield = deadline.timeRemaining() < 1;
    }
    if (!nextWorkOfUnit && root) {
        commitRoot()
    }
  
    window.requestIdleCallback(workLoop);
  }

requestIdleCallback(workLoop)


const React = {
    createElement,
    render
}

export default React