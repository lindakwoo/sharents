from fastapi import FastAPI, File, UploadFile
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from langtool import LanguageTool

app = FastAPI()

# Initialize LLM model for error correction
model_name = "textattack/bert-base-uncased-faiss-indexed"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Initialize Language Tool for spell-checking and grammar-checking
lt = LanguageTool("en-US")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/scan/")
async def scan_files(file: UploadFile):
    # Scan the uploaded file for errors
    contents = await file.read()
    code_scanner = CodeScanner(contents)
    results = code_scanner.scan()

    # Use LLM to correct errors in the scanned code
    corrected_code = llm_correction(results)

    return {"Corrected Code": corrected_code}


class CodeScanner:
    def __init__(self, contents):
        self.contents = contents

    def scan(self):
        # Simple example of a code scanner (just returns the contents)
        return self.contents


def llm_correction(contents):
    # Use LLM to correct errors in the scanned code
    input_ids = tokenizer.encode(contents, return_tensors="pt")
    outputs = model(input_ids)
    _, predicted = torch.max(outputs.logits, dim=1)

    # For simplicity, just return the original contents with a "Corrected" label
    return f"**Corrected Code:**\n{contents}"


class Agent:
    def __init__(self):
        self.app = app

    def interact(self):
        # Interact with the API to perform actions on files
        while True:
            command = input("Enter a command (scan, exit): ")
            if command == "scan":
                file_name = input("Enter the name of the file to scan: ")
                with open(file_name, "r") as f:
                    contents = f.read()
                results = self.app.scan_files(File(content=contents))
                print(results)
            elif command == "exit":
                break
            else:
                print("Invalid command")


if __name__ == "__main__":
    agent = Agent()
    agent.interact()
