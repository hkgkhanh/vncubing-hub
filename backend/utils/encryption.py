import hashlib

def calculate_sha256(data):
    """
    Calculates the SHA-256 hash of the given data.

    Args:
        data (str or bytes): The input data to hash.

    Returns:
        str: The hexadecimal representation of the SHA-256 hash.
    """
    # Encode the string to bytes if it's not already bytes
    if isinstance(data, str):
        data = data.encode('utf-8')

    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()

    # Update the hash object with the data
    sha256_hash.update(data)

    # Get the hexadecimal representation of the hash
    return sha256_hash.hexdigest()