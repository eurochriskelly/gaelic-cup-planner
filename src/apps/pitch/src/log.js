const II = msg => {
    Logger.log('II: ' + msg)
}

const JJ = (title, msg, numLines=20) => {
    Logger.log('JJ:' + title)
    Logger.log(JSON.stringify(msg, null, 2).split('\n').slice(0,numLines).join('\n'))
}