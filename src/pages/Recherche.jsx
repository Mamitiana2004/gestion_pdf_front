"use client"

import { Helix } from "ldrs/react"
import "ldrs/react/Helix.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { DataView } from "primereact/dataview"
import { Dialog } from "primereact/dialog"
import { Divider } from "primereact/divider"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { Sidebar } from "primereact/sidebar"
import { SpeedDial } from "primereact/speeddial"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { Tooltip } from "primereact/tooltip"
import { useEffect, useRef, useState } from "react"
import FileInput from "../components/FileInput"
import Format from "../helpers/Format.min"
import usePageTitle from "../hooks/usePageTitle"
import Topbar from "../layouts/Topbar"
import style from "./pdf.module.css"

export default function Recherche() {
    usePageTitle("Recherche")
    const [loading, setLoading] = useState(false)
    const [affichePDF, setAffichagePDF] = useState(false)
    const [afficheDetail, setAffichageDetail] = useState(false)
    const [selected, setSelected] = useState(null)
    const [page, setPage] = useState(0)

    const [data, setData] = useState(null)

    const [visibleImport, setVisibleImport] = useState(false)

    const [pdfFile, setPdfFile] = useState(null)
    // Nouveaux états pour les pages
    const [startPage, setStartPage] = useState(1)
    const [endPage, setEndPage] = useState(null)
    const [totalPages, setTotalPages] = useState(null)

    const toast = useRef(null)

    const [sidebarVisible, setSidebarVisible] = useState(false)

    const [sortOrder, setSortOrder] = useState(0)
    const [sortField, setSortField] = useState("")

    const [sortKey, setSortKey] = useState("")

    const sortOption = [
        { label: "A à Z", value: "nom" },
        { label: "Z à A", value: "!nom" },
    ]

    const onSortChange = (event) => {
        const value = event.value

        if (value.indexOf("!") === 0) {
            setSortOrder(-1)
            setSortField(value.substring(1, value.length))
            setSortKey(value)
        } else {
            setSortOrder(1)
            setSortField(value)
            setSortKey(value)
        }
    }

    const [pdf, setPdf] = useState([])

    const [contenu, setContenu] = useState()
    const [nom, setNom] = useState()
    const [vessel, setVessel] = useState()
    const [voyage, setVoyage] = useState()

    const [resultContenu, setResultContenu] = useState([])

    // Fonction pour détecter le nombre de pages du PDF
    const handleFileChange = (file) => {
        setPdfFile(file)
        if (file) {
            setTotalPages(10)
            setEndPage(10)
        }
    }

    const searchByName = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_pdf_name?text=${nom}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                const donnee = []
                data.resultat.map((d) => {
                    donnee.push({
                        ...d,
                        items: [
                            {
                                label: "Voir le Pdf",
                                icon: "pi pi-eye",
                                command: () => {
                                    viewPDF(d.id)
                                },
                            },
                        ],
                    })
                })
                setPdf(donnee)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
        setResultContenu([])
    }

    const searchByVessel = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_pdf_vessel?text=${vessel}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                const donnee = []
                data.resultat.map((d) => {
                    donnee.push({
                        ...d,
                        items: [
                            {
                                label: "Voir le Pdf",
                                icon: "pi pi-eye",
                                command: () => {
                                    viewPDF(d.id)
                                },
                            },
                        ],
                    })
                })
                setPdf(donnee)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
        setResultContenu([])
    }

    const searchByVoyage = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_pdf_voyage?text=${voyage}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                const donnee = []
                data.resultat.map((d) => {
                    donnee.push({
                        ...d,
                        items: [
                            {
                                label: "Voir le Pdf",
                                icon: "pi pi-eye",
                                command: () => {
                                    viewPDF(d.id)
                                },
                            },
                        ],
                    })
                })
                setPdf(donnee)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
        setResultContenu([])
    }

    const searchByContenu = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/search/search_in_pdf?text=${contenu}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                setResultContenu(assembler(data, pdf))
                console.log()
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
    }

    const getAllPDF = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/getAll`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                const donnee = []
                data.data.map((d) => {
                    donnee.push({
                        ...d,
                        items: [
                            {
                                label: "Voir le Pdf",
                                icon: "pi pi-eye",
                                command: () => {
                                    viewPDF(d.id)
                                },
                            },
                        ],
                    })
                })
                setPdf(donnee)
            })
            .catch((error) => {
                console.error(error)

                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Erreur de serveur",
                    life: 3000,
                })
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getAllPDF()
        console.log(data)
    }, [])

    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <Button
                    icon="pi pi-plus"
                    onClick={() => setVisibleImport(true)}
                    className={style.button_import}
                    label="Ajouter un nouveau document"
                />
                <Dropdown
                    className={style.dropdown_filter_name}
                    options={sortOption}
                    value={sortKey}
                    optionLabel="label"
                    placeholder="Trier par nom"
                    onChange={onSortChange}
                />
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <Button
                onClick={() => setSidebarVisible(true)}
                className={style.button_import}
                icon="pi pi-search"
                label="Recherche"
            />
        )
    }

    const [pdfURL, setPdfURL] = useState("")
    const viewPDF = (id) => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/${id}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file")
                }
                return response.blob()
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                setPdfURL(url)
            })
            .catch((error) => {
                console.error("Error downloading file:", error)
            })
            .finally(() => setLoading(false))
        setAffichagePDF(true)
    }

    const viewPDFContenu = (item) => {
        setLoading(true)
        setSelected(item)
        setPage(item.pages[0])
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/${item.id}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file")
                }
                return response.blob()
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                setPdfURL(url)
            })
            .catch((error) => {
                console.error("Error downloading file:", error)
            })
            .finally(() => setLoading(false))
        setAffichagePDF(true)
    }

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
                            <span>
                                Le contenu <b>{contenu}</b> est disponible dans ce pdf.
                            </span>
                        </div>
                        <br />
                        <Button
                            icon="pi pi-eye"
                            onClick={() => viewPDFContenu(item)}
                            className={style.pdf_detail_button}
                            label="Voir le document PDF   "
                        />
                    </div>
                </div>
            )
        } else {
            return (
                <div key={index} className={style.pdf_container}>
                    <SpeedDial
                        pt={{
                            menuitem: ({ state }) => ({
                                className: style.menu_item_pdf,
                            }),
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
                            <span>
                                Date d'ajout : <b>{Format.formatDate(item.date_ajout)}</b>
                            </span>
                            <span>
                                Nombre de page : <b>{item.nombre_page}</b>
                            </span>
                        </div>
                        <br />
                        <Button
                            icon="pi pi-database"
                            onClick={() => viewData(item)}
                            className={style.pdf_detail_button}
                            label="Voir les données   "
                        />
                    </div>
                </div>
            )
        }
    }

    const viewData = (item) => {
        setLoading(true)
        setSelected(item)
        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/get_test/${item.id}`, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download file")
                }
                return response.json()
            })
            .then((data) => {
                console.log("Données reçues:", data)
                setData(data)
            })
            .catch((error) => {
                console.error("Error downloading file:", error)
            })
            .finally(() => setLoading(false))
        setAffichageDetail(true)
    }

    const list_contenu_template = (items) => {
        if (!items || items.length === 0) return null

        const list = items.map((product, index) => {
            return contenuTemplate(product, index)
        })

        return <div className={style.contenu_container}>{list}</div>
    }

    const assembler = (data, pdf) => {
        const resultat = {}

        data.forEach((item) => {
            const pdfId = item.pdf_file_id
            if (!resultat[pdfId]) {
                resultat[pdfId] = {
                    pdf_file_id: pdfId,
                    pdf_file: item.pdf_file,
                    pages: [],
                }
            }
            resultat[pdfId].pages.push(item.page)
        })

        pdf.forEach((pdfItem) => {
            const pdfId = pdfItem.id
            if (resultat[pdfId]) {
                resultat[pdfId].nom_serveur = pdfItem.nom_serveur
                resultat[pdfId].nom = pdfItem.nom
            }
        })

        const resultatFinal = Object.values(resultat).sort((a, b) => a.pdf_file_id - b.pdf_file_id)

        return resultatFinal
    }

    // Fonction modifiée pour inclure les pages
    const sendDataPdf = (e) => {
        e.preventDefault()

        // Validation des champs
        if (!pdfFile) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Veuillez sélectionner un fichier PDF",
                life: 3000,
            })
            return
        }

        if (!startPage || !endPage) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Veuillez spécifier les pages de début et de fin",
                life: 3000,
            })
            return
        }

        if (startPage > endPage) {
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "La page de début doit être inférieure ou égale à la page de fin",
                life: 3000,
            })
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("file", pdfFile)
        formData.append("start_page", startPage.toString())
        formData.append("end_page", endPage.toString())

        fetch(`${process.env.REACT_APP_API_URL}/api/pdf/import`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `PDF importé (pages ${startPage} à ${endPage})`,
                    life: 3000,
                })
                // Réinitialiser les champs
                setPdfFile(null)
                setStartPage(1)
                setEndPage(null)
                setTotalPages(null)
                getAllPDF() // Recharger la liste
            })
            .catch((error) => {
                toast.current.show({
                    severity: "error",
                    summary: "Erreur",
                    detail: "PDF non inséré, erreur du serveur",
                    life: 3000,
                })
                console.log(error)
            })
            .finally(() => setLoading(false))
        setVisibleImport(false)
    }

    // Templates pour formater les données ManifestEntry
    const formatPoids = (rowData) => {
        return rowData.poids ? `${Format.formatNombre(rowData.poids)} kg` : "N/A"
    }

    const formatVolume = (rowData) => {
        return rowData.volume ? `${Format.formatNombre(rowData.volume)} m³` : "N/A"
    }

    const formatDate = (rowData) => {
        return rowData.date ? Format.formatDate(rowData.date) : "N/A"
    }

    const formatProduits = (rowData) => {
        const produits = rowData.produits || "N/A"
        if (produits.length > 50) {
            return <span title={produits}>{produits.substring(0, 50)}...</span>
        }
        return produits
    }

    return (
        <>
            {!loading ? (
                <>
                    <Topbar name="pdf" />
                    <Tooltip target="#detail .p-speeddial-action" position="left" />
                    <Dialog
                        draggable={false}
                        visible={visibleImport}
                        onHide={() => {
                            setVisibleImport(false)
                            setPdfFile(null)
                            setStartPage(1)
                            setEndPage(null)
                            setTotalPages(null)
                        }}
                        header="Importer un nouveau PDF"
                        style={{ width: "500px" }}
                        footer={
                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                <Button
                                    label="Annuler"
                                    icon="pi pi-times"
                                    onClick={() => setVisibleImport(false)}
                                    className="p-button-text"
                                />
                                <Button
                                    onClick={sendDataPdf}
                                    className={style.import_pdf}
                                    label="Ajouter ce document"
                                    icon="pi pi-upload"
                                    disabled={!pdfFile || !startPage || !endPage}
                                />
                            </div>
                        }
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Fichier PDF *</label>
                                <FileInput fileValue={handleFileChange} />
                            </div>

                            {pdfFile && (
                                <>
                                    <div style={{ display: "flex", gap: "15px" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                                                Page de début *
                                            </label>
                                            <InputNumber
                                                value={startPage}
                                                onValueChange={(e) => setStartPage(e.value)}
                                                min={1}
                                                max={totalPages || 999}
                                                placeholder="Ex: 1"
                                                style={{ width: "100%" }}
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Page de fin *</label>
                                            <InputNumber
                                                value={endPage}
                                                onValueChange={(e) => setEndPage(e.value)}
                                                min={startPage || 1}
                                                max={totalPages || 999}
                                                placeholder="Ex: 10"
                                                style={{ width: "100%" }}
                                            />
                                        </div>
                                    </div>

                                    {totalPages && (
                                        <div
                                            style={{
                                                padding: "10px",
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                color: "#6c757d",
                                            }}
                                        >
                                            <i className="pi pi-info-circle" style={{ marginRight: "8px" }}></i>
                                            Document détecté avec {totalPages} page(s)
                                        </div>
                                    )}

                                    {startPage && endPage && (
                                        <div
                                            style={{
                                                padding: "10px",
                                                backgroundColor: "#e7f3ff",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                color: "#0066cc",
                                            }}
                                        >
                                            <i className="pi pi-check-circle" style={{ marginRight: "8px" }}></i>
                                            {endPage - startPage + 1} page(s) seront traitées (de la page {startPage} à {endPage})
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Dialog>

                    <div className={style.container}>
                        <span className={style.container_title}>Document PDF</span>
                        <span className={style.container_subtitle}>Les documents PDF seront stockés et traités ici</span>
                        <hr />
                        <div className={style.wrapper}>
                            <Toolbar
                                right={rightToolbarTemplate}
                                className={style.toolbar_container}
                                left={leftToolbarTemplate}
                                style={{ width: "100%" }}
                            />
                            <DataView
                                sortField={sortField}
                                sortOrder={sortOrder}
                                paginator
                                rows={8}
                                value={resultContenu.length > 0 ? resultContenu : pdf}
                                listTemplate={list_contenu_template}
                                itemTemplate={contenuTemplate}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    <Dialog header="Voir le pdf" visible={affichePDF} onHide={() => setAffichagePDF(false)} maximized={true}>
                        {pdfURL ? (
                            <iframe src={pdfURL} width="100%" height="100%" title="PDF Viewer" />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Helix size="125" speed="2.5" color="black" />
                            </div>
                        )}
                    </Dialog>
                </>
            ) : (
                <>
                    <div
                        style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <Helix size="125" speed="2.5" color="black" />
                    </div>
                </>
            )}

            <Dialog
                draggable={false}
                header="Détail du PDF - Données extraites"
                visible={afficheDetail}
                onHide={() => {
                    setAffichageDetail(false)
                    setData(null)
                }}
                maximized={true}
            >
                {data && Array.isArray(data) && data.length > 0 ? (
                    <div className={style.pdf_donnee_container}>
                        <div className={style.pdf_donnee_header}>
                            <span className={style.pdf_donnee_header_title}>
                                Nom du document : <span>{selected?.nom}.pdf</span>
                            </span>
                            <span className={style.pdf_donnee_header_subtitle}>
                                Ce document contient {data.length} entrée(s) de manifeste extraites par l'IA. Voici les informations
                                détaillées sur les navires et leurs cargaisons.
                            </span>
                        </div>

                        {/* Informations générales du premier élément */}
                        {data[0] && (
                            <>
                                <span className={style.pdf_donnee_title}>Informations générales</span>
                                <div className={style.pdf_donnee_detail}>
                                    <div className={style.pdf_donnee_detail_item}>
                                        <span>Navire</span>
                                        <span className={style.pdf_donnee_detail_item_value}>{data[0].name}</span>
                                    </div>
                                    <div className={style.pdf_donnee_detail_item}>
                                        <span>Pavillon</span>
                                        <span className={style.pdf_donnee_detail_item_value}>{data[0].flag}</span>
                                    </div>
                                    <div className={style.pdf_donnee_detail_item}>
                                        <span>Date</span>
                                        <span className={style.pdf_donnee_detail_item_value}>{formatDate(data[0])}</span>
                                    </div>
                                    <div className={style.pdf_donnee_detail_item}>
                                        <span>Nombre d'entrées</span>
                                        <span className={style.pdf_donnee_detail_item_value}>{data.length}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <span className={style.pdf_donnee_title}>Détail des entrées de manifeste</span>
                        <DataTable
                            style={{ width: "100%" }}
                            value={data}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} entrées"
                            showGridlines
                            stripedRows
                        >
                            <Column field="id" header="ID" sortable style={{ width: "80px" }} />
                            <Column field="name" header="Navire" sortable style={{ minWidth: "150px" }} />
                            <Column field="flag" header="Pavillon" sortable style={{ width: "100px" }} />
                            <Column field="produits" header="Produits" body={formatProduits} style={{ minWidth: "200px" }} />
                            <Column field="poids" header="Poids" body={formatPoids} sortable style={{ width: "120px" }} />
                            <Column field="volume" header="Volume" body={formatVolume} sortable style={{ width: "120px" }} />
                            <Column field="date" header="Date" body={formatDate} sortable style={{ width: "120px" }} />
                            <Column field="page" header="Page" sortable style={{ width: "80px" }} />
                        </DataTable>
                    </div>
                ) : (
                    <div
                        style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        {data === null ? (
                            <Helix size="125" speed="2.5" color="black" />
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <i className="pi pi-info-circle" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                                <h3>Aucune donnée disponible</h3>
                                <p>Ce document ne contient pas de données extraites.</p>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>

            <Sidebar position="right" visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
                <div className={style.search_container}>
                    <span className={style.search_container_title}>Recherche</span>
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Contenu</span>
                        <input
                            value={contenu}
                            onChange={(e) => setContenu(e.target.value)}
                            className={style.search_item_input}
                            placeholder="Rechercher par contenu"
                            type="text"
                        />
                        <button
                            onClick={() => {
                                setSidebarVisible(false)
                                searchByContenu()
                            }}
                            className={style.search_item_button}
                        >
                            Rechercher
                        </button>
                    </div>
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Nom du document</span>
                        <input
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className={style.search_item_input}
                            placeholder="Rechercher par nom du PDF"
                            type="text"
                        />
                        <button
                            onClick={() => {
                                setSidebarVisible(false)
                                searchByName()
                            }}
                            className={style.search_item_button}
                        >
                            Rechercher
                        </button>
                    </div>
                    <Divider />
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Navire</span>
                        <input
                            value={vessel}
                            onChange={(e) => setVessel(e.target.value)}
                            className={style.search_item_input}
                            placeholder="Rechercher par navire"
                            type="text"
                        />
                        <button
                            onClick={() => {
                                setSidebarVisible(false)
                                searchByVessel()
                            }}
                            className={style.search_item_button}
                        >
                            Rechercher
                        </button>
                    </div>
                    <div className={style.search_item}>
                        <span className={style.search_item_label}>Voyage</span>
                        <input
                            value={voyage}
                            onChange={(e) => setVoyage(e.target.value)}
                            className={style.search_item_input}
                            placeholder="Rechercher par voyage"
                            type="text"
                        />
                        <button
                            onClick={() => {
                                setSidebarVisible(false)
                                searchByVoyage()
                            }}
                            className={style.search_item_button}
                        >
                            Rechercher
                        </button>
                    </div>
                </div>
            </Sidebar>

            <Toast ref={toast} />
        </>
    )
}
