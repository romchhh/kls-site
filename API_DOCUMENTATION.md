# KLS API Documentation

## Base URL
```
http://localhost:3000/api/public
```
або
```
https://kls.international/api/public
```

## Authentication

Всі публічні API вимагають Bearer token авторизації. Токен можна отримати через адмін панель в розділі "API Токени".

### Header Format
```
Authorization: Bearer kls_your_token_here
```

---

## 1. Client Authentication

### Endpoint
```
POST /api/public/client-auth
```

### Description
Авторизація клієнта за кодом клієнта та паролем. Повертає дані клієнта при успішній авторизації.

**⚠️ Вимагає Bearer token авторизації**

### Headers
```
Authorization: Bearer kls_your_token_here
Content-Type: application/json
```

### Request Body
```json
{
  "client_code": "string",
  "password": "string"
}
```

### Success Response (200)
```json
{
  "is_client": true,
  "client_data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### Error Response (401)
```json
{
  "is_client": false,
  "message": "Невірний код клієнта або пароль"
}
```

### Error Response (400)
```json
{
  "is_client": false,
  "message": "client_code та password обов'язкові"
}
```

### Error Response (401 - Invalid Token)
```json
{
  "is_client": false,
  "message": "Unauthorized"
}
```

### Example Request (cURL)
```bash
curl -X POST http://localhost:3000/api/public/client-auth \
  -H "Authorization: Bearer kls_your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "client_code": "1234",
    "password": "password123"
  }'
```

### Example Request (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/api/public/client-auth', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer kls_your_token_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_code: '1234',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

---

## 2. Get Shipment by Internal Track

### Endpoint
```
GET /api/public/shipment/:track
```

### Description
Отримання повної інформації про замовлення (вантаж) за внутрішнім трек номером. Повертає всі дані про замовлення, включаючи клієнта, товари, історію статусів та рахунки.

**⚠️ Вимагає Bearer token авторизації**

### Headers
```
Authorization: Bearer kls_your_token_here
```

### Path Parameters
- `track` (string, required) - Внутрішній трек номер замовлення (internalTrack)

### Success Response (200)
```json
{
  "id": "string",
  "internalTrack": "string",
  "cargoLabel": "string",
  "status": "CREATED | RECEIVED_CN | IN_TRANSIT | ARRIVED_UA | ON_UA_WAREHOUSE | DELIVERED | ARCHIVED",
  "description": "string",
  "location": "string",
  "pieces": 1,
  "weightKg": "12",
  "volumeM3": "321",
  "density": "12",
  "routeFrom": "string",
  "routeTo": "string",
  "deliveryType": "AIR | SEA | RAIL | MULTIMODAL",
  "deliveryFormat": "NOVA_POSHTA | SELF_PICKUP | CARGO",
  "deliveryReference": "string",
  "packing": true,
  "localDeliveryToDepot": true,
  "localTrackingOrigin": "string",
  "localTrackingDestination": "string",
  "deliveryCost": "3123",
  "deliveryCostPerPlace": "312",
  "totalCost": "3000",
  "insuranceTotal": "1000",
  "insurancePercentTotal": 5,
  "insurancePerPlacePercent": 3,
  "tariffType": "string",
  "tariffValue": "10.5",
  "receivedAtWarehouse": "2025-11-28T00:00:00.000Z",
  "sentAt": "2025-11-30T00:00:00.000Z",
  "deliveredAt": "2025-12-03T00:00:00.000Z",
  "eta": "2025-12-06T00:00:00.000Z",
  "mainPhotoUrl": "string",
  "additionalFilesUrls": ["string"],
  "createdAt": "2025-11-26T14:50:58.000Z",
  "updatedAt": "2025-11-26T14:50:58.000Z",
  "client": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "clientCode": "string",
    "companyName": "string"
  },
  "items": [
    {
      "id": "string",
      "itemCode": "string",
      "description": "string",
      "quantity": 1,
      "weightKg": "10",
      "volumeM3": "0.5",
      "density": "20",
      "localTracking": "string",
      "photoUrl": "string",
      "clientTariff": "100",
      "insuranceValue": "500",
      "deliveryCost": "200",
      "totalCost": "800"
    }
  ],
  "statusHistory": [
    {
      "id": "string",
      "status": "CREATED",
      "location": "Guangzhou",
      "description": "string",
      "createdAt": "2025-11-26T12:00:00.000Z"
    }
  ],
  "invoices": [
    {
      "id": "string",
      "invoiceNumber": "string",
      "amount": "3000",
      "status": "UNPAID | PAID | ARCHIVED",
      "dueDate": "2025-12-15T00:00:00.000Z",
      "createdAt": "2025-11-26T14:50:58.000Z",
      "updatedAt": "2025-11-26T14:50:58.000Z"
    }
  ]
}
```

### Error Response (404)
```json
{
  "error": "Замовлення не знайдено"
}
```

### Error Response (400)
```json
{
  "error": "Трек номер замовлення обов'язковий"
}
```

### Error Response (404)
```json
{
  "error": "Замовлення з трек номером \"123\" не знайдено"
}
```

### Example Request (cURL)
```bash
curl -X GET http://localhost:3000/api/public/shipment/123 \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const internalTrack = '123';
const response = await fetch(`http://localhost:3000/api/public/shipment/${internalTrack}`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});
const data = await response.json();
console.log(data);
```

---

## 3. Get All User Shipments

### Endpoint
```
GET /api/public/user/:id/shipments
```

### Description
Отримання всіх замовлень (вантажів) користувача за його ID. Повертає повну інформацію про всі замовлення користувача, включаючи товари, історію статусів та рахунки.

**⚠️ Вимагає Bearer token авторизації**

### Headers
```
Authorization: Bearer kls_your_token_here
```

### Path Parameters
- `id` (string, required) - ID користувача в системі

### Success Response (200)
```json
{
  "user": {
    "id": "cmij6wnoy0000zvwfrcy6lry6",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "clientCode": "1234",
    "companyName": "Test Company"
  },
  "shipments": [
    {
      "id": "cmij6wnoy0000zvwfrcy6lry7",
      "internalTrack": "123",
      "cargoLabel": "Cargo Label",
      "status": "ARRIVED_UA",
      "description": "Shipment description",
      "location": "312",
      "pieces": 1,
      "weightKg": "12.5",
      "volumeM3": "0.321",
      "density": "38.94",
      "routeFrom": "312",
      "routeTo": "321",
      "deliveryType": "AIR",
      "deliveryFormat": "SELF_PICKUP",
      "deliveryReference": "REF123",
      "packing": true,
      "localDeliveryToDepot": true,
      "localTrackingOrigin": "TRACK001",
      "localTrackingDestination": "TRACK002",
      "deliveryCost": "3123.00",
      "deliveryCostPerPlace": "312.00",
      "totalCost": "3000.00",
      "insuranceTotal": "100.00",
      "insurancePercentTotal": 5,
      "insurancePerPlacePercent": 10,
      "tariffType": "STANDARD",
      "tariffValue": "50.00",
      "receivedAtWarehouse": "2025-11-28T00:00:00.000Z",
      "sentAt": "2025-11-30T00:00:00.000Z",
      "deliveredAt": "2025-12-03T00:00:00.000Z",
      "eta": "2025-12-06T00:00:00.000Z",
      "mainPhotoUrl": "/uploads/shipments/photo.jpg",
      "additionalFilesUrls": [
        "/uploads/shipments/file1.jpg",
        "/uploads/shipments/file2.jpg"
      ],
      "createdAt": "2025-11-26T14:50:58.000Z",
      "updatedAt": "2025-12-01T10:30:00.000Z",
      "items": [
        {
          "id": "item1",
          "itemCode": "ITEM001",
          "description": "Item description",
          "quantity": 1,
          "weightKg": "12.5",
          "volumeM3": "0.321",
          "density": "38.94",
          "localTracking": "LOCAL001",
          "photoUrl": "/uploads/items/item.jpg",
          "clientTariff": "50.00",
          "insuranceValue": "100.00",
          "deliveryCost": "3123.00",
          "totalCost": "3000.00"
        }
      ],
      "statusHistory": [
        {
          "id": "status1",
          "status": "ARRIVED_UA",
          "location": "312",
          "description": "Arrived in Ukraine",
          "createdAt": "2025-12-01T10:30:00.000Z"
        }
      ],
      "invoices": [
        {
          "id": "invoice1",
          "invoiceNumber": "INV-001",
          "amount": "3000.00",
          "status": "UNPAID",
          "dueDate": "2025-12-15T00:00:00.000Z",
          "createdAt": "2025-12-01T10:30:00.000Z",
          "updatedAt": "2025-12-01T10:30:00.000Z"
        }
      ]
    }
  ],
  "total": 1
}
```

### Error Response (400)
```json
{
  "error": "User ID is required"
}
```

### Error Response (401 - Invalid Token)
```json
{
  "error": "Unauthorized"
}
```

### Error Response (404)
```json
{
  "error": "User not found"
}
```

### Example Request (cURL)
```bash
curl -X GET http://localhost:3000/api/public/user/cmij6wnoy0000zvwfrcy6lry6/shipments \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const userId = 'cmij6wnoy0000zvwfrcy6lry6';
const response = await fetch(`http://localhost:3000/api/public/user/${userId}/shipments`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});
const data = await response.json();
console.log(data);
```

---

## Status Codes

- `200` - Успішний запит
- `400` - Помилка валідації (відсутні обов'язкові поля)
- `401` - Неавторизований (невірний код клієнта або пароль)
- `404` - Ресурс не знайдено
- `500` - Внутрішня помилка сервера

---

## Notes

1. Всі дати повертаються в форматі ISO 8601 (UTC)
2. Всі грошові суми повертаються як рядки для точності
3. API не вимагає авторизації, але захищене від DDoS атак
4. Для безпеки, при невірних даних авторизації використовується однаковий час відповіді

