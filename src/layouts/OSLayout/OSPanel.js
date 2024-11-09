import { useWindows } from "../../contexts/WindowsContext.js";
import Window from "./Window.js";

function OSPanel(){
    const { windows, addWindow, make_id } = useWindows();
    document.windows = windows;

    function addWindowHandle(){
        const l = windows.length+1;

        addWindow({
            id: make_id(l),
            title: 'My Custom Window',
            actions: {
                hide: true,
                resize: true,
                move: true,
                fullscreen: true,
                close: true,
            },
            states: {
                hidden: false,
                fullscreen: false,
            },
            x: 150,
            y: 150,
            w: 500,
            h: 400,
            z: l,
        });
    }

    let counter = 1;

    return (
        <div className="os-panel" onDoubleClick={addWindowHandle}>
            {windows.map(props => <Window {...{...props, z: counter++}} key={props.id}/>)}
        </div>
    );
}

export default OSPanel;