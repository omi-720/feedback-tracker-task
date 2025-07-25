# Feedback Tracker

A simple full-stack feedback management system built with React and Node.js.

## Features

- Submit feedback with name, email, and message
- Vote on feedback (upvote/downvote)
- Delete feedback entries
- Real-time statistics dashboard
- Form validation
- Persistent data storage

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/omi-720/feedback-tracker-task
   cd feedback-tracker-task
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies** (if using separate React app)
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   node server.js
   or
   npm start
   ```

   Server runs on: `http://localhost:5000`

2. **Start the frontend** (in new terminal)
   ```bash
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

## API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/feedback`          | Get all feedback    |
| POST   | `/feedback`          | Submit new feedback |
| PUT    | `/feedback/:id/vote` | Vote on feedback    |
| DELETE | `/feedback/:id`      | Delete feedback     |
| GET    | `/health`            | Health check        |

## Testing

### Manual Test Cases

#### 1. Submit Feedback

```bash
curl -X POST http://localhost:5000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great application!"
  }'
```

#### 2. Get All Feedback

```bash
curl http://localhost:5000/feedback
```

#### 3. Vote on Feedback

```bash
curl -X PUT http://localhost:5000/feedback/{FEEDBACK_ID}/vote \
  -H "Content-Type: application/json" \
  -d '{"action": "upvote"}'
```

#### 4. Delete Feedback

```bash
curl -X DELETE http://localhost:5000/feedback/{FEEDBACK_ID}
```

### Frontend Test Cases

#### Valid Form Submission

1. Fill all required fields
2. Click "Submit Feedback"
3. ✅ Success message appears
4. ✅ Form clears
5. ✅ New feedback appears in list

#### Form Validation

1. **Empty name**: Error "Name is required"
2. **Invalid email**: Error "Email is invalid"
3. **Short message**: Error "Message must be at least 10 characters"
4. **Empty fields**: Multiple error messages appear

#### Interactive Features

1. **Upvote**: Click upvote button → vote count increases
2. **Downvote**: Click downvote button → vote count decreases
3. **Delete**: Click delete → confirmation dialog → item removed
4. **Refresh**: Click refresh → latest data loads

## Edge Cases Handled

### Backend

- ✅ Invalid JSON requests
- ✅ Missing required fields
- ✅ Invalid email format
- ✅ Non-existent feedback ID
- ✅ Invalid vote actions
- ✅ File system errors
- ✅ Malformed requests

### Frontend

- ✅ Network connection failures
- ✅ Server errors (5xx responses)
- ✅ Invalid form data
- ✅ Empty feedback list
- ✅ Loading states
- ✅ Character limits
- ✅ Duplicate submissions

## Project Structure

```
feedback-tracker/
├── server.js          # Backend API server
├── feedback.json      # Data storage (auto-created)
├── src/
│   └── FeedbackTracker.jsx  # React frontend
├── package.json       # Dependencies
└── README.md         # This file
```

## Data Storage

- Uses JSON file (`feedback.json`) for persistence
- Automatically creates file on first run
- Falls back to in-memory storage if file operations fail

## Error Handling

### Backend Responses

```json
// Success
{
  "success": true,
  "data": {...},
  "message": "Operation completed"
}

// Error
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

### Frontend Error States

- Network errors → Red alert banner
- Validation errors → Field-specific error messages
- Loading states → Spinner animations
- Empty states → Helpful placeholder messages

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### CORS Issues

- Backend includes CORS middleware
- Allows all origins in development

### File Permissions

```bash
# Ensure write permissions for data file
chmod 644 feedback.json
```

## Environment Variables

```bash
PORT=5000              # Server port (optional)
NODE_ENV=development   # Environment mode
```

## Production Deployment

1. **Build frontend**

   ```bash
   npm run build
   ```

2. **Set environment variables**

   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

3. **Start server**
   ```bash
   node server.js
   ```

## License

MIT License - see LICENSE file for details
