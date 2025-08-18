import requests

base_url = "http://127.0.0.1:8000"

# Test login
response = requests.post(f"{base_url}/login/", json={"username": "abdullah"})
print("Login Response:", response.json())

# In the browser, you don't need to set cookies manually. The browser will handle it automatically.
session_cookie = response.cookies.get("session_id")

# Test profile
profile_response = requests.get(f"{base_url}/profile/", cookies={"session_id": session_cookie})
print("Access Profile Response:", profile_response.json())

# Test logout
logout_response = requests.post(f"{base_url}/logout/", cookies={"session_id": session_cookie})
print("Logout Response:", logout_response.json())

# Test profile after logout
profile_after_logout_response = requests.get(f"{base_url}/profile/", cookies={"session_id": session_cookie})
print("Access Profile After Logout Response:", profile_after_logout_response.text)