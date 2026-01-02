# Knox 007 — Backend

Institutional-grade intraday trading engine backend.

This service powers the Knox 007 frontend by exposing a single,
deterministic decision endpoint.

---

## 🚀 Stack

- FastAPI (Python)
- Render.com deployment
- GitHub source of truth
- Frontend: React (separate repo)

---

## 📡 API
### Health Check

GET /api/health
### Engine Snapshot

POST /api/007/snapshot
Input:
```json
{
  "ticker": "AAPL"
}

Output:
	•	Bias
	•	Probability
	•	Buy zones
	•	Take profit zones
	•	Trim Intensity Score (TIS)
	•	Structural risk flags
	•	Narrative explanation

⸻

🔒 Design Rules
	•	No frontend math
	•	No chart-based decisions
	•	All logic lives server-side
	•	Deterministic, explainable output
	•	Intraday only

🛠 Local Run
pip install -r requirements.txt
uvicorn main:app --reload

🧠 Philosophy

Knox does not sell hope.

Knox sells probability, structure, and discipline.

---

## ✅ Final root structure (confirm this)

knox-007-backend/
├── main.py          ✅
├── requirements.txt
├── start.sh
├── apps.json
└── README.md

If this is what you see in GitHub → **Render will deploy cleanly**.

---

### Next steps (when ready)
- Wire frontend `/snapshot` fetch
- Add versioned `/engine/` math modules
- Add structured changelog auto-write

Just say **“next”**.


