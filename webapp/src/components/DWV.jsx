import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { withStyles, useTheme } from '@mui/styles';
import Typography from '@mui/material/Typography';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// https://mui.com/material-ui/material-icons/
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import ContrastIcon from '@mui/icons-material/Contrast';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StraightenIcon from '@mui/icons-material/Straighten';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';


import '../styles/DWVStyles.css';

import { getDwvVersion } from 'dwv';
import { initViewer } from '../utils/DicomViewerHandler';


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    flex: '0 0 auto',
  },
  iconSmall: {
    fontSize: 20,
  }
});

export const TransitionUp = React.forwardRef((props, ref) => (
  <Slide direction="up" {...props} ref={ref} />
))

const DWVComponent = ({file, onMetaDataChange}) => {
  const [versions, setVersions] = useState({
    dwv: getDwvVersion(),
    react: React.version
  });
  const [tools, setTools] = useState({
    Scroll: {},
    ZoomAndPan: {},
    WindowLevel: {},
    Draw: {
      options: ['Ruler']
    }
  });
  const [selectedTool, setSelectedTool] = useState('Select Tool');
  const [loadProgress, setLoadProgress] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dwvApp, setDwvApp] = useState(null);
  const [orientation, setOrientation] = useState(undefined);
  const [showDicomTags, setShowDicomTags] = useState(false);

  const theme = useTheme();

  const handleToolChange = (event, newTool) => {
    if (newTool) {
      onChangeTool(newTool);
    }
  };

  /**
   * Get the icon of a tool.
   *
   * @param {string} tool The tool name.
   * @returns {Icon} The associated icon.
   */
   const getToolIcon = (tool) => {
    let res;
    if (tool === 'Scroll') {
      res = (<MenuIcon />);
    } else if (tool === 'ZoomAndPan') {
      res = (<SearchIcon />);
    } else if (tool === 'WindowLevel') {
      res = (<ContrastIcon />);
    } else if (tool === 'Draw') {
      res = (<StraightenIcon />);
    }
    return res;
  }

  /**
   * Check if a tool can be run.
   *
   * @param {string} tool The tool name.
   * @returns {boolean} True if the tool can be run.
   */
   const canRunTool = (tool) => {
    if (!dwvApp) return false;
    let res;
    if (tool === 'Scroll') {
      res = dwvApp.canScroll();
    } else if (tool === 'WindowLevel') {
      res = dwvApp.canWindowLevel();
    } else {
      res = true;
    }
    return res;
  }

  const toolsButtons = Object.keys(tools).map((tool) => (
    <ToggleButton
      value={tool}
      key={tool}
      title={tool}
      disabled={!dataLoaded || !canRunTool(tool)}
      onChange={() => handleToolChange(tool)}
    >
      {getToolIcon(tool)}
    </ToggleButton>
  ));

  

  /**
   * Handle a change tool event.
   * @param {string} tool The new tool name.
   */
  const onChangeTool = (tool) => {
    if (dwvApp) {
      setSelectedTool(tool);
      dwvApp.setTool(tool);
      if (tool === 'Draw') {
        onChangeShape(tools.Draw.options[0]);
      }
    }
  }

  

  /**
   * Toogle the viewer orientation.
   */
  const toggleOrientation = () => {
    if (typeof (orientation) !== 'undefined') {
      if (orientation === 'axial') {
        setOrientation('coronal');
      } else if (orientation === 'coronal') {
        setOrientation('sagittal');
      } else if (orientation === 'sagittal') {
        setOrientation('axial');
      }
    } else {
      // default is most probably axial
      setOrientation('coronal');
    }
    // update data view config
    const config = {
      '*': [
        {
          divId: 'layerGroup0',
          orientation: orientation
        }
      ]
    };
    dwvApp.setDataViewConfigs(config);
    // render data
    for (let i = 0; i < dwvApp.getNumberOfLoadedData(); ++i) {
      dwvApp.render(i);
    }
  }

  /**
   * Handle a change draw shape event.
   * @param {string} shape The new shape name.
   */
  const onChangeShape = (shape) => {
    if (dwvApp) {
      dwvApp.setToolFeatures({shapeName: shape});
    }
  }

  /**
   * Handle a reset event.
   */
  const onReset = () => {
    if (dwvApp) {
      dwvApp.resetDisplay();
    }
  }

  /**
   * Open the DICOM tags dialog.
   */
  const handleTagsDialogOpen = () => {
    setShowDicomTags(true);
  }

  /**
   * Close the DICOM tags dialog.
   */
  const handleTagsDialogClose = () => {
    setShowDicomTags(false);
  };

  /**
   * 
   */
  const handleLoadProgress = (progress) => {
    setLoadProgress(progress);
  }

  /**
   * 
   */

  const handleLoad = (app) => {
    // set dicom tags
    onMetaDataChange(app.getMetaData(0))
    // set data loaded flag
    setDataLoaded(true);
  }

  useEffect(() => {
    const viewer = initViewer(tools, handleLoadProgress, handleLoad, onChangeTool);
    setDwvApp(viewer);
  }, [])

  useEffect(() => {
    if (!dwvApp) return;
    dwvApp.loadFiles([file]);
    
  },[dwvApp])



  return (
    <div id="dwv"> 
      <LinearProgress variant="determinate" value={loadProgress} />
      { dwvApp && 
        <Stack direction="row" spacing={1} padding={1} justifyContent="center">
        <ToggleButtonGroup size="small"
          color="primary"
          value={selectedTool}
          exclusive
          onChange={handleToolChange}
        >
          {toolsButtons}
        </ToggleButtonGroup>

        <ToggleButton size="small"
          value="reset"
          title="Reset"
          disabled={!dataLoaded}
          onChange={onReset}
        ><RefreshIcon /></ToggleButton>

        <ToggleButton size="small"
          value="toggleOrientation"
          title="Toggle Orientation"
          disabled={!dataLoaded}
          onClick={toggleOrientation}
        ><CameraswitchIcon /></ToggleButton>

        {/* <ToggleButton size="small"
          value="tags"
          title="Tags"
          disabled={!dataLoaded}
          onClick={handleTagsDialogOpen}
        ><LibraryBooksIcon /></ToggleButton> */}

        {/* <Dialog
          open={showDicomTags}
          onClose={handleTagsDialogClose}
          TransitionComponent={TransitionUp}
          >
            <AppBar className={classes.appBar} position="sticky">
              <Toolbar>
                <IconButton color="inherit" onClick={handleTagsDialogClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.flex}>
                  DICOM Tags
                </Typography>
              </Toolbar>
            </AppBar>
            
        </Dialog> */}
      </Stack>}

      <div id="layerGroup0" className="layerGroup">
        <div id="dropBox"></div>
      </div>

      <div><p className="legend">
        <Typography variant="caption">Powered by <Link
            href="https://github.com/ivmartel/dwv"
            title="dwv on github"
            color="inherit">dwv
          </Link> {versions.dwv} and <Link
            href="https://github.com/facebook/react"
            title="react on github"
            color="inherit">React
          </Link> {versions.react}
        </Typography>
      </p></div>

    </div>
  );

}


 

DWVComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DWVComponent);
