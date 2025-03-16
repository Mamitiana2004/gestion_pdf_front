import { useEffect, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import style from './home.module.css'
import Topbar from "../layouts/Topbar";
import Sidebar from "../layouts/Sidebar";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

export default function Recherche() {
    usePageTitle("Recherche")
    const [loading, setLoading] = useState(false);
    const [affichePDF, setAffichagePDF] = useState(false);
    const [selected,setSelected] = useState(null);
    const [page,setPage] = useState(0);

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

    const [resultContenu, setResultContenu] = useState([]);

    const searchByName = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_pdf_name?text=${nom}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => setPdf(data.resultat))
            .catch((error) => console.error(error))
        setResultContenu([])
        setLoading(false)
    }

    const searchByContenu = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_in_pdf?text=${contenu}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => { setResultContenu(assembler(data, pdf)); console.log() })
            .catch((error) => console.error(error))
            setLoading(false)
    }



    const getAllPDF = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/getAll`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                setPdf(data.data);
                console.log(data.data);

            })
            .catch((error) => console.error(error))
        setLoading(false)
    }

    useEffect(() => {
        getAllPDF()
    }, [])


    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <InputText placeholder="Contenu" id="Contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} />
                <Button onClick={() => searchByContenu()} icon="pi pi-search" />
            </div>
        );
    };

    const [pdfURL, setPdfURL] = useState("");
    const viewPDF = (name, nom_file) => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/${name}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file");
                }
                return response.blob(); // Convert the response to a Blob
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                setPdfURL(url)

            })
            .catch((error) => {
                console.error("Error downloading file:", error);
            });
        setLoading(false)
        setAffichagePDF(true)
    };
    
    const viewPDFContenu = (item) => {
        setSelected(item)
        setPage(item.pages[0])
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/${item.nom_serveur}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file");
                }
                return response.blob(); // Convert the response to a Blob
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                setPdfURL(url)

            })
            .catch((error) => {
                console.error("Error downloading file:", error);
            });
        setLoading(false)
        setAffichagePDF(true)
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
                            <span className={style.contenu_title}>{item.nom}.pdf</span>
                            <div className={style.contenu_detail_label}>
                                <span>Ce contenu est disponible dans ce pdf à la PageLinks : <b>{item.pages.map(page => {
                                    return page + " ,"
                                })}</b></span>
                            </div>
                        </div>
                        <Button icon="pi pi-download" onClick={() => viewPDFContenu(item)} className={style.contenu_download_btn} label="Voir le PDF" />
                    </div>
                </div>
            );
        }
        else {
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
                        <Button icon="pi pi-download" onClick={() => viewPDF(item.nom_serveur, item.nom)} className={style.contenu_download_btn} label="Voir le PDF" />
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


    const assembler = (data, pdf) => {
        // Créer un objet pour stocker les informations des fichiers PDF et leurs pages
        const resultat = {};

        // Parcourir les données pour regrouper les pages par fichier PDF
        data.forEach(item => {
            const pdfId = item.pdf_file_id;
            if (!resultat[pdfId]) {
                // Si le PDF n'existe pas encore dans l'objet, l'initialiser
                resultat[pdfId] = {
                    pdf_file_id: pdfId,
                    pdf_file: item.pdf_file,
                    pages: []
                };
            }
            // Ajouter la page à la liste des pages du PDF
            resultat[pdfId].pages.push(item.page);
        });

        // Ajouter les informations supplémentaires du tableau `pdf`
        pdf.forEach(pdfItem => {
            const pdfId = pdfItem.id;
            if (resultat[pdfId]) {
                resultat[pdfId].nom_serveur = pdfItem.nom_serveur;
                resultat[pdfId].nom = pdfItem.nom;
            }
        });

        // Convertir l'objet en tableau et trier par pdf_file_id
        const resultatFinal = Object.values(resultat).sort((a, b) => a.pdf_file_id - b.pdf_file_id);

        return resultatFinal;
    }

    const header = () => {
        return <>
            <InputText placeholder="Nom du pdf" id="Nom" value={nom} onChange={(e) => setNom(e.target.value)} /> <Button icon="pi pi-search" onClick={() => searchByName()} />
        </>
    }

    if (!loading) {

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
                <Dialog header="Voir le pdf" visible={affichePDF} onHide={() => setAffichagePDF(false)} maximized={true}>
                    {pdfURL  && resultContenu.length === 0 ?
                        <iframe
                            src={pdfURL}
                            width="100%"
                            height="100%"
                            title="PDF Viewer"
                        />
                        :
                        <></>}
                    {pdfURL && selected && resultContenu.length > 0 ?
                        <>  
                            <p>Voir à la page : {selected.pages.map((p,i)=>{
                                return <button key={i} onClick={()=>setPage(p)}>{p}</button>
                            })}</p>

                            <iframe
                                key={page}
                                id="pdfViewer"
                                src={`${pdfURL}#page=${page}`}
                                width="100%"
                                height="100%"
                                title="PDF Viewer"
                            />
                        </>
                        :
                        <></>}
                </Dialog>
            </>
        )
    }
    else {
        return <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ProgressSpinner />
        </div>
    }
}