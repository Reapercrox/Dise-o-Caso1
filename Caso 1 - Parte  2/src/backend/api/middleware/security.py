"""Cognito JWT validation middleware."""

from __future__ import annotations

from collections.abc import Awaitable, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class CognitoJwtMiddleware(BaseHTTPMiddleware):
    """Validates Bearer JWT against Cognito JWKS (cached)."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        ...
