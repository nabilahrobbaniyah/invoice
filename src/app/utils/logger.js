function log(action, meta) {
    console.log(
        JSON.stringify({
            time: new Date().toISOString(),
            action,
            meta
        })
    ); 
}

module.exports = { log };