import { useEffect, useRef, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import Topbar from "../layouts/Topbar";
import style from './resume.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Format from "../helpers/Format.min";

export default function Vessel() {
    usePageTitle("Vessel")

    const [data, setData] = useState([]);



    const toast = useRef(null);

    const [filters, setFilters] = useState({
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        flag: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [filtersv, setFiltersv] = useState({
        code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date_arrive: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    const getAllData = () => {
        setLoading(true)
        let url = `${process.env.REACT_APP_API_URL}/api/pdf/get_all_data`;
        fetch(url, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                setData(data);


            })
            .catch((error) => console.log(error)).finally(()=>setLoading(false))
    }

    useEffect(() => {
        getAllData()
    }, [])



    const actionVoyageTemplate = (item) => {
        return <Button onClick={() => voirCargo(item.cargo)} label="Voir les cargaisons" />
    }

    const voirCargo = (cargo) => {
        setCargo(cargo)
        setVisibleCargo(true)
    }




    const [visibleCargo, setVisibleCargo] = useState(false);


    const voyageTemplate = (data) => {
        console.log(data);

        return (
            <>
                <h3>Voyage du vessel {data.vessel.name}</h3>
                <DataTable globalFilterFields={['code']} showGridlines filters={filtersv} value={data.voyage} >
                    <Column filter field="voyage_data.code" header="Code" ></Column>
                    <Column dataType="date" body={dateBodyTemplate} header="Date d'arrive" ></Column>
                    <Column body={actionVoyageTemplate} />
                </DataTable>
            </>
        )
    }
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };




    const [loading, setLoading] = useState(false)

    const formatDate = (value) => {
        let date = new Date(value)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.voyage_data.date_arrive);
    };


    const [cargo, setCargo] = useState([]);

    const [expandedRows, setExpandedRows] = useState(null)
    const allowExpansion = (rowData) => {
        return rowData.voyage.length > 0;
    };

    const [expandedRowsCargo, setExpandedRowsCargo] = useState(null)
    const allowExpansionCargo = (rowData) => {
        return rowData.produit.length > 0;
    };

    const produit_template = (data) => {
        return (<div className={style.produit_pdf_donnee}>
            <span className={style.produit_pdf_donnee_title}>Liste des produits </span>
            <div className={style.liste_produit}>
                {data.produit.map((produit) => {
                    let product_name = produit.produit.replaceAll("_", " ");
                    return <span>{product_name}</span>
                })}
            </div>
            <div className={style.pdf_donnee_detail}>
                <div className={style.pdf_donnee_detail_item}>
                    <span>Poid Total</span>
                    <span className={style.pdf_donnee_detail_item_value}>{Format.formatNombre(data.cargo.poid)} Kg</span>
                </div>
                <div className={style.pdf_donnee_detail_item}>
                    <span>Taille</span>
                    <span className={style.pdf_donnee_detail_item_value}>{Format.formatNombre(data.cargo.volume)} M</span>
                </div>
            </div>
            <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} VIin No" value={data.vin}>
                <Column field="vin" header="Vin no" />
            </DataTable>


        </div>)
    }


    const consignee_template = (cargo) => {
        let consignees = cargo.cargo.consignee.split("|");
        return (
            <div className={style.pdf_donnee_table_consignee}>
                {consignees.map((consignee) => {
                    let consignee_str = consignee.replaceAll("_", " ")
                    return <span>{consignee_str}</span>
                })}
            </div>
        )
    }

    const shipper_template = (cargo) => {
        let shippers = cargo.cargo.shipper.split("|");
        return (<div className={style.pdf_donnee_table_consignee}>
            {shippers.map((shipper) => {
                let shipper_str = shipper.replaceAll("_", " ")
                return <span>{shipper_str}</span>
            })}
        </div>)
    }



    return (

        <>
            {
                !loading ?
                    <>
                        <Topbar name="resume" />

                        <div className={style.container}>
                            <div className={style.wrapper}>
                                <div className={style.wrapper_head}>
                                    <span className={style.wrapper_head_title}>Vessel</span>
                                    <span className={style.wrapper_head_subtitle}>
                                        Gérez les comptes utilisateurs, attribuez des rôles et surveillez les activités au sein de la plateforme. Cette section permet un contrôle précis des accès et une meilleure organisation des responsabilités au sein du système de gestion douanière.
                                    </span>
                                </div>

                                <DataTable filters={filters} expandedRows={expandedRows} rowExpansionTemplate={voyageTemplate} onRowToggle={(e) => setExpandedRows(e.data)} style={{ width: "100%" }} value={data}
                                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" >
                                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                                    <Column field="vessel.id" header="ID" ></Column>
                                    <Column filter filterPlaceholder="Search by name" field="vessel.name" header="Name" ></Column>
                                    <Column filter filterPlaceholder="Search by flag" field="vessel.flag" header="flag" ></Column>
                                </DataTable>
                            </div>

                        </div>

                        {
                            visibleCargo ?
                                <Dialog visible={visibleCargo} onHide={() => setVisibleCargo(false)} maximized={true} header={`Cargaison du voyage`}>
                                    <div className={style.pdf_donnee_container}>
                                        {
                                            <DataTable style={{ width: "100%" }} value={cargo}
                                                expandedRows={expandedRowsCargo} rowExpansionTemplate={produit_template} onRowToggle={(e) => setExpandedRowsCargo(e.data)}
                                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Cargaison">
                                                <Column expander={allowExpansionCargo} style={{ width: '5rem' }} />
                                                <Column style={{ width: "120px" }} field="cargo.bl_no" header={"B/L No"} />
                                                <Column body={consignee_template} header="Destinataire" />
                                                <Column body={shipper_template} header="Expediteur" />
                                                <Column field="cargo.port_depart" header="Port de départ" />
                                            </DataTable>
                                        }
                                    </div>
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