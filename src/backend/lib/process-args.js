const processArgs = (args) => {
    const ARGS = {}
    args.forEach(arg => {
        console.log("Processing option: ", arg)
        if (arg.startsWith('--')) {
            const [key, value] = arg.split('=')
            ARGS[key.replace('--', '')] = value
        }
    })

    if (ARGS['sync-from-master']) {
        return ARGS
    }

    if (!ARGS.port) {
        throw new Error('Missing --port argument')
    }
    if (!ARGS.app) {
        throw new Error('Missing --app argument')
    } else {
      ARGS.staticPath = `../../../src/frontend/interfaces/${ARGS.app}/watch`
    }
    return ARGS
}

module.exports = {
    processArgs,
}
