import logging
import time
import uuid

from starlette.types import ASGIApp, Message, Receive, Scope, Send

logger = logging.getLogger("envirescue.request")


class RequestLoggingMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        request_id = next(
            (value.decode() for key, value in scope.get("headers", []) if key == b"x-request-id"),
            str(uuid.uuid4()),
        )
        started = time.perf_counter()
        status_code = 500

        async def send_with_metadata(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = int(message["status"])
                headers = list(message.get("headers", []))
                headers.append((b"x-request-id", request_id.encode()))
                message = {**message, "headers": headers}
            await send(message)

        try:
            await self.app(scope, receive, send_with_metadata)
        finally:
            duration_ms = round((time.perf_counter() - started) * 1000, 2)
            logger.info(
                "request_completed request_id=%s method=%s path=%s status=%s duration_ms=%s",
                request_id,
                scope.get("method", ""),
                scope.get("path", ""),
                status_code,
                duration_ms,
            )
