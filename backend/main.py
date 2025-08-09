from fastapi import FastAPI, Response, Cookie, HTTPException
from pydantic import BaseModel
from upstash_redis import Redis
from dotenv import load_dotenv
import uuid

from handlers.person import loginByEmailAndPassword

# Load environment variables
load_dotenv()
redis = Redis.from_env()

app = FastAPI()

SESSION_TIMEOUT_SECONDS = 7200  # 2 hours

# Define the request body model for login
class LoginRequest(BaseModel):
    email: str
    password: str
    accountType: str # either "person" or "admin"

@app.post("/login/")
async def login(request: LoginRequest, response: Response):

    person_data = loginByEmailAndPassword(request.email, request.password)

    if not person_data.ok:
        return {"message": "Login failed: Invalid credentials", "ok": False}

    session_id = str(uuid.uuid4())
    redis.hset(f"session:{session_id}", values={"email": request.email, "group": request.accountType})
    redis.expire(f"session:{session_id}", SESSION_TIMEOUT_SECONDS)

    response.set_cookie(key="session_id", value=session_id, httponly=True)
    return {"message": "Login successful", "session_id": session_id, "ok": True}


@app.get("/profile/")
async def get_profile(session_id: str = Cookie(None)):
    if not session_id:
        raise HTTPException(status_code=403, detail="No session cookie found")

    session_data = redis.hgetall(f"session:{session_id}")
    if not session_data:
        response = Response()
        response.delete_cookie(key="session_id") # Clear the expired cookie
        raise HTTPException(status_code=404, detail="Session expired")

    # Update the session expiration time (sliding expiration)
    redis.expire(f"session:{session_id}", SESSION_TIMEOUT_SECONDS)

    return {"session_id": session_id, "session_data": session_data}


@app.post("/logout/")
async def logout(response: Response, session_id: str = Cookie(None)):
    if session_id:
        redis.delete(f"session:{session_id}")
        response.delete_cookie(key="session_id")
    return {"message": "Logout successful"}