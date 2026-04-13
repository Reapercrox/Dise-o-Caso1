"""S3 storage adapter (boto3)."""

from __future__ import annotations

from dataclasses import dataclass

from domain.common.ports import IS3Storage


@dataclass
class S3StorageAdapter:
    """Pre-signed URLs and object existence checks."""

    uploads_bucket: str
    outputs_bucket: str

    def generate_presigned_put(self, *, key: str, size: int, ttl_seconds: int) -> str:
        ...

    def head_object_exists(self, key: str) -> bool:
        ...

    def generate_presigned_get(self, *, key: str, ttl_seconds: int) -> str:
        ...
