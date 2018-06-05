/**
 * Created by George-Lenovo on 6/1/2018.
 */

function handleSeeOther(req, res, data) {
    res.writeHead(302, {
        'Content-Type': getContentType(req.pathname),
        'Location': '/'
    })

    res.end(data)
}

function handleOk(req, res, data) {
    handle(req, res, 200, data)
}

function handle(req, res, status, data) {
    res.writeHead(status, {
        'Content-Type': getContentType(req.pathname)
    })

    res.end(data)
}
function handleInternalServerError(req, res) {
    handle(req, res, 500, 'Internal Server Error !')
}

function getContentType(url) {
    if (url.endsWith('text/css')) return 'text/css'
    if (url.endsWith('image/x-icon')) return 'image/x-icon'

    return 'text/html'
}

module.exports = {
    handleSeeOther,
    handleOk,
    handleInternalServerError
}