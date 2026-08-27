from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Any


class Settings(BaseSettings):
    database_url: str
    openai_api_key: str

    app_name: str = "AI Real Estate Lead Qualification POC"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    @field_validator("openai_api_key", mode="before")
    @classmethod
    def clean_api_key(cls, v: Any) -> Any:
        if isinstance(v, str):
            return v.strip()
        return v


settings = Settings()