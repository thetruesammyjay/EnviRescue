from datetime import timedelta

from fastapi import APIRouter, Header, HTTPException, status
from sqlalchemy import select

from app.api.dependencies import CurrentUser, DatabaseSession
from app.core.cache import cache
from app.core.security import (
    create_access_token,
    create_email_verification_token,
    create_refresh_token,
    decode_access_token,
    hash_password,
)
from app.models.user import User
from app.schemas.auth import (
    EmailVerificationConfirm,
    LoginRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    TokenRequest,
    TokenResponse,
)
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, session: DatabaseSession) -> UserRead:
    try:
        user = await register_user(session, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return UserRead.model_validate(user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: DatabaseSession) -> TokenResponse:
    user = await authenticate_user(session, payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password."
        )
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        user=UserRead.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, session: DatabaseSession) -> TokenResponse:
    try:
        claims = decode_access_token(payload.refresh_token)
        if claims.get("type") != "refresh" or cache.exists(f"revoked:{claims['jti']}"):
            raise ValueError
        user = await session.get(User, claims["sub"])
        if user is None or not user.is_active:
            raise ValueError
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token.") from exc
    cache.set_json(f"revoked:{claims['jti']}", True, 2_592_000)
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id), claims.get("family")),
        user=UserRead.model_validate(user),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(_: CurrentUser, authorization: str | None = Header(default=None)) -> None:
    if authorization and authorization.lower().startswith("bearer "):
        try:
            claims = decode_access_token(authorization[7:])
            cache.set_json(f"revoked:{claims['jti']}", True, 2_592_000)
        except Exception:
            pass
    return None


@router.post("/revoke", status_code=status.HTTP_204_NO_CONTENT)
async def revoke(payload: TokenRequest, _: CurrentUser) -> None:
    try:
        claims = decode_access_token(payload.token)
        cache.set_json(f"revoked:{claims['jti']}", True, 2_592_000)
    except Exception:
        pass


@router.post("/password-reset/request")
async def request_password_reset(
    payload: PasswordResetRequest, session: DatabaseSession
) -> dict[str, str]:
    user = await session.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None:
        return {"message": "If the account exists, a reset token can be issued."}
    token = create_access_token(str(user.id), timedelta(minutes=15))
    cache.set_json(f"password-reset:{token}", True, 900)
    return {"message": "Password reset token generated.", "token": token}


@router.post("/password-reset/confirm")
async def confirm_password_reset(
    payload: PasswordResetConfirm, session: DatabaseSession
) -> dict[str, str]:
    try:
        claims = decode_access_token(payload.token)
        if not cache.exists(f"password-reset:{payload.token}"):
            raise ValueError
        user = await session.get(User, claims["sub"])
        if user is None:
            raise ValueError
        user.password_hash = hash_password(payload.new_password)
        await session.commit()
        cache.delete(f"password-reset:{payload.token}")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.") from exc
    return {"message": "Password reset successful."}


@router.post("/verify-email")
async def verify_email(
    payload: EmailVerificationConfirm, session: DatabaseSession
) -> dict[str, str]:
    try:
        claims = decode_access_token(payload.token)
        if claims.get("type") != "email_verification":
            raise ValueError
        user = await session.get(User, claims["sub"])
        if user is None:
            raise ValueError
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid verification token.") from exc
    return {"message": "Email verification accepted."}


@router.post("/verify-email/request")
async def request_email_verification(user: CurrentUser) -> dict[str, str]:
    return {
        "message": "Email verification token generated.",
        "token": create_email_verification_token(str(user.id)),
    }


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)
