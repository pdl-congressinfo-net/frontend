import { useEffect, useMemo, useState } from "react";
import { Box, Card, Dialog, Text, Flex, Button } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Country, Location } from "../../features/locations/location.model";
import { useList } from "@refinedev/core";
import { CountryDTO } from "../../features/locations/locations.responses";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type DraggableMarkerProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

function DraggableMarker({ lat, lng, onChange }: DraggableMarkerProps) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <Marker
      position={[lat, lng]}
      draggable
      icon={markerIcon}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const m = e.target as L.Marker;
          const p = m.getLatLng();
          onChange(p.lat, p.lng);
        },
      }}
    />
  );
}

function MapClickHandler({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export type MapPickerProps = {
  location?: Location;
  title?: string;
  previewHeight?: string | number;
  previewWidth?: string | number;
  bounds?: L.LatLngBoundsExpression;
  defaultCenter?: [number, number];
  onSave?: (location: Location) => void;
  saveDisabled?: boolean;
};

export function MapPicker({
  location,
  title = "Adjust Location",
  previewHeight = 180,
  previewWidth = "40vw",
  bounds,
  defaultCenter,
  onSave,
  saveDisabled,
}: MapPickerProps) {
  const [locationState, setLocationState] = useState<Location | undefined>(
    location,
  );
  const [open, setOpen] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const europeBounds = useMemo(
    () => bounds ?? L.latLngBounds([34, -25], [72, 45]),
    [bounds],
  );
  const center = useMemo<[number, number]>(
    () => defaultCenter ?? [54, 15],
    [defaultCenter],
  );

  useEffect(() => {
    // keep internal state in sync if parent location changes
    setLocationState(location);
  }, [location]);

  const handlePositionChange = (lat: number, lng: number) => {
    setLocationState((prev) => {
      const next: Location = {
        id: prev?.id ?? "",
        name: prev?.name ?? "",
        road: prev?.road,
        number: prev?.number,
        postalCode: prev?.postalCode,
        city: prev?.city,
        lat,
        lng,
        countryId: prev?.countryId ?? "",
        locationTypeId: prev?.locationTypeId ?? "",
      };
      return next;
    });
  };

  async function reverseGeocode(lat: number, lng: number): Promise<Location> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);

    const data: any = await res.json();

    const updated: any = {
      id: locationState?.id ?? "",
      name: data?.name || locationState?.name || "Unnamed location",
      road: data?.address?.road || "",
      number: data?.address?.house_number || "",
      postalCode: data?.address?.postcode || "",
      city:
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        "",
      lat: Number(data?.lat ?? lat),
      lng: Number(data?.lon ?? lng),
      ___country: data?.address?.country || "",
      ___countryCode: data?.address?.country_code?.toUpperCase() ?? "",
      countryId: locationState?.countryId ?? "",
      locationTypeId: locationState?.locationTypeId ?? "",
    };

    setLocationState(updated);
    return updated;
  }

  return (
    <>
      <Card.Root width="md">
        <Card.Body>
          <Text fontSize="sm" color="fg.muted" mb={2}>
            Preview
          </Text>
          {locationState?.lat != null && locationState?.lng != null ? (
            <Box
              width={previewWidth}
              height={previewHeight}
              onClick={() => setOpen(true)}
              cursor="pointer"
            >
              <MapContainer
                key={`preview-${locationState?.lat ?? "null"}-${locationState?.lng ?? "null"}`}
                center={[locationState.lat, locationState.lng]}
                zoom={15}
                style={{
                  width: `calc(${previewWidth} - 8vw)`,
                  height: previewHeight,
                }}
                maxBounds={europeBounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[locationState.lat, locationState.lng]}
                  icon={markerIcon}
                />
              </MapContainer>
            </Box>
          ) : (
            <Box
              width={`calc(${previewWidth} - 6vw)`}
              height={`calc(${previewHeight} - 6vw)`}
              bg="gray.50"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => setOpen(true)}
              cursor="pointer"
            >
              <Text color="fg.muted">
                No location selected — click to open map
              </Text>
            </Box>
          )}
        </Card.Body>
      </Card.Root>

      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen((e as any).open ?? false)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="80vw">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontWeight="bold">{title}</Text>
              <Dialog.CloseTrigger />
            </Flex>
            <Box width="80vw" height="60vh">
              <MapContainer
                // change key when center coords change so the map remounts and recenters
                key={
                  locationState?.lat != null && locationState?.lng != null
                    ? `loc-${locationState.lat}-${locationState.lng}`
                    : `center-${center[0]}-${center[1]}`
                }
                center={
                  locationState?.lat != null && locationState?.lng != null
                    ? [locationState.lat, locationState.lng]
                    : center
                }
                zoom={
                  locationState?.lat != null && locationState?.lng != null
                    ? 15
                    : 5
                }
                style={{ width: "100%", height: "100%" }}
                maxBounds={europeBounds}
                maxBoundsViscosity={1.0}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler
                  onChange={(a, b) => handlePositionChange(a, b)}
                />
                {locationState?.lat != null && locationState?.lng != null ? (
                  <DraggableMarker
                    lat={locationState.lat}
                    lng={locationState.lng}
                    onChange={(a, b) => handlePositionChange(a, b)}
                  />
                ) : null}
              </MapContainer>
            </Box>
            <Flex justify="space-between" align="center" mt={3}>
              <Flex gap={2}>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!locationState?.lat || !locationState?.lng) return;

                    const updated = await reverseGeocode(
                      locationState.lat,
                      locationState.lng,
                    );
                    onSave?.(updated);
                    setOpen(false);
                  }}
                  disabled={saveDisabled}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}

export default MapPicker;
