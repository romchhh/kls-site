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
- `track` (string, required) - Внутрішній трек номер замовлення (internalTrack). Формат: `ID_партії-Код_клієнтаТип-Номер`, наприклад `00100-2491Е-0001`

**Приклади:**
- `00100-2491Е-0001`
- `00010-2661A-0001`

### Success Response (200)
```json
{
  "id": "string",
  "internalTrack": "00100-2491Е-0001",
  "cargoLabel": "string",
  "status": "CREATED | RECEIVED_CN | IN_TRANSIT | ARRIVED_UA | ON_UA_WAREHOUSE | DELIVERED | ARCHIVED",
  "description": "string",
  "location": "string",
  "pieces": 2,
  "weightKg": "3.00",
  "volumeM3": "4.00",
  "routeFrom": "CN",
  "routeTo": "UA",
  "deliveryType": "AIR | SEA | RAIL | MULTIMODAL",
  "deliveryFormat": "NOVA_POSHTA | SELF_PICKUP | CARGO",
  "deliveryReference": "string",
  "packing": true,
  "packingCost": "100.00",
  "localDeliveryToDepot": true,
  "localDeliveryCost": "50.00",
  "batchId": "00100",
  "cargoType": "Електроніка",
  "cargoTypeCustom": null,
  "totalCost": "720.00",
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
    "clientCode": "2491",
    "companyName": "string"
  },
  "items": [
    {
      "id": "string",
      "placeNumber": 1,
      "trackNumber": "00100-2491Е0001-1",
      "localTracking": "123123",
      "description": "test",
      "quantity": 4,
      "insuranceValue": "1000.00",
      "insurancePercent": "10",
      "lengthCm": "20.00",
      "widthCm": "50.00",
      "heightCm": "60.00",
      "weightKg": "1.00",
      "volumeM3": "2.00",
      "density": "480.00",
      "tariffType": "kg",
      "tariffValue": "10.00",
      "deliveryCost": "240.00",
      "cargoType": "Електроніка",
      "cargoTypeCustom": null,
      "note": "testes",
      "photoUrl": "string"
    },
    {
      "id": "string",
      "placeNumber": 2,
      "trackNumber": "00100-2491Е0001-2",
      "localTracking": "12321",
      "description": "еуіе2",
      "quantity": 14,
      "insuranceValue": "100.00",
      "insurancePercent": "5",
      "lengthCm": "22.00",
      "widthCm": "21.94",
      "heightCm": "50.00",
      "weightKg": "2.00",
      "volumeM3": "2.00",
      "density": "480.00",
      "tariffType": "kg",
      "tariffValue": "10.00",
      "deliveryCost": "123.00",
      "cargoType": "Електроніка",
      "cargoTypeCustom": null,
      "note": "цггнйцу",
      "photoUrl": "string"
    }
  ],
  "statusHistory": [
    {
      "id": "string",
      "status": "CREATED",
      "location": "Guangzhou",
      "description": "Вантаж створено",
      "createdAt": "2025-11-26T12:00:00.000Z"
    }
  ],
  "invoices": [
    {
      "id": "string",
      "invoiceNumber": "string",
      "amount": "720.00",
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
  "error": "Замовлення з трек номером \"00100-2491Е-0001\" не знайдено"
}
```

### Example Request (cURL)
```bash
curl -X GET "http://localhost:3000/api/public/shipment/00100-2491Е-0001" \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const internalTrack = '00100-2491Е-0001';
const response = await fetch(`http://localhost:3000/api/public/shipment/${encodeURIComponent(internalTrack)}`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});
const data = await response.json();
console.log(data);
```

**Примітка:** Оскільки `internalTrack` може містити спеціальні символи (наприклад, дефіси), рекомендується використовувати `encodeURIComponent()` для безпечного кодування URL.

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
      "routeFrom": "CN",
      "routeTo": "UA",
      "deliveryType": "AIR",
      "deliveryFormat": "SELF_PICKUP",
      "deliveryReference": "REF123",
      "packing": true,
      "packingCost": "100.00",
      "localDeliveryToDepot": true,
      "localDeliveryCost": "50.00",
      "cargoType": "Електроніка",
      "cargoTypeCustom": null,
      "totalCost": "3000.00",
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
          "placeNumber": 1,
          "trackNumber": "00100-2491A0001-1",
          "localTracking": "LOCAL001",
          "description": "Item description",
          "quantity": 1,
          "insuranceValue": "1000.00",
          "insurancePercent": "5",
          "lengthCm": "20.00",
          "widthCm": "50.00",
          "heightCm": "60.00",
          "weightKg": "12.5",
          "volumeM3": "0.321",
          "density": "38.94",
          "tariffType": "kg",
          "tariffValue": "10.00",
          "deliveryCost": "240.00",
          "cargoType": "Електроніка",
          "cargoTypeCustom": null,
          "note": "Note",
          "photoUrl": "/uploads/items/item.jpg"
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

## 4. Get User Invoices

### Endpoint
```
GET /api/public/user/:id/invoices
```

### Description
Отримання всіх рахунків користувача за його ID. Повертає список рахунків зі статистикою.

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
    "clientCode": "1234"
  },
  "invoices": [
    {
      "id": "invoice_id",
      "invoiceNumber": "INV-001",
      "amount": "1300.00",
      "status": "UNPAID | PAID | ARCHIVED",
      "dueDate": "2025-12-15T00:00:00.000Z",
      "createdAt": "2025-12-01T10:30:00.000Z",
      "updatedAt": "2025-12-01T10:30:00.000Z",
      "shipment": {
        "id": "shipment_id",
        "internalTrack": "00100-2491S0003",
        "totalCost": "1300.00",
        "createdAt": "2025-12-01T10:30:00.000Z"
      }
    }
  ],
  "statistics": {
    "total": 1,
    "totalAmount": "1300.00",
    "unpaid": 1,
    "unpaidAmount": "1300.00"
  }
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
curl -X GET http://localhost:3000/api/public/user/cmij6wnoy0000zvwfrcy6lry6/invoices \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const userId = 'cmij6wnoy0000zvwfrcy6lry6';
const response = await fetch(`http://localhost:3000/api/public/user/${userId}/invoices`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});
const data = await response.json();
console.log(data);
```

---

## 5. Get User Information

### Endpoint
```
GET /api/public/user/:id
```

### Description
Отримання повної інформації про користувача за його ID. Повертає баланс, рахунки та статистику вантажів.

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
    "phone": "+380123456789",
    "clientCode": "1234",
    "companyName": "Test Company"
  },
  "balance": {
    "available": 1100.00,
    "incomeTotal": 1100.00,
    "expenseTotal": 0.00,
    "currency": "USD"
  },
  "invoices": {
    "total": 1,
    "totalAmount": "1300.00",
    "unpaid": 1,
    "unpaidAmount": "1300.00",
    "unpaidShipmentsCount": 1
  },
  "shipments": {
    "total": 1,
    "received": 0,
    "inTransit": 0,
    "readyForPickup": 1
  }
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
curl -X GET http://localhost:3000/api/public/user/cmij6wnoy0000zvwfrcy6lry6 \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const userId = 'cmij6wnoy0000zvwfrcy6lry6';
const response = await fetch(`http://localhost:3000/api/public/user/${userId}`, {
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
2. Всі грошові суми повертаються як рядки для точності (крім балансу, який повертається як число)
3. API вимагає Bearer token авторизації для всіх публічних endpoints
4. Для безпеки, при невірних даних авторизації використовується однаковий час відповіді
5. Вантажі зі статусом `CREATED` (Очікується на складі) не повертаються в API для клієнтів

