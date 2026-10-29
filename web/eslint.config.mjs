import next from 'eslint-config-next'

// eslint-config-next ships a flat-config array (CJS module.exports) already
// ignoring .next/out/build — append our own tooling-output ignores.
const config = [...next, { ignores: ['node_modules/', 'coverage/', 'playwright-report/', 'test-results/'] }]
export default config
