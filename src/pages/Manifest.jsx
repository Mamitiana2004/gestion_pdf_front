import usePageTitle from "../hooks/usePageTitle";
import Topbar from "../layouts/Topbar";
import style from './stat.module.css';
import { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



export default function Manifest() {
    usePageTitle("Statistique")


    const [chartData, setChartData] = useState({});
    const [chartDataVessel, setChartDataVessel] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [produit,setProduit] = useState([]);

    const getAllProduit = () =>{
        let url = `${process.env.REACT_APP_API_URL}/api/stat/getAllProduit`
        fetch(url,{
            method:"GET"
        })
        .then((res)=>res.json())
        .then((data)=>{
            setProduit(data)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const getData_Chart = () =>{
        let url = `${process.env.REACT_APP_API_URL}/api/stat/nombre_cargo_pays`
        fetch(url,{
            method:"GET"
        })
        .then((res)=>res.json())
        .then((data)=>{
            let labels = []
            let datasets = []
            data.map((d)=>{
                labels.push(d.pays.pays)
                datasets.push(d.nombre_cargo)
            })

            const char_data = {
                labels:labels,
                datasets: [
                    {
                        label: 'Cargaison',
                        data: datasets,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                        ],
                        borderWidth: 1
                    }
                ]
            };
    
            setChartData(char_data);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    
    const getData_Chart_Vessel = () =>{
        let url = `${process.env.REACT_APP_API_URL}/api/stat/nombre_voyage_vessel`
        fetch(url,{
            method:"GET"
        })
        .then((res)=>res.json())
        .then((data)=>{
            let labels = []
            let datasets = []
            data.map((d)=>{
                
                
                labels.push(d.vessel.name)
                datasets.push(d.nombre_voyage)
            })

            const char_data = {
                labels:labels,
                datasets: [
                    {
                        label: 'Voyages',
                        data: datasets,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                        ],
                        borderWidth: 1
                    }
                ]
            };
    
            setChartDataVessel(char_data);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    useEffect(() => {
        getAllProduit()
        getData_Chart() 
        getData_Chart_Vessel()       
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartOptions(options);
    }, []);


    return (
        <>
            <Topbar name="stat" />
            <div className={style.container}>
                <div className={style.container_header}>
                    <img className={style.image_logo} src="/assets/images/hero.jpeg" alt="hero" />
                    <span className={style.container_title}>Statistique</span>
                    <span className={style.container_subtitle}>Cette section fournit une analyse complète des cargaisons traitées, incluant les volumes importés et exportés, les poids totaux, les trajets des navires, ainsi que les performances des expéditions. Elle permet un suivi précis et une visualisation claire des données logistiques pour une meilleure prise de décision.</span>
                </div>
                <hr />
                <div className={style.wrapper}>
                    <div className={style.card_chart}>
                        <span className={style.title}>Les statistique des cargaisons par pays</span>
                        <Chart type="bar" style={{ width: "100%" }} data={chartData} options={chartOptions} />
                    </div>
                    <div className={style.card_chart}>
                        <span className={style.title}>Liste des produits importés</span>
                        <DataTable paginator rows={5} value={produit} className={style.produit_datatable_container}>
                            <Column field="produit.produit" header="Produit"/>
                            <Column field="pays_origine.pays" header="Pays"/>
                            <Column field="voyage.date_arrive" header="Date d'arrive"/>
                            <Column field="vessel.name" header="Navire"/>
                        </DataTable>
                    </div>
                    <div className={style.card_chart}>
                        <span className={style.title}>Le produit le plus importé ce mois</span>
                        <div className={style.produit_top_container}>
                            <div className={style.produit_image_container}>
                                <img alt="produit" src="/assets/images/pro.png" />
                            </div>
                            <div className={style.produit_top_detail_container}>
                                <span>Produit : Mazda Vehicule</span>
                                <span>Pays d'origine: <span>JAPAN</span></span>
                            </div>
                        </div>
                    </div>
                    <div className={style.card_chart}>
                        <span className={style.title}>Les statistique de nombre de voyage par navire</span>
                        <Chart type="polarArea" style={{ width: "100%" }} data={chartDataVessel} options={chartOptions} />
                    </div>
                </div>

            </div>

        </>
    )
}