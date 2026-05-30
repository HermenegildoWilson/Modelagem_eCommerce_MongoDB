#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
