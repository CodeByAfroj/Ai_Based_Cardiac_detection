from pydantic import BaseModel


class ECGSignal(BaseModel):
    signal: list[float]
