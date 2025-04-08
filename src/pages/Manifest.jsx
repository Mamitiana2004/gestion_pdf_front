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
    const [chartOptions, setChartOptions] = useState({});

    const [produit,setProduit] = useState([
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
        {produit:"Mazda Vehicule",pays:"JAPAN",date_arrive:"2024-06-06",navire:"F59 PRIMROSE"},
    ]);

    useEffect(() => {
        const data = {
            labels: ['Portugal', 'Senegal', 'Liberia', 'USA'],
            datasets: [
                {
                    label: 'Cargaison',
                    data: [50, 25, 72, 62],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
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
                            <Column field="produit" header="Produit"/>
                            <Column field="pays" header="Pays d'origine"/>
                            <Column field="date_arrive" header="Date d'arrive"/>
                            <Column field="navire" header="Navire"/>
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
                        <Chart type="polarArea" style={{ width: "100%" }} data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>

        </>
    )
}