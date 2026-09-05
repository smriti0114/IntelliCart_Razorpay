echo "Testing with explicit curl command:"
curl -X POST http://localhost:5000/api/ai/intent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I want a laptop under 50000"}'
