import usePageTitle from "../hooks/usePageTitle";
import Topbar from "../layouts/Topbar";
import style from './stat.module.css';
import { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';



export default function Manifest() {
    usePageTitle("Statistique")

    
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

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
                <span className={style.container_title}>Statistique</span>
                <span className={style.container_subtitle}>
                    Les Statistiques des cargaisons
                </span>
                <hr />
                <div className={style.wrapper}>
                    <div className={style.card_chart}>
                        <span>Les statistique des cargaisons par pays</span>
                        <Chart type="bar" style={{width:"100%"}} data={chartData} options={chartOptions} />
                    </div>
                    <div className={style.card_chart}>
                        <span>Liste des produits importés</span>
                        {/* <Chart type="bar" style={{width:"100%"}} data={chartData} options={chartOptions} /> */}
                    </div>
                    <div className={style.card_chart}>
                        <span>Le produit le plus importé ce mois</span>
                        {/* <Chart type="bar" style={{width:"100%"}} data={chartData} options={chartOptions} /> */}
                    </div>
                    <div className={style.card_chart}>
                        <span>Les statistique de nombre de voyage par pays</span>
                        <Chart type="polarArea" style={{width:"100%"}} data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>

        </>
    )
}