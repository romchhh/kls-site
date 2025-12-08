export interface UserDetailProps {
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastName?: string | null;
  middleName?: string | null;
  phone: string;
  companyName?: string | null;
  clientCode: string;
  password?: string;
  createdAt: string;
}

export interface ShipmentItemRow {
  id: string;
  trackNumber: string | null;
  placeNumber: number | null;
  localTracking: string | null;
  description: string | null;
  quantity: number | null;
  insuranceValue: string | null;
  insurancePercent: number | null;
  insuranceCost: string | null;
  lengthCm: string | null;
  widthCm: string | null;
  heightCm: string | null;
  weightKg: string | null;
  volumeM3: string | null;
  density: string | null;
  tariffType: string | null;
  tariffValue: string | null;
  deliveryCost: string | null;
  cargoType: string | null;
  cargoTypeCustom: string | null;
  note: string | null;
  photoUrl: string | null;
}

export interface ShipmentStatusHistoryRow {
  id: string;
  shipmentId: string;
  status: string;
  location: string | null;
  description: string | null;
  createdAt: string;
}

export interface ShipmentRow {
  id: string;
  internalTrack: string;
  cargoLabel: string | null;
  status: string;
  location: string | null;
  pieces: number;
  routeFrom: string;
  routeTo: string;
  deliveryType: string;
  localTrackingOrigin: string | null;
  localTrackingDestination: string | null;
  description: string | null;
  mainPhotoUrl: string | null;
  additionalFilesUrls: string | null;
  totalCost: string | null;
  receivedAtWarehouse: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  eta: string | null;
  deliveryFormat: string | null;
  deliveryReference: string | null;
  packing: boolean | null;
  packingCost: string | null;
  localDeliveryToDepot: boolean | null;
  localDeliveryCost: string | null;
  batchId: string | null;
  cargoType: string | null;
  cargoTypeCustom: string | null;
  createdAt: string;
  items?: ShipmentItemRow[];
  statusHistory?: ShipmentStatusHistoryRow[];
}

export interface TransactionRow {
  id: string;
  type: string;
  amount: string;
  description: string | null;
  createdAt: string;
}

export interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  shipmentId: string | null;
  shipment?: {
    id: string;
    internalTrack: string;
    totalCost: string | null;
    createdAt: string;
  } | null;
}

export interface BalanceData {
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
  currency: string;
}

export interface BalanceForm {
  type: "income" | "expense";
  amount: string;
  description: string;
  selectedInvoiceId: string;
}

export interface Batch {
  id: string;
  batchId: string;
  description: string | null;
  status: string;
  deliveryType: string;
}

export interface ShipmentFormItem {
  trackNumber: string;
  localTracking: string;
  description: string;
  quantity: string;
  insuranceValue: string;
  insurancePercent: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightKg: string;
  volumeM3: string;
  density: string;
  tariffType: string;
  tariffValue: string;
  deliveryCost: string;
  cargoType: string;
  cargoTypeCustom: string;
  note: string;
}

export interface ShipmentForm {
  batchId: string;
  cargoLabel: string;
  status: string;
  location: string;
  routeFrom: string;
  routeTo: string;
  deliveryType: string;
  description: string;
  mainPhotoUrl: string;
  receivedAtWarehouse: string;
  sentAt: string;
  deliveredAt: string;
  eta: string;
  deliveryFormat: string;
  deliveryReference: string;
  packing: boolean;
  packingCost: string;
  localDeliveryToDepot: boolean;
  localDeliveryCost: string;
  cargoType: string;
  cargoTypeCustom: string;
  additionalFiles: string[];
  items: ShipmentFormItem[];
}

export interface InvoiceForm {
  invoiceNumber: string;
  amount: string;
  status: string;
  dueDate: string;
  shipmentId: string;
}

