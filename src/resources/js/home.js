// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQA2jXRdcmEqIYcGNc5xajzau7uSG_dzUePvL3g4UaFLo3ghX4ZsltVwskvUPAbATiYxxq4MTgeNQR0bAcSg4vKhImYdOIrXnIovX8PsIA2y40I4vzQ9gdEQ1xx8cRu0bh1qilbl2heKHd0ukgJFRmiEihD1xM04bRtvWGCMVcakX9_DE06NYEiKWR35-EBAWxQE9zIdMNjlqntubUGJ8i-Ca8Fnc-ADNI0y6XGnWt03ZOY8QQwVHq5JormrOisP53BG6UL2hQ';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

const topTracksIds = [
  '5Ju9aLa212eAILfl5sWkjc','5rG6CAVA1vmZJG8RYwJdB1','7sg9kDT8H2P0wPACXnWRdN','5HDKfBmGnKhFcaBaixp6Ye','7sz6nHtAKOOt5cpOniz0sW'
];

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);