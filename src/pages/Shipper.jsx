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
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

export default function Shipper() {
    usePageTitle("Shipper")
    const [sidebarStatut, setSidebarStatut] = useState(1);
    const changeStatut = () => {
        if (sidebarStatut === 1) {
            setSidebarStatut(0);
        }
        else {
            setSidebarStatut(1);
        }
    }

    const [shipper, setShipper] = useState([
        { id: 0, name: "", adresse: "" }
    ]);

    const getAllData = () => {
        let url = `${process.env.REACT_APP_API_URL}/api/shipper/getAll`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setShipper(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getAllData();
    }, [])


    const [name,setName]= useState();
    const [adresse,setAdresse] = useState();

    const [visibleNew, setVisibleNew] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openNew = () => {
        setVisibleNew(true);
        setName("");
        setAdresse("");
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
                getAllData();   
            })
            .catch((error) => {
                console.log(error);
            })
    }


    const leftToolbarTemplate = () => {
        return (
            <div className={style.toolbar_left}>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const sendData = (e) => {
        e.preventDefault();
        if (selectedUser) {
            doUpdate();
        }
        else {
            doCreate();
        }
        setVisibleNew(false);
    }

    const doCreate = () => {
        let data = {
            name: name,
            adresse: adresse
        }
        let url = `${process.env.REACT_APP_API_URL}/api/shipper/create`;
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

    const doUpdate = () => {
        let data = {
            id: selectedUser.id,
            name: name,
            adresse: adresse
        }
        let url = `${process.env.REACT_APP_API_URL}/api/shipper/update`;
        fetch(url, {
            method: "PUT",
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
        setSelectedUser(null);
    }

    const actionTemplate = (product) => {
        return (
            <div style={{ display: "flex", gap: 10 }}>
                <Button onClick={() => {
                    setVisibleNew(true);
                    setSelectedUser(product);
                    setName(product.name);
                    setAdresse(product.adresse);
                }} icon="pi pi-pencil" severity="warning" />
                <Button onClick={() => {
                    deleteUtilisateur(product)
                }} icon="pi pi-trash" severity="danger" />
            </div>
        )
    }

    return (
        <>
            <Topbar onMenuClick={changeStatut} />
            <Sidebar statut={sidebarStatut} />
            <div className={style.container}>
                <div className={style.wrapper}>
                    <Toolbar left={leftToolbarTemplate} style={{ width: "100%" }} />
                    <DataTable style={{ width: "100%" }} value={shipper}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" >
                        <Column field="id" header="ID" ></Column>
                        <Column field="name" header="Name" ></Column>
                        <Column field="adresse" header="Adresse" ></Column>
                        <Column body={actionTemplate} ></Column>
                    </DataTable>
                </div>

            </div>

            <Dialog style={{ width: '60vw' }} header="Ajouter un nouveau manifest" visible={visibleNew} onHide={() => setVisibleNew(false)}>
                <form onSubmit={sendData}>
                    <p>Name : <input type="text" value={name} onChange={(e)=>setName(e.target.value)} /></p>
                    <p>Adresse : <input type="text" value={adresse} onChange={(e)=>setAdresse(e.target.value)} /></p>
                    <button type="submit">Valider</button>
                </form>

            </Dialog>
            <ConfirmDialog />
        </>
    )
}