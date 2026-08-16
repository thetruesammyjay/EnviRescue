"""Hugging Face container entrypoint for API or classification worker mode."""

import os


def main() -> None:
    if os.getenv("SERVICE", "api").lower() == "worker":
        from classification_worker import run

        run()
        return

    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "7860")))


if __name__ == "__main__":
    main()
