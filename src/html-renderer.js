import ReactDOMServer from 'react-dom/server'

export default function render(example) {
  return new Promise((resolve, reject) => {
    try {
      resolve(ReactDOMServer.renderToStaticMarkup(example))
    } catch (e) {
      reject(e)
    }
  })
}
