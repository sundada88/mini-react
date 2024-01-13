
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

const React = {
    createElement,
    createElement
}

export default React