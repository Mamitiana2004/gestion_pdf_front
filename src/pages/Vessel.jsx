"use client"

import { FilterMatchMode } from "primereact/api"
import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast } from "primereact/toast"
import { useEffect, useRef, useState } from "react"
import Format from "../helpers/Format.min"
import usePageTitle from "../hooks/usePageTitle"
import Topbar from "../layouts/Topbar"
import style from "./resume.module.css"

export default function Vessel() {
    usePageTitle("Manifest Entries")

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)

    // Filtres adaptés aux données ManifestEntry
    const [filters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        flag: { value: null, matchMode: FilterMatchMode.CONTAINS },
        produits: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    })

    const getAllData = () => {
        setLoading(true)
        const url = `${process.env.REACT_APP_API_URL}/api/pdf/get_all_data`
        fetch(url, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                console.log("Données reçues:", data)
                setData(data)
            })
            .catch((error) => {
                console.log("Erreur:", error)
                toast.current?.show({
                    severity: "error",
                    summary: "Erreur",
                    detail: "Erreur lors du chargement des données",
                })
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getAllData()
    }, [])

    // Template pour formater le poids
    const poidsTemplate = (rowData) => {
        return rowData.poids ? `${Format.formatNombre(rowData.poids)} kg` : "N/A"
    }

    // Template pour formater le volume
    const volumeTemplate = (rowData) => {
        return rowData.volume ? `${Format.formatNombre(rowData.volume)} m³` : "N/A"
    }

    // Template pour formater la date
    const dateTemplate = (rowData) => {
        if (!rowData.date) return "N/A"
        try {
            const date = new Date(rowData.date)
            return date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
        } catch (error) {
            return rowData.date
        }
    }

    // Template pour les produits (avec gestion des textes longs)
    const produitsTemplate = (rowData) => {
        const produits = rowData.produits || "N/A"
        if (produits.length > 50) {
            return <span title={produits}>{produits.substring(0, 50)}...</span>
        }
        return produits
    }

    // Template de filtre pour les dates
    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                dateFormat="dd/mm/yy"
                placeholder="dd/mm/yyyy"
                mask="99/99/9999"
            />
        )
    }

    return (
        <>
            {!loading ? (
                <>
                    <Topbar name="manifest" />
                    <div className={style.container}>
                        <div className={style.wrapper}>
                            <div className={style.wrapper_head}>
                                <span className={style.wrapper_head_title}>Manifest Entries</span>
                                <span className={style.wrapper_head_subtitle}>
                                    Consultez et gérez les entrées de manifeste extraites des documents PDF. Cette section affiche les
                                    informations sur les navires, leurs cargaisons et les détails associés.
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                    padding: "10px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "5px",
                                }}
                            >
                                <div>
                                    <strong>Total des entrées: {data.length}</strong>
                                </div>
                                <div>
                                    <button
                                        onClick={getAllData}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Actualiser
                                    </button>
                                </div>
                            </div>

                            <DataTable
                                filters={filters}
                                globalFilterFields={["name", "flag", "produits"]}
                                style={{ width: "100%" }}
                                value={data}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} entrées"
                                paginatorLeft={
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span>Lignes par page:</span>
                                    </div>
                                }
                                paginatorRight={
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span>Total: {data.length} entrées</span>
                                    </div>
                                }
                                emptyMessage="Aucune donnée disponible"
                                showGridlines
                                stripedRows
                                size="small"
                                className="p-datatable-sm"
                            >
                                <Column field="id" header="ID" sortable style={{ width: "80px" }} />
                                <Column
                                    field="name"
                                    header="Nom du Navire"
                                    filter
                                    filterPlaceholder="Rechercher par nom"
                                    sortable
                                    style={{ minWidth: "200px" }}
                                />
                                <Column
                                    field="flag"
                                    header="Pavillon"
                                    filter
                                    filterPlaceholder="Rechercher par pavillon"
                                    sortable
                                    style={{ width: "120px" }}
                                />
                                <Column
                                    field="produits"
                                    header="Produits"
                                    body={produitsTemplate}
                                    filter
                                    filterPlaceholder="Rechercher par produit"
                                    style={{ minWidth: "250px" }}
                                />
                                <Column field="poids" header="Poids" body={poidsTemplate} sortable style={{ width: "150px" }} />
                                <Column field="volume" header="Volume" body={volumeTemplate} sortable style={{ width: "150px" }} />
                                <Column
                                    field="date"
                                    header="Date"
                                    body={dateTemplate}
                                    filter
                                    filterElement={dateFilterTemplate}
                                    dataType="date"
                                    sortable
                                    style={{ width: "120px" }}
                                />
                            </DataTable>
                        </div>
                    </div>
                    <ConfirmDialog />
                </>
            ) : (
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ProgressSpinner />
                </div>
            )}
            <Toast ref={toast} />
        </>
    )
}
