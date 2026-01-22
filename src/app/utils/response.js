function success(res, data, message = "OK") {
    return res.json({
        success: true,
        message,
        data
    });
}

function error(res, status, message) {
    return res.status(status).json({
        success: false,
        message
    });
}

module.exports = { success, error };