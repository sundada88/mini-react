
function createTextNode (text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            childern: []
        }
    }
}

function createElement(type, props, ...childern) {
    return {
        type,
        props: {
            ...props,
            childern: childern.map(child => typeof child === 'string' ? createTextNode(child) : child)
        }
    }
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            childern: [el]
        }
    }
}

const React = {
    createElement,
    render
}

let nextWorkOfUnit = null

function createDom(type) {
    return type !== 'TEXT_ELEMENT' ? document.createElement(type) : document.createTextNode('')
}

function handleProps (dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function performanceNextWork(fiber) {
    // 1. 根据work 创建dom
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))
        fiber.parent.dom.append(dom)
        // 2. 设置 props 
        handleProps(dom, fiber.props)
    }

    // 3. 处理 孩子
    const children = fiber.props.childern
    let prevChild = null
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            sibling: null,
            parent: null,
            dom: null
        }
        if (index === 0) {
            fiber.child = newFiber
            newFiber.parent = fiber
        } else {
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
    // 4. 返回下一个work
    if (fiber.child) return fiber.child
    if (fiber.sibling) return fiber.sibling
    return fiber.parent?.sibling
}

function workLoop(deadline) {
  let sholdYield = false;
  while (!sholdYield && nextWorkOfUnit) {
      // run task
      nextWorkOfUnit = performanceNextWork(nextWorkOfUnit)
      sholdYield = deadline.timeRemaining() < 1;
  }
  
  window.requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop)

export default React