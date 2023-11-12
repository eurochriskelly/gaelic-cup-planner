
const processArgs = (args) => {
    const ARGS = {}
    args.forEach(arg => {
        console.log("Processing option: ", arg)
        if (arg.startsWith('--')) {
            const [key, value] = arg.split('=')
            ARGS[key.replace('--', '')] = value
        }
    })
    if (!ARGS.port) {
        throw new Error('Missing --port argument')
    }
    if (!ARGS.app) {
        throw new Error('Missing --app argument')
    } else {
        switch (ARGS.app) {
            case 'pitch':
                ARGS.staticPath = '../../src/frontend/interfaces/pitch/watch'
                break
            case 'groups':
                ARGS.staticPath = '../../src/frontend/interfaces/groups/watch'
                break
            default:
                throw new Error('Invalid --app argument: ', ARGS.app)
        }
    }
    return ARGS
}

module.exports = {
    processArgs,
}