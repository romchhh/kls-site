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
  "packingCost": "100.00",  // null якщо packing = false
  "localDeliveryToDepot": true,
  "localDeliveryCost": "50.00",  // null якщо localDeliveryToDepot = false
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

**Важливі примітки про формат даних:**

1. **Логічна відповідність полів:**
   - Якщо `packing = false`, то `packingCost` **завжди** `null`
   - Якщо `packing = true`, то `packingCost` містить вартість упаковки (рядок з числом, наприклад `"100.00"`)
   - Якщо `localDeliveryToDepot = false`, то `localDeliveryCost` **завжди** `null`
   - Якщо `localDeliveryToDepot = true`, то `localDeliveryCost` містить вартість локальної доставки (рядок з числом, наприклад `"50.00"`)

2. **Формат числових значень:**
   - Всі числові поля (вага, об'єм, вартість) повертаються як **рядки** з двома десятковими знаками
   - Приклад: `"100.00"`, `"12.50"`, `"0.00"` (або `null` якщо значення відсутнє)

3. **Поля items (місця вантажу):**
   - Кожен item містить обов'язкові поля: `weightKg`, `volumeM3`, `cargoType`/`cargoTypeCustom`, `deliveryCost`
   - Всі числові поля форматуются як рядки з двома десятковими знаками

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
      "weightKg": "12.50",
      "volumeM3": "0.32",
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

## 6. Get User Finances

### Endpoint
```
GET /api/public/user/:id/finances
```

### Description
Отримання фінансової інформації користувача: баланс та історія транзакцій з running balance.

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
  "balance": {
    "available": "1100.00",
    "incomeTotal": "1100.00",
    "expenseTotal": "0.00",
    "currency": "USD"
  },
  "transactions": [
    {
      "id": "transaction_id",
      "type": "income",
      "amount": "500.00",
      "description": "Поповнення балансу",
      "createdAt": "2025-12-01T10:30:00.000Z",
      "runningBalance": "500.00"
    },
    {
      "id": "transaction_id_2",
      "type": "expense",
      "amount": "100.00",
      "description": "Оплата за вантаж",
      "createdAt": "2025-12-02T14:20:00.000Z",
      "runningBalance": "400.00"
    },
    {
      "id": "transaction_id_3",
      "type": "income",
      "amount": "700.00",
      "description": "Поповнення балансу",
      "createdAt": "2025-12-03T09:15:00.000Z",
      "runningBalance": "1100.00"
    }
  ]
}
```

### Response Fields

#### Balance Object
- `available` (string) - Поточний баланс користувача (форматований як рядок з 2 знаками після коми)
- `incomeTotal` (string) - Загальна сума поповнень (форматований як рядок з 2 знаками після коми)
- `expenseTotal` (string) - Загальна сума списаних коштів (форматований як рядок з 2 знаками після коми)
- `currency` (string) - Валюта (завжди "USD")

#### Transaction Object
- `id` (string) - Унікальний ідентифікатор транзакції
- `type` (string) - Тип транзакції: `"income"` (поповнення) або `"expense"` (списання)
- `amount` (string) - Сума транзакції (форматований як рядок з 2 знаками після коми)
- `description` (string | null) - Опис транзакції
- `createdAt` (string) - Дата створення транзакції в форматі ISO 8601
- `runningBalance` (string) - Running balance після цієї транзакції (форматований як рядок з 2 знаками після коми)

**Примітка:** Транзакції повертаються в хронологічному порядку (від найстарішої до найновішої) для правильного розрахунку running balance.

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
curl -X GET http://localhost:3000/api/public/user/cmij6wnoy0000zvwfrcy6lry6/finances \
  -H "Authorization: Bearer kls_your_token_here"
```

### Example Request (JavaScript)
```javascript
const userId = 'cmij6wnoy0000zvwfrcy6lry6';
const response = await fetch(`http://localhost:3000/api/public/user/${userId}/finances`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});
const data = await response.json();
console.log(data);
```

---

## 7. Generate Invoice (Excel)

### Endpoint
```
GET /api/invoices/:invoiceId/generate
```

**Base URL:** `http://localhost:3000` або `https://kls.international`

### Description
Генерація інвойсу в форматі Excel для інвойсу на оплату. Повертає Excel файл (.xlsx) з детальною інформацією про вантаж, включаючи всі місця, вартості, страхування та підсумки.

**⚠️ Вимагає Bearer token авторизації або сесії адміна/користувача**

**⚠️ Інвойси-файли тепер прив'язані до інвойсів на оплату, а не до вантажів. Інвойс на оплату повинен бути створений для вантажу перед генерацією файлу.**

### Headers
```
Authorization: Bearer kls_your_token_here
```

### Path Parameters
- `invoiceId` (string, required) - ID інвойсу на оплату.

**Приклади:**
- ID інвойсу: `cmink2ief0000u0oifboul1qi`

### Success Response (200)
Повертає Excel файл (.xlsx) з наступною структурою:

- **Заголовок:**
  - Логотип KLS (правый верхній кут)
  - Код клієнта, Маркування, Тип доставки, Напрям, Дати (отримано, відправлено, доставлено)

- **Таблиця місць вантажу:**
  - № Місця
  - Трек номер (без ID партії)
  - Опис
  - Кількість ШТ
  - Страхування (Сума, %, Вартість)
  - Вага KG
  - Об'єм м³
  - Щільність
  - Тариф кг/м³
  - Вартість

- **Підсумки:**
  - Вартість доставки
  - Вартість пакування
  - Вартість локальної доставки
  - Вартість страхування
  - Загалом (USD)
  - Баланс клієнта
  - Загалом до сплати (USD)

### Response Headers
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="invoice_INV-2491R0006-20251223_2025-12-23.xlsx"
```

### Error Response (401)
```json
{
  "error": "Unauthorized"
}
```

### Error Response (404)
```json
{
  "error": "Інвойс не знайдено"
}
```

або

```json
{
  "error": "Вантаж не знайдено для цього інвойсу"
}
```

### Error Response (403)
```json
{
  "error": "Forbidden"
}
```

### Example Request (cURL)
```bash
# За ID інвойсу
curl -X GET "http://localhost:3000/api/invoices/cmink2ief0000u0oifboul1qi/generate" \
  -H "Authorization: Bearer kls_your_token_here" \
  --output invoice.xlsx
```

### Example Request (JavaScript)
```javascript
const invoiceId = 'cmink2ief0000u0oifboul1qi'; // ID інвойсу на оплату
const response = await fetch(`http://localhost:3000/api/invoices/${encodeURIComponent(invoiceId)}/generate`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice_${invoiceId}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

---

## 8. Generate Invoice (PDF)

### Endpoint
```
GET /api/invoices/:invoiceId/generate-pdf
```

**Base URL:** `http://localhost:3000` або `https://kls.international`

### Description
Генерація інвойсу в форматі PDF для інвойсу на оплату. Повертає PDF файл з детальною інформацією про вантаж, включаючи всі місця, вартості, страхування та підсумки. PDF генерується з HTML за допомогою Puppeteer, тому має точно такий самий вигляд як Excel версія.

**⚠️ Вимагає Bearer token авторизації або сесії адміна/користувача**

**⚠️ Для роботи потрібен встановлений `puppeteer` пакет**

**⚠️ Інвойси-файли тепер прив'язані до інвойсів на оплату, а не до вантажів. Інвойс на оплату повинен бути створений для вантажу перед генерацією файлу.**

### Headers
```
Authorization: Bearer kls_your_token_here
```

### Path Parameters
- `invoiceId` (string, required) - ID інвойсу на оплату.

**Приклади:**
- ID інвойсу: `cmink2ief0000u0oifboul1qi`

### Success Response (200)
Повертає PDF файл з тією ж структурою, що й Excel версія:

- **Заголовок:**
  - Логотип KLS (правый верхній кут)
  - Код клієнта, Маркування, Тип доставки, Напрям, Дати

- **Таблиця місць вантажу:**
  - Всі ті самі поля, що й в Excel версії

- **Підсумки:**
  - Всі ті самі підсумки, що й в Excel версії

### Response Headers
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice_INV-2491R0006-20251223_2025-12-23.pdf"
```

### Error Response (401)
```json
{
  "error": "Unauthorized"
}
```

### Error Response (404)
```json
{
  "error": "Інвойс не знайдено"
}
```

або

```json
{
  "error": "Вантаж не знайдено для цього інвойсу"
}
```

### Error Response (403)
```json
{
  "error": "Forbidden"
}
```

### Error Response (503)
```json
{
  "error": "PDF generation requires puppeteer package",
  "message": "Please install puppeteer: npm install puppeteer",
  "details": "For API usage, puppeteer must be installed to generate PDF files"
}
```

### Example Request (cURL)
```bash
# За ID інвойсу
curl -X GET "http://localhost:3000/api/invoices/cmink2ief0000u0oifboul1qi/generate-pdf" \
  -H "Authorization: Bearer kls_your_token_here" \
  --output invoice.pdf
```

### Example Request (JavaScript)
```javascript
const invoiceId = 'cmink2ief0000u0oifboul1qi'; // ID інвойсу на оплату
const response = await fetch(`http://localhost:3000/api/invoices/${encodeURIComponent(invoiceId)}/generate-pdf`, {
  headers: {
    'Authorization': 'Bearer kls_your_token_here'
  }
});

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Clean up after a delay
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
```

### Примітки

1. **Автоматичний пошук:** API автоматично шукає вантаж спочатку за ID, потім за трек номером (internalTrack), тому можна використовувати будь-який з них.

2. **URL-кодування:** Рекомендується використовувати `encodeURIComponent()` для безпечного кодування `shipmentId` в URL, особливо якщо використовується трек номер зі спеціальними символами.

3. **Формат трек номерів:** Трек номери в інвойсі відображаються без ID партії (наприклад, `2491R0006-2` замість `00100-2491R0006-2`).

4. **Автентифікація:** Endpoints підтримують як API токени (Bearer token), так і сесії адмінів/користувачів. Для API токенів доступ дозволено (токени створюються адмінами), для сесій перевіряється право доступу до вантажу.

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

