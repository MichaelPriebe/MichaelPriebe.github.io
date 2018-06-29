let params = location.search
window.close()
if (params == '') {
    window.open('./popup.html')
} else {
    params = params.slice(1).split('&').map(p => p.split('='))
    let first = false
    function next() {
        let param = params.shift()
        if (!param) return
        let key = param[0]
        let value = param[1]
        if (!key || !value) return next()
        let url
        if (key.includes('google')) {
            url = 'https://www.google.com/search?q=' + value
        } else if (key.includes('bing')) {
            url = 'https://www.bing.com/search?q=' + value
        }
        if (!first) {
            first = url
        } else {
            window.open(url)
        }
        next()
    }
    next()
    window.location = first
}