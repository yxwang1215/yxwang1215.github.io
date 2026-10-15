import {processPixels} from './core.mjs';
self.onmessage = ({data: {id, buffer, width, height, settings}}) => {
  try {
    const result = processPixels(new Uint8ClampedArray(buffer), width, height, settings);
    self.postMessage({id, buffer: result.buffer, width, height}, [result.buffer]);
  } catch (error) { self.postMessage({id, error: error.message}); }
};
