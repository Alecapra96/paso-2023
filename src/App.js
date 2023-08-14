import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import imgUnionPorPatria from './img/uxp.png';
import imgLibertadAvanza from './img/lla.png';
import imgJuntosCambio from './img/jxc.png';
import imgSinFoto from './img/404.jpg';

import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

function App() {
  const [data, setData] = useState(null);
  const maxPossibleVotes = 35394425;

  useEffect(() => {
    axios.get('/backend-difu/scope/data/getScopeData/00000000000000000000000b/1/1')
      .then((response) => {
        setData(response.data.mapa[0].scopes[0].partidos);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  if (!data) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  const sortListasByVotos = (listas) => {
    return listas.slice().sort((a, b) => b.votos - a.votos);
  };

  const getPartyImage = (partyName) => {
    switch (partyName) {
      case 'LA LIBERTAD AVANZA':
        return imgLibertadAvanza;
      case 'UNION POR LA PATRIA':
        return imgUnionPorPatria;
      case 'JUNTOS POR EL CAMBIO':
        return imgJuntosCambio;
      default:
        return imgSinFoto;
    }
  };

  const calculateTotalPercentage = (partido) => {
    const totalVotes = partido.listas.reduce((total, lista) => total + lista.votos, 0);
    const percentage = ((totalVotes / maxPossibleVotes) * 100).toFixed(2);
    
    return {
      partido: partido.name,
      porcentaje: percentage,
    };
  };
  const partidoPorcentajes = data.map(calculateTotalPercentage);

  const pieChartData = partidoPorcentajes.map((partido) => ({
    name: partido.partido,
    value: parseFloat(partido.porcentaje),
  }));

  const COLORS = {
    'UNION POR LA PATRIA': '#007BFF',    // Azul
    'LA LIBERTAD AVANZA': '#B100ED',     // Violeta
    'JUNTOS POR EL CAMBIO': '#FFD700',   // Amarillo
    // ... Puedes agregar más colores para otros partidos si es necesario
  };

  return (
    <div className="mx-12"> {/* Agregamos márgenes horizontal (mx) de 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto mt-8 px-4">
        <div className="col-span-full mt-4">
          <div className="bg-red-500 p-4 text-white text-center">
            <p>
              Datos tomados de <a href="https://resultados.gob.ar/" className="underline" target="_blank" rel="noopener noreferrer">https://resultados.gob.ar/</a>. 
              Para actualizar los datos, refresca la página.
            </p>
            <p className="mt-2">
              Creado por <a href="https://www.linkedin.com/in/alejandro-capra/" className="underline" target="_blank" rel="noopener noreferrer">Alejandro Capra</a>
            </p>
          </div>
        </div>
        
        <div className="flex justify-center items-center mt-4">
        <div className="w-full max-w-md flex flex-col items-center">
  <h2 className="text-2xl font-semibold mb-4">Porcentaje de votos por partido</h2>
  <div className="flex justify-center">
            <PieChart width={560} height={450}>
                <Pie
                  data={pieChartData}
                  cx={300}
                  cy={200}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => {
                    const partidoName = entry.name;
                    if (COLORS[partidoName]) {
                      return (
                        <Cell key={`cell-${index}`} fill={COLORS[partidoName]} />
                      );
                    }
                    return null;
                  })}
                </Pie>
                <Tooltip />
                <Legend payload={pieChartData.filter(entry => COLORS[entry.name]).map((entry) => ({
                  id: entry.name,
                  type: 'square',
                  value: entry.name,
                  color: COLORS[entry.name]
                }))} />
              </PieChart>
            </div>
          </div>
        </div>
        
        {data.map((partido) => (
          <div key={partido.name} className="border border-black rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105 my-4 relative">
            <h2 className="text-lg font-semibold mb-2 text-blue-600">{partido.name}</h2>
            <img src={getPartyImage(partido.name)} alt={partido.name} className="h-16 mx-auto mb-4" />
            <div className="flex-grow">
              {sortListasByVotos(partido.listas).map((lista) => (
                <div key={lista.code} className="py-2">
                  <div className="flex flex-col bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105">
                    <h2 className="text-lg font-semibold mb-2 text-blue-600">{lista.nombre}</h2>
                    <div className="mb-2">
                      <span className="text-red-600 text-xl font-semibold">{lista.votos} votos</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-600">Candidatos:</span>
                    </div>
                    <div className="border rounded p-2 text-sm text-gray-700 shadow-md">
                      {lista.candidatos.map((candidato, index) => (
                        <div key={index} className="mb-2">
                          {candidato}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bottom-0 right-0 mb-2 mr-2 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-blue-600 font-bold">
              <div className="text-lg text-green-600 font-bold">
                Total de votos: {partido.listas.reduce((totalVotos, lista) => totalVotos + lista.votos, 0)}
              </div>
              {((partido.listas.reduce((totalVotos, lista) => totalVotos + lista.votos, 0) / maxPossibleVotes) * 100).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
