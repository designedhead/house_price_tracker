type Coord = { lat: number; lng: number };

export default function getCenter(coords: Coord[]) {
  if (!coords?.length) return { lat: 0, lng: 0 };
  const latValues = coords.map((coord) => coord.lat);
  const lngValues = coords.map((coord) => coord.lng);

  const latSum = latValues.reduce((sum, value) => sum + value, 0);
  const lngSum = lngValues.reduce((sum, value) => sum + value, 0);

  const centerLat = latSum / coords.length;
  const centerLng = lngSum / coords.length;

  return { lat: centerLat, lng: centerLng };
}
