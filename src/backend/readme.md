# Project directory structure

project/
├── server.js               # Sets up DB connection and hands off to api/api-setup.js
├── api/
│   ├── api-setup.js       # Defines endpoints, delegates to apis/ modules
│   ├── apis/
│   │   ├── fixtures/      # Fixture-related endpoints
│   │   │   ├── index.js
│   │   │   ├── queries.js
│   │   │   └── updateScore.js
│   │   ├── general.js     # General tournament endpoints
│   │   ├── regions.js     # Region endpoints
│   │   ├── tournaments.js # Tournament-specific endpoints
│   └── mocks/             # Mock data (not used unless ARGS.mock is true)
├── lib/
│   ├── db-helper.js       # DB query wrapper (select function)
│   └── logging.js         # Logging utilities (II, DD, EE)
├── config/
│   └── config.js          # Contains dbConf (not shared, but referenced)
