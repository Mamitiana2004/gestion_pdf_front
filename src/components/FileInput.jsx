import { useRef, useState } from "react";
import { fileInput } from "./style";
export default function FileInput(props) {

    const input = useRef();
    const [fileName, setFileName] = useState();
    const clickDrop = () => {
        input.current.click();
    }
    const dragOver = (e) => {
        e.preventDefault();
    }
    const handleFileUpload = () => {
        const files = input.current.files;
        if (files.length > 0) {
            setFileName(files[0].name);
            document.getElementById("instruction").style.display = "none";
            document.getElementById("infoCSV").style.display = "block";
        }
        props.fileValue(files[0]);
    }

    const droped = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if (files.length > 0) {
            input.current.files = files;
            handleFileUpload();
        }
    }

    return (
        <div style={fileInput.container}>

            <div style={fileInput.title_container}>
                <span style={fileInput.title}>{props.label}</span><span> {props.sublabel}</span>
            </div>


            <div onDrop={droped} onDragOver={dragOver} onClick={clickDrop} style={fileInput.drag_drop}>

                <i className="pi pi-file-pdf" />
                <i style={{ display: "none" }} className="pi pi-pdf" />
                <div id="instruction" style={fileInput.instruction}>
                    <b>Choose a file</b>
                    <span> or </span>
                    <b>Drag here</b>
                </div>
                <div style={{ ...fileInput.instruction, display: "none" }} id="infoCSV">
                    <b>{fileName}</b>
                </div>
            </div>

            <input onChange={handleFileUpload} ref={input} accept={"pdf/*"} style={{ display: "none" }} type="file" />

        </div>
    )
}