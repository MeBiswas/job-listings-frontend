// jsdom doesn't provide TextEncoder/TextDecoder, but react-router v7 uses
// them internally (Web Streams-based APIs). Polyfill from Node's `util`
// before the test framework loads any app modules.
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
