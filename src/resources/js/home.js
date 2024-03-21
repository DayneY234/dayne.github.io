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

async function getTopTracks(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
      'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
    )).items;
  }
  
  const topTracks = await getTopTracks();
  console.log(
    topTracks?.map(
      ({name, artists}) =>
        `${name} by ${artists.map(artist => artist.name).join(', ')}`
    )
  );

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=30&seed_tracks=${topTracks.id.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);