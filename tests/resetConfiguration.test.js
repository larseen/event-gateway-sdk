const fdk = require('../index')
const eventGatewayProcesses = require('./event-gateway/processes')

const config = {
  functions: [
    {
      functionId: 'myFunctionThree',
      provider: {
        type: 'awslambda',
        arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/test',
        region: 'us-east-1',
      },
    },
    {
      functionId: 'myFunctionFour',
      provider: {
        type: 'http',
        url: 'http://www.example.com',
      },
    },
  ],
  subscriptions: [
    { functionId: 'myFunctionThree', event: 'pageVisited' },
    { functionId: 'myFunctionThree', event: 'userCreated' },
  ],
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4021,
      apiPort: 4022,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        configurationProtocol: 'http',
        configurationPort: 4021,
      })
    })
)

afterAll(() => {
  eventGatewayProcesses.shutDown(eventGatewayProcessId)
})

test('should created multiple functions and subscriptions with configure', () => {
  expect.assertions(1)
  return eventGateway.configure(config).then(response => {
    expect(response).toMatchSnapshot()
  })
})

test('should remove all functions and subscriptions', () => {
  expect.assertions(1)
  return eventGateway.resetConfiguration().then(response => {
    expect(response).toBeUndefined()
  })
})