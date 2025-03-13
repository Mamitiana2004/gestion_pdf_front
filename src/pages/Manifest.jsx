import { useEffect, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import Sidebar from "../layouts/Sidebar";
import Topbar from "../layouts/Topbar";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import style from './home.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import FileInput from "../components/FileInput";

export default function Manifest() {
    usePageTitle("Manifest")
    const [sidebarStatut, setSidebarStatut] = useState(1);
    const changeStatut = () => {
        if (sidebarStatut === 1) {
            setSidebarStatut(0);
        }
        else {
            setSidebarStatut(1);
        }
    }
    const [manifests, setManifests] = useState();

    const getAllData = () => {
        let url = `${process.env.REACT_APP_API_URL}/api/manifest/getAll`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setManifests(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }


    useEffect(() => {
        getAllData();

    }, [])

    const [cargos, setCargos] = useState();
    const [shippers, setShippers] = useState();
    const [consignes, setConsignes] = useState();



    const [selectedManifest, setSelectedManifest] = useState();
    const [visibleDetail, setVisibleDetail] = useState(false);

    const [visibleNew, setVisibleNew] = useState(false);
    const [visibleNewCargo, setVisibleNewCargo] = useState(false);
    const [visibleImport,setVisibleImport]= useState(false);


    const [vessel, setVessel] = useState();
    const [flag, setFlag] = useState();
    const [voyage, setVoyage] = useState();
    const [dateArrive, setDateArrive] = useState();

    const [shipper, setShipper] = useState();
    const [consigne, setConsigne] = useState();
    const [numeroCon, setNumeroCon] = useState();
    const [date_depart, setDate_depart] = useState();
    const [description, setDescription] = useState();
    const [weight, setWeight] = useState();
    const [mesurement, setMesurement] = useState();

    const [pdfFile,setPdfFile] = useState(null);


    const openNew = () => {
        setVisibleNew(true);
    }

    const getAllCargos = (manifest) => {
        let url = `${process.env.REACT_APP_API_URL}/api/cargo/getAll/${manifest.id}`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                
                setCargos(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getAllShippers = () => {
        let url = `${process.env.REACT_APP_API_URL}/api/shipper/getAll`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setShippers(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getAllConsigne = () => {
        let url = `${process.env.REACT_APP_API_URL}/api/consigne/getAll`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setConsignes(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const openNewCargo = () => {
        setVisibleNewCargo(true);
    }

    const toolbarTemplateCargo = () => {
        return (
            <div className={style.toolbar_left}>
                <Button onClick={openNewCargo} label="New cargo" />
            </div>
        );
    }

    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button style={{width:"200px"}} label="Import PDF" icon="pi pi-download" severity="help" onClick={()=>setVisibleImport(true)} />
            </div>
        );
    };

    const sendDataCargo = (e) => {
        e.preventDefault();
        doCreateCargo();
        setVisibleNewCargo(false);
    }

    const doCreateCargo = () => {
        let data = {
            numero_bl: numeroCon,
            shipper_id: shipper.id,
            consigne_id: consigne.id,
            description: description,
            weight: weight,
            mesurement: mesurement
        }
        let url = `${process.env.REACT_APP_API_URL}/api/cargo/create/${selectedManifest.id}`;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                getAllCargos(selectedManifest);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const sendData = (e) => {
        e.preventDefault();
        doCreate();

        setVisibleNew(false)
    }

    const doCreate = () => {
        let data = {
            vessel: vessel,
            voyage: voyage,
            flag: flag,
            dateArrive: dateArrive
        }
        let url = `${process.env.REACT_APP_API_URL}/api/manifest/create`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                getAllData();
            })
            .catch((error) => {
                console.log(error);
            })

    }


    const actionTemplate = (product) => {
        return <Button onClick={() => {
            setSelectedManifest(product)
            getAllCargos(product);
            getAllShippers();
            getAllConsigne();
            setVisibleDetail(true);
        }} icon="pi pi-eye" />
    }

    const getShipperById = (id) =>{
        if (shippers) 
            return shippers.find(item=>item.id === id)
    }
    
    const getConsigneById = (id) =>{
        if (consignes)
            return consignes.find(item=>item.id === id)
    }

    const shipperTemplate = (cargo) =>{
        let data = getShipperById(cargo.shipper_id);
        if (data) return `${data.name} , ${data.adresse}`;
    }

    const consigneTemplate = (cargo) =>{
        let data = getConsigneById(cargo.consigne_id);
        if(data) return `${data.name} , ${data.adresse}`;
    }

    const sendDataPdf = () =>{
        let formData = new FormData();
        formData.append("file",pdfFile);

        let url = `${process.env.REACT_APP_API_URL}/api/pdf/import`;
        
        fetch(url,{
            method:'POST',
            body:formData
        })
        .then((res)=>res.json())
        .then((data)=>{console.log(data)}
        )
        .catch((error)=>{console.log(error);
        })
    }

    return (
        <>
            <Topbar onMenuClick={changeStatut} />
            <Sidebar statut={sidebarStatut} />
            <div className={style.container}>
                <div className={style.wrapper}>
                    <Toolbar left={leftToolbarTemplate} style={{ width: "100%" }} />
                    <DataTable style={{ width: "100%" }} value={manifests}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" header={"Vessel"}>
                        <Column field="vessel" header="Vessel" ></Column>
                        <Column field="flag" header="Flag" ></Column>
                        <Column field="voyage" header="Voyage" ></Column>
                        <Column field="date_arrive" header="Date Of Sail" ></Column>
                        <Column header="Detail" body={actionTemplate} ></Column>
                    </DataTable>
                </div>

            </div>
            <Dialog visible={visibleImport} onHide={()=>setVisibleImport(false)} header="Import PDF" footer={<Button onClick={sendDataPdf} label="Valider"/>}>
                <div className={style.pdf_container}>
                    <FileInput fileValue={setPdfFile}/>
                    {/* <div className={style.config_pdf_container}>
                        <p>Configuration</p>
                        <div className={style.config_pdf}>
                            <InputSwitch checked={allPage} onChange={(e)=>setAllPage(e.value)}/>
                            <span>All page</span>
                        </div>
                        {
                            allPage ?
                            <div>
                                
                            </div>
                            :<></>
                        }
                    </div> */}
                </div>
            </Dialog>
            {
                selectedManifest ? (
                    <>
                        <Dialog style={{ width: "90vw" }} draggable={false} maximized={true} header={selectedManifest.vessel} visible={visibleDetail} onHide={() => setVisibleDetail(false)}>
                            <div className={style.detail_vessel}>
                                <div className={style.detail_vessel_left}>
                                    <p>Vessel : {selectedManifest.vessel}</p>
                                    <p>Flag : {selectedManifest.flag}</p>
                                    <p>Voyage : {selectedManifest.voyage}</p>
                                    <p>Date of sail : {selectedManifest.date_arrive}</p>
                                </div>
                            </div>
                            <Divider />
                            <Toolbar style={{ width: "100%" }} left={toolbarTemplateCargo} />
                            <DataTable style={{ width: "100%" }} value={cargos}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" header={"Vessel"}>
                                <Column field="bl_no" header="BL/No" ></Column>
                                <Column body={shipperTemplate}  header="Shipper" ></Column>
                                <Column body={consigneTemplate} header="Consignee" ></Column>
                                <Column field="description_good" header="Description" ></Column>
                                <Column field="weight" header="Weight" ></Column>
                                <Column field="measurement" header="Measurement" ></Column>
                            </DataTable>
                        </Dialog>
                        <Dialog header="Ajouter un nouveau cargo" maximized={true} visible={visibleNewCargo} onHide={() => setVisibleNewCargo(false)}>
                            <form onSubmit={sendDataCargo}>
                                <p>Numero de connaissement : <input type="text" value={numeroCon} onChange={(e) => setNumeroCon(e.target.value)} /></p>
                                <p>Expéditeur (Shipper) :  <Dropdown value={shipper} onChange={(e) => setShipper(e.value)} filter options={shippers} optionLabel="name" placeholder="Shipper" /></p>
                                <p>Destinataire (Consignee) : <Dropdown value={consigne} onChange={(e) => setConsigne(e.value)} filter options={consignes} optionLabel="name" placeholder="Consignes" /></p>
                                <p>Date of sail : <input type="date" value={date_depart} onChange={(e) => setDate_depart(e.target.value)} /></p>
                                <p>Poids brut (kg) : <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} /></p>
                                <p>Mesurement : <input type="text" value={mesurement} onChange={(e) => setMesurement(e.target.value)} /></p>
                                <p>Description : <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="" id=""></textarea></p>
                                <button type="submit">Valider</button>
                            </form>
                        </Dialog>
                    </>
                ) : <></>
            }
            <Dialog style={{ width: '60vw' }} header="Ajouter un nouveau manifest" visible={visibleNew} onHide={() => setVisibleNew(false)}>
                <form onSubmit={sendData}>
                    <p>Vessel : <input type="text" value={vessel} onChange={(e) => setVessel(e.target.value)} required /></p>
                    <p>Flag : <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} required /></p>
                    <p>Numero du voayge : <input type="text" value={voyage} onChange={(e) => setVoyage(e.target.value)} required /></p>
                    <p>Date d'arrive : <input type="date" value={dateArrive} onChange={(e) => setDateArrive(e.target.value)} required /></p>
                    <button type="submit">Valider</button>
                </form>
            </Dialog>
        </>
    )
}