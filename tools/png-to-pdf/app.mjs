/** Explicit bootstrap: render the complete gallery before the editor binds its event handlers. */
import {SCAN_MODES} from './modes.mjs';
import {mountScanGallery} from './scan-gallery.mjs';
mountScanGallery(SCAN_MODES);
await import('./editor.mjs');
