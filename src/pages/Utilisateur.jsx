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
import { FilterMatchMode } from "primereact/api";

export default function Utilisateur() {
    usePageTitle("Utilisateur")
    const [sidebarStatut, setSidebarStatut] = useState(1);
    const changeStatut = () => {
        if (sidebarStatut === 1) {
            setSidebarStatut(0);
        }
        else {
            setSidebarStatut(1);
        }
    }

    const [filters, setFilters] = useState({
        identifiant: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const [utilisateur, setUtilisateur] = useState([
        { id: 0, identifiant: "", password: "" }
    ]);

    const getAllData = () => {
        let url = `${process.env.REACT_APP_API_URL}/api/admin/getAllUser`;
        fetch(url, {
            method: "GET"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUtilisateur(data.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getAllData();
    }, [])


    const [identifiant, setIdentifiant] = useState();
    const [password, setPassword] = useState();

    const [visibleNew, setVisibleNew] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openNew = () => {
        setVisibleNew(true);
        setIdentifiant("");
        setPassword("");
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
        let url = `${process.env.REACT_APP_API_URL}/api/admin/delete/${product.id}`;
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
            identifiant: identifiant,
            password: password
        }
        let url = `${process.env.REACT_APP_API_URL}/api/admin/create_user`;
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
            identifiant: identifiant,
            password: password
        }
        let url = `${process.env.REACT_APP_API_URL}/api/admin/update_user`;
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

    }

    const actionTemplate = (product) => {
        return (
            <div style={{ display: "flex", gap: 10 }}>
                <Button onClick={() => {
                    setVisibleNew(true);
                    setSelectedUser(product);
                    setIdentifiant(product.identifiant);
                    setPassword(product.password);
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
                    <DataTable style={{ width: "100%" }} value={utilisateur}
                        filters={filters} filterDisplay="row"
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vessel" >
                        <Column sortable field="id" header="ID" ></Column>
                        <Column filter filterPlaceholder="Search by identifiant" field="identifiant" header="Identifiant" ></Column>
                        <Column body={actionTemplate} ></Column>
                    </DataTable>
                </div>

            </div>

            <Dialog style={{ width: '60vw' }} header="Ajouter un nouveau manifest" visible={visibleNew} onHide={() => setVisibleNew(false)}>
                <form onSubmit={sendData}>
                    <p>Identifiant : <input type="text" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required /></p>
                    <p>Password : <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></p>
                    <button type="submit">Valider</button>
                </form>

            </Dialog>
            <ConfirmDialog />
        </>
    )
}