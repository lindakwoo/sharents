from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status

from .schemas import TokenData, GuardianModel, MemberModel, UserModel
from .security_utils import verify_password, get_password_hash
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends
from .database import db

SECRET_KEY = "your-secret-key"  # Move this to a config file
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_user(username: str):
    user_collection = db.get_collection("users")
    user = await user_collection.find_one({"username": username})
    if user:
        if user["role"] == "guardian":
            return GuardianModel(**user)

        elif user["role"] == "member":
            return MemberModel(**user)
    return None


async def authenticate_user(username: str, password: str):
    user = await get_user(username)

    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False

    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError as e:
        print(f"JWT decode error: {str(e)}")  # Add this line for debugging
        raise credentials_exception

    user_collection = db.get_collection("users")
    user = await user_collection.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    return UserModel(**user)
