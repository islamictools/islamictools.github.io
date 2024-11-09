import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWindows } from "../../contexts/WindowsContext.js";

const Window = ({
  id = Date.now(),
  title = 'Untitled Window',
  actions = {
    hide: true,
    resize: true,
    move: true,
    fullscreen: true,
    close: true
  },
  states = {
    hidden: false,
    fullscreen: false
  },
  x = 100,
  y = 100,
  w = 400,
  h = 300,
  z = 1,
  children = null,
}) => {

  // Window Hook
  const { delWindow, setActive } = useWindows();

  // State
  const [windowState, setWindowState] = useState({
    id, title, actions, states, x, y, w, h,
    isDragging: false,
    dragX: 0, dragY: 0, windowX: 0, windowY: 0,
    isResizing: false,
    resizeX: 0, resizeY: 0, windowW: 0, windowH: 0,
  });

  // Listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleActive = () => {
    setActive(id);
  }

  const handleMouseDown = (e) => {
    if (!windowState.actions.move) return;
    e.preventDefault();
    setWindowState((prevState) => ({
      ...prevState,
      isDragging: true,
      dragX: e.clientX,
      dragY: e.clientY,
      windowX: prevState.x, // Use prevState to ensure correct values
      windowY: prevState.y,
    }));
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    setWindowState((prevState) => {
      if (prevState.isDragging) {
        const dx = e.clientX - prevState.dragX;
        const dy = e.clientY - prevState.dragY;
        return {
          ...prevState,
          x: prevState.windowX + dx,
          y: prevState.windowY + dy,
        };
      } else if (prevState.isResizing) {
        const dw = e.clientX - prevState.resizeX;
        const dh = e.clientY - prevState.resizeY;
        return {
          ...prevState,
          w: Math.max(300, prevState.windowW + dw),
          h: Math.max(100, prevState.windowH + dh),
        };
      }
      return prevState;
    });
  };
  
  const handleMouseUp = () => {
    setWindowState((prevState) => ({
      ...prevState,
      isDragging: false,
      isResizing: false,
    }));
    document.body.style.userSelect = 'auto';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  

  // callback: resize_mousemove
  const handleResizeMouseDown = (e) => {
    if (!windowState.actions.resize) return;
    e.preventDefault();
    e.stopPropagation();
    setWindowState((prevState) => ({
      ...prevState,
      isResizing: true,
      resizeX: e.clientX,
      resizeY: e.clientY,
      windowW: windowState.w,
      windowH: windowState.h,
    }));
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // callback: fullscreen
  const toggleFullscreen = () => {
    setWindowState((prevState) => ({
      ...prevState,
      states: {
        ...prevState.states,
        fullscreen: !prevState.states.fullscreen,
      },
    }));
  };

  // callback: hide
  const toggleHide = () => {
    setWindowState((prevState) => ({
      ...prevState,
      states: {
        ...prevState.states,
        hidden: !prevState.states.hidden,
      },
    }));
  };

  // callback: close
  const handleClose = () => {
    setWindowState((prevState) => ({
      ...prevState,
      states: {
        ...prevState.states,
        hidden: true,
      },
    }));
    delWindow(windowState.id);
  };

  // Do not render if hidden
  const { fullscreen, hidden } = windowState.states;
  if (hidden) return null;

  // Make classes
  const classes = ['window'];
  if (fullscreen) classes.push('fullscreen');
  if (hidden    ) classes.push('hidden');

  // Add Styles
  const windowStyle = {
    top: fullscreen ? 0 : `${windowState.y}px`,
    left: fullscreen ? 0 : `${windowState.x}px`,
    width: fullscreen ? '100%' : `${windowState.w}px`,
    height: fullscreen ? '100%' : `${windowState.h}px`,
    zIndex: z,
  };

  // Render Window
  return (
    <div className={classes.join(' ')} style={windowStyle} onMouseDown={handleActive}>
      <div className={`title-bar cursor-${windowState.isDragging ? 'grabbing' : 'grab'}`} onMouseDown={handleMouseDown} >
        <span>{windowState.title}</span>
        <div className="actions">
          {windowState.actions.hide && (<button onClick={toggleHide} title="Hide"> - </button>)}
          {windowState.actions.fullscreen && (<button onClick={toggleFullscreen} title="Fullscreen">{fullscreen ? '🗗' : '🗖'}</button>)}
          {windowState.actions.close && (<button onClick={handleClose} title="Close">&#x2715;</button>)}
        </div>
      </div>
      <div className="content">
        {children || <p>This is the content of the window.</p>}
      </div>
      {windowState.actions.resize && (<div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>)}
    </div>
  );
};

Window.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  actions: PropTypes.shape({ hide: PropTypes.bool, resize: PropTypes.bool, move: PropTypes.bool, fullscreen: PropTypes.bool, close: PropTypes.bool, }),
  states: PropTypes.shape({ hidden: PropTypes.bool, fullscreen: PropTypes.bool, }),
  x: PropTypes.number, y: PropTypes.number, w: PropTypes.number, h: PropTypes.number, children: PropTypes.node,
};

export default Window;
