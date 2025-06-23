# 🛍️ Uplyft E-commerce Chatbot

This project is a full-stack **chatbot-based e-commerce web app** developed for the Uplyft Full Stack Intern Case Study (Internshala, June 2025). It features a smart chatbot, real-time product search, and a clean UI with product listings — all built using Python (Flask), SQLite, and vanilla JavaScript with Bootstrap.

---

## 🔧 Features

✅ Smart chatbot that:
- Searches products by category or price (e.g., “show me electronics under ₹5000”)
- Stores full chat history in the database

✅ Product homepage:
- Displays product cards fetched from the backend
- Bootstrap-powered clean UI
- Button to launch chatbot

✅ Tech stack:
- **Backend:** Python, Flask, SQLAlchemy, SQLite
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Database:** SQLite (relational)
- **Chat logging:** Stored with username, sender, timestamp

---

## 🗂️ Project Structure

```
uplyft-chatbot/
├── backend/
│   ├── app.py               # Flask server
│   ├── models.py            # SQLAlchemy models
│   ├── db_setup.py          # DB initializer
│   ├── db/products.db       # SQLite database
├── frontend/
│   ├── index.html           # Homepage with product listing
│   ├── chatbot.html         # Chatbot interface
│   ├── style.css            # Styling
│   ├── script.js            # Frontend logic
├── README.md
```

---

## 🚀 How to Run Locally

### 📦 Backend (Flask API)

1. Go to the backend folder:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate    # For Windows Git Bash
   pip install -r requirements.txt
   ```

2. Create DB and load mock data:
   ```bash
   python db_setup.py
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

It runs on: `http://127.0.0.1:5000`

---

### 🌐 Frontend

Open `frontend/index.html` in your browser.  
You can also use a live server extension in VS Code.

---

## 🧪 Sample Queries

Try these in the chatbot:
- `show me electronics`
- `books under 1000`
- `textiles below 500`

Check chat history:
```
http://127.0.0.1:5000/history/<your-username>
```

---

## 📝 Future Improvements

- Chatbot history display in frontend
- Admin panel to manage products
- User login with real authentication
- Deployment to Render (backend) + Vercel/Netlify (frontend)

---

## 👨‍💻 Author

Made with ❤️ by Om

---

## 📜 License

MIT License
