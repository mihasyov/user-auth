module.exports.dashboard = (req, res) => {
    res.status(200).json({
        message: `Hello from server ${req.user.name}`
    })
}