"""Conversão segura de query params HTTP para tipos Python."""


def get_int(params, name: str, default: int, minimum: int | None = None, maximum: int | None = None) -> int:
    try:
        value = int(params.get(name, default))
    except (TypeError, ValueError):
        value = default

    if minimum is not None:
        value = max(value, minimum)
    if maximum is not None:
        value = min(value, maximum)
    return value


def get_float(params, name: str, default: float | None = None) -> float | None:
    raw_value = params.get(name)
    if raw_value in (None, ""):
        return default

    try:
        return float(raw_value)
    except (TypeError, ValueError):
        return default


def get_bool(params, name: str, default: bool | None = None) -> bool | None:
    raw_value = params.get(name)
    if raw_value in (None, ""):
        return default

    return str(raw_value).lower() in {"1", "true", "t", "yes", "y", "sim", "s"}


def get_csv(params, name: str, default: list[str]) -> list[str]:
    raw_value = params.get(name)
    if not raw_value:
        return default
    return [item.strip() for item in raw_value.split(",") if item.strip()]

