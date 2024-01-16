
import { App, decoderScripts} from 'dwv';

export const initViewer = (tools, handleLoadProgress, handleLoad, onChangeTool) => {
    // Image decoders (for web workers)
    decoderScripts.jpeg2000 = `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpeg2000.js`;
    decoderScripts["jpeg-lossless"] = `${process.env.PUBLIC_URL}/assets/dwv/decoders/rii-mango/decode-jpegloss.js`;
    decoderScripts["jpeg-baseline"] = `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpegbaseline.js`;
    decoderScripts.rle = `${process.env.PUBLIC_URL}/assets/dwv/decoders/dwv/decode-rle.js`;

    // create app
    const app = new App();
    // initialise app
    app.init({
      "dataViewConfigs": {'*': [{divId: 'layerGroup0'}]},
      "tools": tools
    });
    // load events
    let nLoadItem = null;
    let nReceivedLoadError = null;
    let nReceivedLoadAbort = null;
    let isFirstRender = null;
    app.addEventListener('loadstart', (/*event*/) => {
        // reset flags
        nLoadItem = 0;
        nReceivedLoadError = 0;
        nReceivedLoadAbort = 0;
        isFirstRender = true;
    });
    app.addEventListener("loadprogress", (event) => {
      handleLoadProgress(event.loaded);
    });
    app.addEventListener('renderend', (/*event*/) => {
      if (isFirstRender) {
        isFirstRender = false;
        // available tools
        let selectedTool = 'ZoomAndPan';
        if (app.canScroll()) {
          selectedTool = 'Scroll';
        }
        onChangeTool(selectedTool);
      }
    });
    app.addEventListener("load", (/*event*/) => {
      handleLoad(app);
    });
    app.addEventListener('loadend', (/*event*/) => {
      if (nReceivedLoadError) {
        handleLoadProgress(0);
        alert('Received errors during load. Check log for details.');
        // show drop box if nothing has been loaded
        if (!nLoadItem) {
          //this.showDropbox(app, true);
        }
      }
      if (nReceivedLoadAbort) {
        handleLoadProgress(0);
        alert('Load was aborted.');
        //this.showDropbox(app, true);
      }
    });
    app.addEventListener('loaditem', (/*event*/) => {
      ++nLoadItem;
    });
    app.addEventListener('loaderror', (event) => {
      console.error(event.error);
      ++nReceivedLoadError;
    });
    app.addEventListener('loadabort', (/*event*/) => {
      ++nReceivedLoadAbort;
    });

    // handle key events
    app.addEventListener('keydown', (event) => {
      app.defaultOnKeydown(event);
    });

    return app;
}