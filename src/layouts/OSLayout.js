import { WindowsProvider } from "../contexts/WindowsContext";

import OSPanel from './OSLayout/OSPanel.js';

function OSLayout(){
    return (
        <div className="os-layout">
            <WindowsProvider>
                <OSPanel/>
            </WindowsProvider>
        </div>
    );
}

export default OSLayout;