import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import imgUnionPorPatria from './img/uxp.png';
import imgLibertadAvanza from './img/lla.png';
import imgJuntosCambio from './img/jxc.png';

import imgSinFoto from './img/404.jpg';

function App() {
  const [data, setData] = useState(null);
  const maxPossibleVotes = 35394425; // Máximo de votos posibles

  useEffect(() => {
    axios.get('/backend-difu/scope/data/getScopeData/00000000000000000000000b/1/1')
      .then((response) => {
        console.log(response.data);
        setData(response.data.mapa[0].scopes[0].partidos);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  if (!data) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  // Ordenar las listas por cantidad de votos de manera descendente
  const sortListasByVotos = (listas) => {
    return listas.slice().sort((a, b) => b.votos - a.votos);
  };

  // Asignar imagen a cada partido según su nombre
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


  console.log(data)


  // ... (código anterior)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mt-8">
    {data.map((partido) => (
      <div key={partido.name} className="border border-black rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105">
      <h2 className="text-lg font-semibold mb-2 text-blue-600">{partido.name}</h2>
          <img src={getPartyImage(partido.name)} alt={partido.name} className="h-16 mx-auto mb-4" />
          <div className="flex-grow">
            {/* Aquí va el código de las listas */}
            {sortListasByVotos(partido.listas).map((lista) => (
  <div key={lista.code} className="py-2 ">
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
          <div className="mt-4 text-lg text-green-600">
            Total de votos: {partido.listas.reduce((totalVotos, lista) => totalVotos + lista.votos, 0)}
          </div>
          <div className="mt-2 text-xl font-semibold text-blue-600">
            {((partido.listas.reduce((totalVotos, lista) => totalVotos + lista.votos, 0) / maxPossibleVotes) * 100).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
  
}

export default App;


