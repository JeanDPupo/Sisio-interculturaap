# Sisio API Documentation

## Base URL
`http://localhost:8000`

## Authentication Endpoints

### POST /api/auth/register
Create a new user account.

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "access_token": "string",
  "refresh_token": "string"
}
```

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user|admin|guest"
  }
}
```

### POST /api/auth/guest
Create a guest user session.

**Request:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "access_token": "string",
  "role": "guest"
}
```

### POST /api/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "string"
}
```

**Response:**
```json
{
  "access_token": "string"
}
```

### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Bird Endpoints

### GET /api/birds
Get list of birds.

**Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)
- `search`: string (optional)

**Response:**
```json
{
  "birds": [
    {
      "id": "string",
      "name": "string",
      "scientific_name": "string",
      "description": "string",
      "ecosistema_riesgo": "bajo|medio|alto",
      "image_url": "string"
    }
  ],
  "total": "number"
}
```

### POST /api/birds/identify
Identify a bird from photo or audio.

**Request (multipart/form-data):**
- `type`: "photo" | "audio"
- `file`: binary

**Response:**
```json
{
  "bird_id": "string",
  "bird_name": "string",
  "confidence": 0.95,
  "alternatives": [
    {
      "bird_id": "string",
      "bird_name": "string",
      "confidence": 0.80
    }
  ]
}
```

## Sighting Endpoints

### GET /api/sightings
Get user sightings.

**Query Parameters:**
- `user_id`: string (optional)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response:**
```json
{
  "sightings": [
    {
      "id": "string",
      "user_id": "string",
      "bird_id": "string",
      "bird_name": "string",
      "latitude": "number",
      "longitude": "number",
      "confidence": 0.95,
      "ecosystem_risk": "bajo|medio|alto",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "total": "number"
}
```

### POST /api/sightings
Create a new sighting.

**Request:**
```json
{
  "bird_id": "string",
  "latitude": "number",
  "longitude": "number",
  "confidence": "number",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "user_id": "string",
  "bird_id": "string",
  "latitude": "number",
  "longitude": "number",
  "created_at": "ISO8601"
}
```

## Comments Endpoints

### GET /api/sightings/{sightingId}/comments
Get comments for a sighting.

**Response:**
```json
{
  "comments": [
    {
      "id": "string",
      "user_id": "string",
      "user_name": "string",
      "text": "string",
      "created_at": "ISO8601"
    }
  ]
}
```

### POST /api/sightings/{sightingId}/comments
Add comment to sighting.

**Request:**
```json
{
  "text": "string"
}
```

## Admin Endpoints

### GET /api/admin/stats
Get global statistics.

**Response:**
```json
{
  "total_users": "number",
  "total_sightings": "number",
  "total_comments": "number",
  "high_risk_birds": "number"
}
```

### GET /api/admin/moderation-queue
Get moderation queue items.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "type": "comment|sighting|report",
      "content": "string",
      "status": "pending|approved|rejected",
      "created_at": "ISO8601"
    }
  ]
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "detail": "Error message",
  "status": 400
}
```

## Common HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
