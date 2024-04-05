mapboxgl.accessToken = mapToken;


// default map code
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 10 // starting zoom
    });

// map marker
    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25}).setHTML(
            `<p>Exact Location will be provided after booking!</p>`
        )
    )
    .addTo(map);
