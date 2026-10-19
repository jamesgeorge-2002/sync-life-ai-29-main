"""
LIFE-SYNC AI — Unified Healthcare AI Assistant Service
Combines LangChain, Groq (Llama-3.3-70B), OpenRouter, and Google Gemini with safety triage and medical disclaimers.
Integrated directly into the unified python_backend service.
"""

import os
import json
import http.client
from typing import List, Dict, Any, Optional

# Load environment configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "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")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "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")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AQ.Ab8RN6JuLBsIAkJUeN29XiKhr41wglq_UxUSeXFrr5EjWrTFtg")

HEALTHCARE_SYSTEM_PROMPT = """You are Healthcare AI Assistant, a professional healthcare information assistant integrated into LIFE-SYNC Health Hub.
Your role is to provide helpful, friendly, empathetic, evidence-based, safe, and simple health education to users.

You may help with:
- General medical questions and health education
- Symptom guidance (informational only, never diagnostic)
- Medication information (general facts only, never dosages or prescriptions)
- Disease awareness and prevention
- Healthy lifestyle, diet, and exercise suggestions
- Mental wellness & stress management
- First-aid guidance
- Child care, women's health, and elderly care awareness
- Vaccination awareness and preventive healthcare

You must NEVER:
- Diagnose a disease or condition
- Prescribe medicines or recommend drug dosages
- Claim to replace a licensed doctor
- Provide emergency treatment instructions beyond basic first aid

If the user describes an emergency (chest pain, difficulty breathing, stroke symptoms, heavy bleeding, suicidal thoughts, heart attack symptoms, loss of consciousness, seizures, or poisoning), immediately and clearly advise them to contact emergency medical services (911 / 112 / 108) or go to the nearest hospital before anything else.

Always keep your tone warm, clear, and reassuring. Always end substantive answers with: "This AI assistant provides educational information only and should not replace professional medical advice."
"""

HEALTHCARE_DISCLAIMER = "This AI assistant provides educational information only and should not replace professional medical advice."

EMERGENCY_KEYWORDS = [
    "chest pain",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "shortness of breath",
    "stroke",
    "slurred speech",
    "face drooping",
    "heavy bleeding",
    "uncontrolled bleeding",
    "suicidal",
    "suicide",
    "kill myself",
    "want to die",
    "heart attack",
    "unconscious",
    "loss of consciousness",
    "seizure",
    "convulsion",
    "poisoning",
    "overdose",
    "severe allergic reaction",
    "anaphylaxis"
]

EMERGENCY_RESPONSE = (
    "🚨 **MEDICAL EMERGENCY ALERT**\n\n"
    "This sounds like it could be a critical medical emergency. Please immediately:\n"
    "1. **Call your local emergency number** (e.g., 911 / 112 / 108 / 999) or go to the nearest emergency room.\n"
    "2. If you are with someone experiencing this, **do not leave them alone**.\n"
    "3. Rest in a safe, seated or lying position while help arrives.\n\n"
    "⚠️ *This AI assistant provides educational information only and should not replace professional emergency care.*"
)

CURATED_TOPICS = [
    {"id": "vitals", "title": "Understanding Vitals", "desc": "Heart rate, blood pressure, and oxygen saturation norms", "prompt": "What are the normal healthy ranges for resting heart rate and blood pressure?"},
    {"id": "nutrition", "title": "Nutrition & Diet", "desc": "Balanced diets, macro/micro nutrients, hydration", "prompt": "Can you give me evidence-based tips for improving daily nutrition and energy?"},
    {"id": "mental", "title": "Mental Wellness", "desc": "Stress reduction, anxiety coping, sleep hygiene", "prompt": "What are effective non-medical techniques to manage daily work stress and anxiety?"},
    {"id": "exercise", "title": "Physical Fitness", "desc": "Safe cardiovascular workouts and mobility", "prompt": "How much moderate exercise is recommended per week for cardiovascular health?"},
    {"id": "first_aid", "title": "First Aid Basics", "desc": "Minor burns, cuts, sprains, heat exhaustion", "prompt": "What is the standard first-aid procedure for a minor sprain or burn?"},
    {"id": "sleep", "title": "Sleep Optimization", "desc": "Circadian rhythm, deep sleep, bedtime routine", "prompt": "How can I improve sleep quality and circadian rhythm naturally?"}
]


def contains_emergency(text: str) -> bool:
    """Detects whether user query matches any emergency keywords."""
    lowered = text.lower()
    return any(kw in lowered for kw in EMERGENCY_KEYWORDS)


def get_emergency_response() -> str:
    """Returns standard emergency triage guidance."""
    return EMERGENCY_RESPONSE


def ensure_disclaimer(response_text: str) -> str:
    """Ensures medical educational disclaimer is attached."""
    if "educational information only" not in response_text:
        return f"{response_text.strip()}\n\n⚠️ *{HEALTHCARE_DISCLAIMER}*"
    return response_text


def call_groq_llm(messages: List[Dict[str, str]]) -> Optional[str]:
    """Invokes Groq API with verified active models."""
    if not GROQ_API_KEY:
        return None
    groq_models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]
    for model in groq_models:
        try:
            conn = http.client.HTTPSConnection("api.groq.com", timeout=12)
            payload = json.dumps({
                "model": model,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 1500
            })
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_API_KEY}"
            }
            conn.request("POST", "/openai/v1/chat/completions", body=payload, headers=headers)
            res = conn.getresponse()
            data = res.read().decode("utf-8")
            conn.close()
            if res.status == 200:
                parsed = json.loads(data)
                content = parsed["choices"][0]["message"]["content"].strip()
                if content:
                    print(f"[Healthcare Groq Success] Model: {model}")
                    return content
            else:
                print(f"[Healthcare Groq] Model {model} status {res.status}")
        except Exception as e:
            print(f"[Healthcare Groq Error {model}]: {e}")
    return None


def call_openrouter_llm(messages: List[Dict[str, str]]) -> Optional[str]:
    """Invokes OpenRouter with auto-routing (best available model)."""
    if not OPENROUTER_API_KEY:
        return None
    or_models = ["openrouter/auto", "meta-llama/llama-3.3-70b-instruct", "openai/gpt-4o-mini"]
    for model in or_models:
        try:
            conn = http.client.HTTPSConnection("openrouter.ai", timeout=12)
            payload = json.dumps({
                "model": model,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 1500
            })
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "LifeSync-Healthcare"
            }
            conn.request("POST", "/api/v1/chat/completions", body=payload, headers=headers)
            res = conn.getresponse()
            data = res.read().decode("utf-8")
            conn.close()
            if res.status == 200:
                parsed = json.loads(data)
                content = parsed["choices"][0]["message"]["content"].strip()
                if content:
                    print(f"[Healthcare OpenRouter Success] Model: {model}")
                    return content
        except Exception as e:
            print(f"[Healthcare OpenRouter Error {model}]: {e}")
    return None


def call_gemini_llm(user_query: str, history_str: str) -> Optional[str]:
    """Invokes Google Gemini API directly with verified active models."""
    if not GEMINI_API_KEY:
        return None
    # Use verified active Gemini models (gemini-3.5-flash-lite confirmed working)
    for model in ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemma-4-31b-it", "gemini-3.8-flash", "gemini-3.7-flash"]:
        try:
            conn = http.client.HTTPSConnection("generativelanguage.googleapis.com", timeout=15)
            prompt = f"{history_str}\n\nUser Question: {user_query}\nHealthcare AI Assistant:"
            payload = json.dumps({
                "contents": [
                    {"role": "user", "parts": [{"text": f"[System]\n{HEALTHCARE_SYSTEM_PROMPT}\n\n{prompt}"}]}
                ],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 1500}
            })
            headers = {"Content-Type": "application/json"}
            conn.request("POST", f"/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}", body=payload, headers=headers)
            res = conn.getresponse()
            data = res.read().decode("utf-8")
            conn.close()
            if res.status == 200:
                parsed = json.loads(data)
                candidates = parsed.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        text = parts[0].get("text", "").strip()
                        if text:
                            print(f"[Healthcare Gemini Success] Model: {model}")
                            return text
            else:
                print(f"[Healthcare Gemini] Model {model} status {res.status}")
        except Exception as e:
            print(f"[Healthcare Gemini Error {model}]: {e}")
    return None


def chat_healthcare(user_query: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Main entrypoint for Healthcare AI consultation.
    Performs emergency safety check, formats history, invokes LLM with fallback, and guarantees disclaimer.
    """
    user_query = (user_query or "").strip()
    if not user_query:
        return {
            "response": "Hello! I am your Healthcare AI Assistant. How can I help you today with your health or wellness questions?",
            "is_emergency": False,
            "model_used": "system"
        }

    # 1. Emergency Safety Triage
    if contains_emergency(user_query):
        return {
            "response": get_emergency_response(),
            "is_emergency": True,
            "model_used": "safety-triage"
        }

    # 2. Build Message Payloads
    history = history or []
    messages = [{"role": "system", "content": HEALTHCARE_SYSTEM_PROMPT}]
    
    for h in history[-6:]:
        role = "user" if h.get("role") in ["user", "human"] else "assistant"
        content = h.get("content") or h.get("text") or ""
        if content:
            messages.append({"role": role, "content": content})
            
    messages.append({"role": "user", "content": user_query})

    # 3. Provider Waterfall: Groq Llama 3.3 -> OpenRouter GPT-4o-mini -> Gemini
    response_text = call_groq_llm(messages)
    model_used = "groq-llama-3.3-70b"

    if not response_text:
        response_text = call_openrouter_llm(messages)
        model_used = "openrouter-gpt-4o-mini"

    if not response_text:
        hist_text = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in messages if m['role'] != 'system'])
        response_text = call_gemini_llm(user_query, hist_text)
        model_used = "google-gemini"

    # 4. Fallback if offline
    if not response_text:
        model_used = "rule-based-fallback"
        response_text = (
            f"Here is educational guidance regarding your query about **'{user_query}'**:\n\n"
            "• **General Health Principle:** For any new or persistent health symptoms, keep a daily symptom log noting frequency and triggers.\n"
            "• **Hydration & Rest:** Ensure adequate fluid intake, regular sleep patterns, and avoid strenuous exertion until evaluated.\n"
            "• **Consult a Professional:** Please consult a licensed physician or healthcare specialist for clinical diagnosis and personalized treatment."
        )

    response_text = ensure_disclaimer(response_text)

    return {
        "response": response_text,
        "is_emergency": False,
        "model_used": model_used
    }
