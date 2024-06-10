async function fetchWebApi(endpoint, method, body) {
    try {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
      });
  
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error("Error fetching from Spotify API:", error);
      // Handle error (e.g., show error message to user)
    }
  }
  
  async function getTopTracks() {
    const data = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET');
    return data.items; // Correctly extract items from the response
  }
  
  async function getRecommendations() {
    const topTracks = await getTopTracks();
    const seedTracks = topTracks.map(track => track.id).join(',');
  
    const data = await fetchWebApi(`v1/recommendations?limit=30&seed_tracks=${seedTracks}`, 'GET');
    return data.tracks; // Correctly extract tracks from the response
  }
  
  async function createPlaylist() {
    const { id: userId } = await fetchWebApi('v1/me', 'GET');
    const tracks = await getRecommendations();
    const trackUris = tracks.map(track => track.uri); // Get track URIs
  
    const playlist = await fetchWebApi(
      `v1/users/${userId}/playlists`, 'POST', {
        name: "My recommendation playlist",
        description: "Playlist created by the Spotify tutorial",
        public: false
    });
  
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks`, 'POST', {
        uris: trackUris
    });
  
    return playlist;
  }
  
  
  // Authorization 
  const clientId = 'a61e07f774eb4e41bc9df3fdfbc812e1'; 
  const redirectUri = 'https://dayney234.github.io/src/views/home.html'; // Must match the one in your Spotify app settings
  let token;
  
  function openAuthPopup() {
    const scopes = 'user-top-read playlist-modify-private';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  
    const popup = window.open(authUrl, 'Spotify Auth', 'width=800,height=600');
    window.addEventListener('message', (event) => {
      if (event.origin === 'https://dayney234.github.io/src/views/home.html') {
        token = event.data;
        popup.close();
        // Now you have the token, call createPlaylist()
        createPlaylist().then(playlist => {
          console.log("Playlist created:", playlist.name, playlist.id);
        });
      }
    });
  }
  
  document.getElementById('authButton').addEventListener('click', openAuthPopup);