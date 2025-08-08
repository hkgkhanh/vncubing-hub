from fastapi import FastAPI, Response, Cookie, HTTPException
from pydantic import BaseModel
from upstash_redis import Redis
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()
redis = Redis.from_env()

app = FastAPI()

SESSION_TIMEOUT_SECONDS = 900  # 15 minutes

# Define the request body model for login
class LoginRequest(BaseModel):
    username: str

@app.post("/login/")
async def login(request: LoginRequest, response: Response):
    session_id = str(uuid.uuid4())
    redis.hset(f"session:{session_id}", values={"user": request.username, "status": "active"})
    redis.expire(f"session:{session_id}", SESSION_TIMEOUT_SECONDS)

    response.set_cookie(key="session_id", value=session_id, httponly=True)
    return {"message": "Logged in successfully", "session_id": session_id}


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
    return {"message": "Logged out successfully"}