A healthy-eating app (recipes, meal plans, nutrition tracking). Clone and run locally:

how to use:
1. Clone the repo
   - git clone https://github.com/Alshaima12/healthyBite.git
   - cd healthyBite

2. Frontend (example with npm)
   - cd frontend
   - cp .env.example .env
   - npm install
   - npm run dev
   - Open http://localhost:3000

3. Backend (example with Python/FastAPI or Node)
   - cd backend
   - cp .env.example .env
   - For Python:
     - python -m venv venv
     - source venv/bin/activate (macOS/Linux) or venv\Scripts\activate (Windows)
     - pip install -r requirements.txt
     - alembic upgrade head  # if migrations are used
     - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   - Or for Node:
     - npm install
     - npm run migrate
     - npm run dev
