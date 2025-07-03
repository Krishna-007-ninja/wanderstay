let mapToken = "<%= process.env.MAP_TOKEN %>";
console.log(mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    // style
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});