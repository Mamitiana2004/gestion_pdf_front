import { useEffect, useRef, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import style from './pdf.module.css'
import Topbar from "../layouts/Topbar";
import { Toolbar } from "primereact/toolbar";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from "primereact/tooltip";
import FileInput from "../components/FileInput";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import { Sidebar } from 'primereact/sidebar';

export default function Recherche() {
    usePageTitle("Recherche")
    const [loading, setLoading] = useState(false);
    const [affichePDF, setAffichagePDF] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(0);

    const [visibleImport, setVisibleImport] = useState(false);

    const [pdfFile, setPdfFile] = useState(null);

    const toast = useRef(null);

    const [sidebarVisible, setSidebarVisible] = useState(false);


    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');

    const [sortKey, setSortKey] = useState('');

    const sortOption = [
        { label: 'A à Z', value: 'nom' },
        { label: 'Z à A', value: '!nom' }
    ]


    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };


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
            .then(data => {
                setPdf(data.resultat)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
        setResultContenu([])
    }

    const searchByContenu = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_in_pdf?text=${contenu}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => { setResultContenu(assembler(data, pdf)); console.log() })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }



    const getAllPDF = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/getAll`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                let donnee = [];
                data.data.map((d) => {
                    donnee.push({
                        ...d,
                        items: [
                            {
                                label: "Voir le Pdf",
                                icon: "pi pi-eye",
                                command: () => {
                                    viewPDF(d.nom_serveur, d.nom)
                                }
                            },
                            // {
                            //     label: 'Supprimer',
                            //     icon: "pi pi-trash",
                            //     command: () => {

                            //     }
                            // }
                        ]
                    })
                });
                setPdf(donnee)

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        getAllPDF()
    }, [])


    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <Button icon="pi pi-plus" onClick={() => setVisibleImport(true)} className={style.button_import} label="Ajouter un nouveau document" />
                <Dropdown style={{ width: "200px" }} options={sortOption} value={sortKey} optionLabel="label" placeholder="Trier par nom" onChange={onSortChange} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button onClick={() => setSidebarVisible(true)} className={style.button_import} icon="pi pi-search" label="Recherche" />
    }

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
            })
            .finally(() => setLoading(false));
        setAffichagePDF(true)
    };

    const viewPDFContenu = (item) => {
        setLoading(true)
        setSelected(item)
        setPage(item.pages[0])
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
            })
            .finally(() => setLoading(false));
        setAffichagePDF(true)
    };


    const contenuTemplate = (item, index) => {
        if (resultContenu.length > 0) {
            return (
                <div key={index} className={style.pdf_container}>
                    <div className={style.pdf_title}>
                        <i className="pi pi-file-pdf" />
                        <span className={style.contenu_title}>{item.nom}.pdf</span>
                    </div>
                    <div className={style.pdf_detail_container}>
                        <span className={style.pdf_detail_title}>Detail</span>
                        <div className={style.pdf_detail}>
                            <span>Le contenu <b>{contenu}</b> est disponible dans ce pdf.</span>
                        </div>
                        <br />
                        <Button icon="pi pi-eye" onClick={() => viewPDFContenu(item)} className={style.pdf_detail_button} label="Voir le document PDF   " />
                    </div>
                </div>
            );
        }
        else {
            return (
                <div key={index} className={style.pdf_container}>
                    <SpeedDial
                        pt={{
                            menuitem: ({ state }) => ({
                                className: style.menu_item_pdf
                            })
                        }}
                        buttonClassName={style.menu_button_btn}
                        showIcon="pi pi-cog"
                        hideIcon="pi pi-times"
                        transitionDelay={80}
                        id="detail"
                        className={style.menu_button}
                        model={item.items}
                        direction="down"
                    />


                    <div className={style.pdf_title}>
                        <i className="pi pi-file-pdf" />
                        <span className={style.contenu_title}>{item.nom}.pdf</span>
                    </div>
                    <div className={style.pdf_detail_container}>
                        <span className={style.pdf_detail_title}>Detail</span>
                        <div className={style.pdf_detail}>
                            <span>Date d'ajout : <b>Indisponible</b></span>
                            <span>Nombre de page : <b>Indisponible</b></span>
                        </div>
                        <br />
                        <Button icon="pi pi-database" onClick={() => viewPDF(item.nom_serveur, item.nom)} className={style.pdf_detail_button} label="Voir les données   " />
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



    const sendDataPdf = (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("file", pdfFile);
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/import`, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Pdf importe', life: 3000 });

            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'Pdf non insere , erreur du serveur', life: 3000 });
                console.log(error)
            })
            .finally(() => setLoading(false))
        setVisibleImport(false)
    }

    return (
        <>
            {
                !loading ?
                    <>
                        <Topbar name="pdf"/>
                        <Tooltip target="#detail .p-speeddial-action" position="left" />
                        <Dialog draggable={false} visible={visibleImport} onHide={() => setVisibleImport(false)} header="Importer un nouveau PDF" footer={<Button onClick={sendDataPdf} className={style.import_pdf} label="Ajouter ce document" />}>
                            <FileInput fileValue={setPdfFile} />
                        </Dialog>
                        <div className={style.container}>
                            <span className={style.container_title}>Document PDF</span>
                            <span className={style.container_subtitle}>
                                Les documents PDF seront stocker et traiter ici
                            </span>
                            <hr />
                            <div className={style.wrapper}>
                                <Toolbar right={rightToolbarTemplate} className={style.toolbar_container} left={leftToolbarTemplate} style={{ width: "100%" }} />
                                <DataView sortField={sortField} sortOrder={sortOrder} paginator rows={8} value={resultContenu.length > 0 ? resultContenu : pdf} listTemplate={list_contenu_template} itemTemplate={contenuTemplate} style={{ width: "100%" }} />
                            </div>
                        </div>
                        <Dialog header="Voir le pdf" visible={affichePDF} onHide={() => setAffichagePDF(false)} maximized={true}>
                            {pdfURL ?
                                <iframe
                                    src={pdfURL}
                                    width="100%"
                                    height="100%"
                                    title="PDF Viewer"
                                />
                                :
                                <></>}
                        </Dialog>
                    </>
                    :
                    <>
                        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ProgressSpinner />
                        </div>
                    </>
            }

            <Sidebar
                position="right"
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}
            >

                <div className={style.search_container}>
                    <span className={style.search_container_title}>Recherche</span>
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Contenu</span>
                        <input value={contenu} onChange={(e) => setContenu(e.target.value)} className={style.search_item_input} placeholder="Rechercher par contenu" type="text" />
                        <button onClick={() => { setSidebarVisible(false); searchByContenu() }} className={style.search_item_button}>Rechercher</button>
                    </div>
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Nom du document</span>
                        <input value={nom} onChange={(e) => setNom(e.target.value)} className={style.search_item_input} placeholder="Rechercher par nom du PDF" type="text" />
                        <button onClick={() => { setSidebarVisible(false); searchByName() }} className={style.search_item_button}>Rechercher</button>
                    </div>
                </div>

            </Sidebar>

            <Toast ref={toast} />
        </>
    )


}