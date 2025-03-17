import { useEffect, useRef, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import Sidebar from "../layouts/Sidebar";
import Topbar from "../layouts/Topbar";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import style from './home.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import vessel from './data/vessel.json'
import voyages from './data/voyage.json'
import cargaisons from './data/cargaison.json'

import { Dialog } from "primereact/dialog";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
import FileInput from "../components/FileInput";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
export default function Vessel() {
    usePageTitle("Vessel")
    const [sidebarStatut, setSidebarStatut] = useState(1);
    const changeStatut = () => {
        if (sidebarStatut === 1) {
            setSidebarStatut(0);
        }
        else {
            setSidebarStatut(1);
        }
    }

    const [vesselVoyage, setVesselVoyage] = useState();
    const toast = useRef(null);

    const [filters, setFilters] = useState({
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        flag: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [filtersv, setFiltersv] = useState({
        code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date_arrive: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    const [filterCargo, setFilter] = useState({
        bl_no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        port_depart: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date_depart: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        shipper: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        shipperconsignee: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        produit: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description_produit: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        poid: { value: null, matchMode: FilterMatchMode.EQUALS },
        volume: { value: null, matchMode: FilterMatchMode.EQUALS },
    })

    useEffect(() => {
        const data = vessel.map((v) => {
            const vesselVoyages = voyages
                .filter((voyage) => voyage.vessel_id === v.id)
                .map((voyage) => ({
                    ...voyage,
                    date_arrive: new Date(voyage.date_arrive) // Convertir date_arrive en Date
                }));

            return {
                ...v,
                voyages: vesselVoyages
            };
        });
        setVesselVoyage(data)
    }, [])

    const [cargo, setCargo] = useState();
    const [vesselCargo, setVesselCargo] = useState(null);




    const [visibleCargo, setVisibleCargo] = useState(false);

    const choixVoyage = (product) => {

        const v = vessel.filter((ves) => ves.id === product.id)
        const cargoVoyage = cargaisons.filter((cargaison) => cargaison.voyage_id === product.id)

        let data = {
            vessel: v[0],
            voyage: product,
            cargos: cargoVoyage
        }

        setCargo(data)
        console.log(data);

        setVisibleCargo(true)
    }

    const voyageTemplate = (data) => {
        return (
            <>
                <h3>Voyage du vessel {data.name}</h3>
                <DataTable globalFilterFields={['code']} showGridlines filters={filtersv} value={data.voyages} >
                    <Column filter field="code" header="Code" ></Column>
                    <Column filter filterField="date_arrive" filterElement={dateFilterTemplate} dataType="date" body={dateBodyTemplate} header="Date d'arrive" ></Column>
                    <Column body={voyageActionTemplate} ></Column>
                </DataTable>
            </>
        )
    }
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };



    const [visibleImport, setVisibleImport] = useState(false);



    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false)


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



    const deleteUtilisateur = (product) => {
        confirmDialog({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => confirmDelete(product)
        });
    }

    const confirmDelete = (product) => {
        let url = `${process.env.REACT_APP_API_URL}/api/shipper/delete/${product.id}`;
        fetch(url, {
            method: "DELETE"
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            })
    }


    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <Button style={{ width: "200px" }} label="Import PDF" icon="pi pi-download" severity="help" onClick={() => setVisibleImport(true)} />
            </div>
        );
    };

    const formatDate = (value) => {
        let date = new Date(value)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date_arrive);
    };



    const openCargo = (product) => {
        choixVoyage(product)
    }

    const voyageActionTemplate = (product) => {
        return <Button label="Voir les cargaisons" onClick={() => openCargo(product)} />
    }

    const [expandedRows, setExpandedRows] = useState(null)
    const allowExpansion = (rowData) => {
        return rowData.voyages.length > 0;
    };


    return (

        <>
            {
                !loading ?
                    <>
                        <Topbar onMenuClick={changeStatut} />
                        <Sidebar statut={sidebarStatut} />

                        <Dialog visible={visibleImport} onHide={() => setVisibleImport(false)} header="Import PDF" footer={<Button onClick={sendDataPdf} label="Valider" />}>
                            <div className={style.pdf_container}>
                                <FileInput fileValue={setPdfFile} />
                            </div>
                        </Dialog>
                        <div className={style.container}>
                            <div className={style.wrapper}>
                                <h1>Vessel</h1>
                                <Toolbar left={leftToolbarTemplate} style={{ width: "100%" }} />
                                <DataTable filters={filters} expandedRows={expandedRows} rowExpansionTemplate={voyageTemplate} onRowToggle={(e) => setExpandedRows(e.data)} style={{ width: "100%" }} value={vesselVoyage}
                                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" >
                                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                                    <Column field="id" header="ID" ></Column>
                                    <Column filter filterPlaceholder="Search by name" field="name" header="Name" ></Column>
                                    <Column filter filterPlaceholder="Search by flag" field="flag" header="flag" ></Column>
                                </DataTable>
                            </div>

                        </div>

                        {
                            visibleCargo ?
                                <Dialog visible={visibleCargo} onHide={() => setVisibleCargo(false)} maximized={true} header={`Cargaison du voyage`}>
                                    <span>Détails du voyage </span>
                                    <p>Vessel : {cargo.vessel.name}</p>
                                    <p>Flag : {cargo.vessel.flag}</p>
                                    <p>Voyage : {cargo.voyage.code}</p>
                                    <p>Date of sail : {formatDate(cargo.voyage.date_arrive)}</p>
                                    <Divider />
                                    <DataTable filters={filterCargo} style={{ width: '100%' }} value={cargo.cargos}>
                                        <Column filter field="bl_no" header="BL/No" />
                                        <Column filter field="port_depart" header="Port de depart" />
                                        <Column filter field="date_depart" header="Date de depart" />
                                        <Column filter field="shipper" header="Shipper" />
                                        <Column filter field="consignee" header="Consignee" />
                                        <Column filter field="produit" header="Good" />
                                        <Column filter field="description_produit" header="Description" />
                                        <Column filter dataType="numeric" field="poid" header="Weight" />
                                        <Column filter dataType="numeric" field="volume" header="Measurement" />
                                    </DataTable>
                                </Dialog> : <></>
                        }

                        <ConfirmDialog />
                    </> :
                    <>
                        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ProgressSpinner />
                        </div>
                    </>
            }
            <Toast ref={toast} />
        </>
    )
}