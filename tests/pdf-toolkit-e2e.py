"""Regression entrypoint for the consolidated tools document."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("unified-documents-e2e.py")),run_name="__main__")
