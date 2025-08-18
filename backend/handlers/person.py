import os
from utils.encryption import calculate_sha256
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

def loginByEmailAndPassword(email: str, password: str):
    response = (
        supabase.table("PERSONS")
        .select("hashed_password")
        .eq("email", email)
        .execute()
    )

    hashed_password = calculate_sha256(password)

    if response.count <= 0:
        return {"message": "Login failed: invalid credentials", "status": 403, "ok": False}
    
    person_data = response.data[0]

    if person_data.hashed_password != hashed_password:
        return {"message": "Login failed: invalid credentials", "status": 403, "ok": False}
    
    return {"message": "Login successful", "status": 200, "ok": True}