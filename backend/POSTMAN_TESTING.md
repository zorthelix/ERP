# Postman API Testing Guide

Set `baseUrl` to `http://localhost:5000/api` and create a `token` collection variable. For protected endpoints, use the **Bearer Token** authorization type and set it to `{{token}}`.

| Endpoint | Method | Body / parameters | Expected result |
|---|---:|---|---|
| `{{baseUrl}}/health` | GET | None | `200` and `{ "status": "ok" }`. |
| `{{baseUrl}}/auth/register` | POST | `{ "fullName": "Nurag Nayak", "email": "avery@example.com", "password": "SecurePass123!" }` | `201`, a `token`, and a `user` object. Copy `token` to `{{token}}`. Repeating returns `409`. |
| `{{baseUrl}}/auth/login` | POST | `{ "email": "avery@example.com", "password": "SecurePass123!" }` | `200`, a fresh JWT, and the account profile. Incorrect credentials return `401`. |
| `{{baseUrl}}/products` | GET | Authorization only | `200` and products. Omitting the token returns `401`. |
| `{{baseUrl}}/products` | POST | `{ "sku": "MUG-COBALT", "name": "Cobalt Stoneware Mug", "description": "12 oz retail mug", "unitPrice": 18.5, "quantity": 24, "reorderLevel": 6 }` | `201`; save `product.id` as `productId`. |
| `{{baseUrl}}/products/{{productId}}` | PUT | `{ "unitPrice": 19.5, "quantity": 30, "reorderLevel": 8 }` | `200` and updated product/inventory data. Negative quantities return `422`. |
| `{{baseUrl}}/sales` | POST | `{ "items": [{ "productId": {{productId}}, "quantity": 2 }], "taxRate": 8, "paymentMethod": "card", "notes": "Counter sale" }` | `201`. Then `GET /products` to confirm quantity decreased by 2. Try a quantity greater than stock: expect `422` and unchanged inventory. |
| `{{baseUrl}}/sales` | GET | Optional `?limit=25` | `200` and a reverse-chronological sales list. |
| `{{baseUrl}}/reports/inventory` | GET | Authorization only | `200` with summary and items, including low-stock state. |
| `{{baseUrl}}/reports/sales` | GET | Optional `?from=2026-01-01&to=2026-12-31` | `200` with totals, daily revenue, and top products. |
| `{{baseUrl}}/products/{{productId}}` | DELETE | Authorization only | `204` for an unsold product. A product referenced by a sale returns `409`, preserving history. |

## Suggested Postman tests

Use this after successful registration and login to retain the JWT:

```javascript
pm.collectionVariables.set('token', pm.response.json().token);
```

Use this after product creation to retain its id:

```javascript
pm.collectionVariables.set('productId', pm.response.json().product.id);
```

