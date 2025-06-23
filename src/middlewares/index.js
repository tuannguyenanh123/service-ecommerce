'use strict'

const LoggerDiscordService = require('../loggers/discord.log.v2')

const pushToLogDiscord = async (req, res, next) => {
    try {
        LoggerDiscordService.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.mehod === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`,
        })
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    pushToLogDiscord
}
