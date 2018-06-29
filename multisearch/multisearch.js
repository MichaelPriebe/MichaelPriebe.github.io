let params = location.search

if (params == '') {
    window.open('./popup.html')
} else {
    params = params.slice(1).split('&').map(p => p.split('='))
    function next() {
        let param = params.shift()
        if (!param) return
        let key = param[0]
        let value = param[1]
        if (!key || !value) return next()
        if (key.includes('google')) {
            window.open('https://www.google.com/search?q=' + value)
        } else if (key.includes('bing')) {
            window.open('https://www.bing.com/search?q=' + value)
        }
        next()
    }
    next()
}