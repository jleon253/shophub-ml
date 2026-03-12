require('@testing-library/jest-dom');

// Polyfill for TextEncoder/TextDecoder (required for some Node.js versions)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.location
delete window.location;
window.location = {
  href: '/',
  pathname: '/',
  search: '',
  assign: jest.fn(),
  reload: jest.fn()
};

// Mock fetch globally
global.fetch = jest.fn();

