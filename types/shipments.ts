export type ShipmentStatusEnum =
  | "CREATED"
  | "RECEIVED_CN"
  | "CONSOLIDATION"
  | "IN_TRANSIT"
  | "ARRIVED_UA"
  | "ON_UA_WAREHOUSE"
  | "DELIVERED"
  | "ARCHIVED";

export type DeliveryType = "AIR" | "SEA" | "RAIL" | "MULTIMODAL";

export type DeliveryFormat = "NOVA_POSHTA" | "SELF_PICKUP" | "CARGO";

export type ShipmentItem = {
  id: string;
  shipmentId: string;
  itemCode: string | null;
  description: string | null;
  quantity: number | null;
  clientTariff: string | null;
  insuranceValue: string | null;
  weightKg: string | null;
  volumeM3: string | null;
  density: string | null;
  localTracking: string | null;
  photoUrl: string | null;
  deliveryCost: string | null;
  totalCost: string | null;
};

export type ShipmentStatusHistory = {
  id: string;
  shipmentId: string;
  status: ShipmentStatusEnum;
  location: string | null;
  description: string | null;
  createdAt: string;
};

export type Shipment = {
  id: string;
  userId: string;
  clientCode: string;
  internalTrack: string;
  cargoLabel: string | null;
  status: ShipmentStatusEnum;
  location: string | null;
  pieces: number;
  routeFrom: string;
  routeTo: string;
  deliveryType: DeliveryType;
  localTrackingOrigin: string | null;
  localTrackingDestination: string | null;
  description: string | null;
  mainPhotoUrl: string | null;
  additionalFilesUrls: string | null;
  insuranceTotal: string | null;
  insurancePercentTotal: number | null;
  insurancePerPlacePercent: number | null;
  weightKg: string | null;
  volumeM3: string | null;
  density: string | null;
  tariffType: string | null;
  tariffValue: string | null;
  deliveryCost: string | null;
  deliveryCostPerPlace: string | null;
  totalCost: string | null;
  receivedAtWarehouse: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  eta: string | null;
  deliveryFormat: DeliveryFormat | null;
  deliveryReference: string | null;
  packing: boolean | null;
  localDeliveryToDepot: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type ShipmentWithRelations = Shipment & {
  items: ShipmentItem[];
  statusHistory: ShipmentStatusHistory[];
};



