exports.setHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method", "Get, Post, Put, Delete");
    res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
    next()
}