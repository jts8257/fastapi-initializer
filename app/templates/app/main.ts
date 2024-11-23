// app/templates/app/main.ts

const MAIN_PY_TEMPLATE = `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}`;

export default MAIN_PY_TEMPLATE;
