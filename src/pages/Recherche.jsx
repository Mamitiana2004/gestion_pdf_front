import { useEffect, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import style from './home.module.css'
import Topbar from "../layouts/Topbar";
import Sidebar from "../layouts/Sidebar";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";

export default function Recherche() {
    usePageTitle("Recherche")
    const [sidebarStatut, setSidebarStatut] = useState(1);
    const changeStatut = () => {
        if (sidebarStatut === 1) {
            setSidebarStatut(0);
        }
        else {
            setSidebarStatut(1);
        }
    }

    const [pdf, setPdf] = useState([{
        id: 0, nom: "", nom_serveur: ""
    }]);

    const [contenu, setContenu] = useState();
    const [nom, setNom] = useState();

    const [resultContenu,setResultContenu] = useState([]);

    const searchByName = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_pdf_name?text=${nom}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => setPdf(data.resultat))
            .catch((error) => console.error(error))
            setResultContenu([])
        }
    
    const searchByContenu = () =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_in_pdf?text=${contenu}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => setResultContenu(data))
            .catch((error) => console.error(error))
    }

    

    const getAllPDF = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/getAll`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => setPdf(data.data))
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        getAllPDF()
    }, [])


    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <InputText placeholder="Contenu" id="Contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} />
                <Button onClick={()=>searchByContenu()} icon="pi pi-search" />
            </div>
        );
    };

    const downloadPdf = (name, nom_file) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/download/${name}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file");
                }
                return response.blob(); // Convert the response to a Blob
            })
            .then((blob) => {
                // Create a URL for the Blob
                const url = window.URL.createObjectURL(blob);

                // Create a temporary <a> element to trigger the download
                const a = document.createElement("a");
                a.href = url;
                a.download = `${nom_file}.pdf`; // Use the file name from the response or a custom name
                document.body.appendChild(a);
                a.click();

                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch((error) => {
                console.error("Error downloading file:", error);
            });
    };


    const contenuTemplate = (item, index) => {
        if (resultContenu.length > 0) {
            return (
                <div key={index} className={style.contenu_wrapper}>
                    <div className={style.contenu_left}>
                        <i style={{ fontSize: '80px' }} className="pi pi-file-pdf" />
                    </div>
                    <div className={style.contenu_right}>
                        <div className={style.contenu_detail}>
                            <span className={style.contenu_title}>{item.pdf_file}.pdf</span>
                            <div className={style.contenu_detail_label}>
                                <span>Ce contenu est disponible dans ce pdf à la PageLinks : <b>{item.page}</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            );    
        }
        else{
            return (
                <div key={index} className={style.contenu_wrapper}>
                    <div className={style.contenu_left}>
                        <i style={{ fontSize: '80px' }} className="pi pi-file-pdf" />
                    </div>
                    <div className={style.contenu_right}>
                        <div className={style.contenu_detail}>
                            <span className={style.contenu_title}>{item.nom}.pdf</span>
                            <div className={style.contenu_detail_label}>
                                <span>Vessel : <b>Indisponible</b></span>
                                <span>Voyage : <b>Indisponible</b></span>
                                <span>Nombre de page : <b>Indisponible</b></span>
                            </div>
                        </div>
                        <Button icon="pi pi-download" onClick={() => downloadPdf(item.nom_serveur, item.nom)} className={style.contenu_download_btn} label="Telecharger" />
                    </div>
                </div>
            );
        }
    }

    const list_contenu_template = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return contenuTemplate(product, index);
        });

        return <div className={style.contenu_container}>{list}</div>
    }

    const header = () => {
        return <>
            <InputText placeholder="Nom du pdf" id="Nom" value={nom} onChange={(e) => setNom(e.target.value)} /> <Button icon="pi pi-search" onClick={()=>searchByName()}/>
        </>
    }

    return (
        <>
            <Topbar onMenuClick={changeStatut} />
            <Sidebar statut={sidebarStatut} />
            <div className={style.container}>
                <div className={style.wrapper}>
                    <Toolbar left={leftToolbarTemplate} style={{ width: "100%" }} />
                    <DataView header={header()} paginator rows={3} value={resultContenu.length > 0 ? resultContenu : pdf} listTemplate={list_contenu_template} itemTemplate={contenuTemplate} style={{ width: "100%" }} />
                </div>
            </div>
        </>
    )
}