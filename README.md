# ChainForge Studio

> **ChainForge Studio** is the official interactive hub for **ChainForge**—a lightweight, type-safe, and async-native Python framework for building LLM applications.

## 📋 Description (The 7Cs)

*   **Clear:** ChainForge Studio bridges the gap between complex Python code and developer understanding by providing a visual interface for documentation and experimentation.
*   **Concise:** A streamlined Single Page Application (SPA) focused strictly on the core needs of the developer: learning, testing, and downloading.
*   **Concrete:** Features a real-time "Agent Simulator" that mimics the framework's terminal output, allowing users to verify logic before installing the library.
*   **Correct:** Built on React 19 and Tailwind CSS, utilizing the Google Gemini API to accurately simulate the reasoning loops of ReAct agents.
*   **Coherent:** Seamlessly navigates between Source Code, Live Playground, and Documentation views with a unified dark-mode aesthetic.
*   **Complete:** Includes the full source code of the framework (`chainforge.py`), installation guides, and RAG pipeline examples.
*   **Courteous:** Designed with developer experience in mind, offering one-click downloads and copy-paste functionality for all examples.

## ✨ Key Features

1.  **🐍 Source Code Explorer**
    *   Inspect the complete, single-file implementation of the ChainForge Python framework.
    *   Syntax highlighting for Python.
    *   One-click download of `chainforge.py`.

2.  **⚡ Live Agent Simulator (Playground)**
    *   Interact with a simulated ChainForge Agent.
    *   Powered by **Google Gemini 2.5 Flash**.
    *   Visualizes the "Thought -> Action -> Observation" loop of ReAct agents in a terminal-like interface.

3.  **📚 Interactive Documentation**
    *   Step-by-step guides for Installation, Basic Chains, Custom Tools, and RAG.
    *   Copy-paste ready code snippets.

## 🛠️ Tech Stack

*   **Frontend Library:** React 19
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI Engine:** Google GenAI SDK (`@google/genai`)
*   **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
*   Node.js (for local development)
*   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/chainforge-studio.git
    ```

2.  **Environment Setup**
    Ensure your `process.env.API_KEY` is available for the Google GenAI SDK.

3.  **Run the App**
    This project is designed to run in a modern web environment (Vite/ESM).

    ```bash
    npm install
    npm run dev
    ```

## 📦 About The ChainForge Framework

The Studio promotes **ChainForge**, a Python framework designed for production:

*   **Runnable Protocol:** LCEL-style piping (`chain = prompt | llm`).
*   **Async Native:** Built on `asyncio`.
*   **Type Safe:** Uses Pydantic for validation.
*   **Minimalist:** Zero-fluff, single-file architecture.

## 📄 License

This project is open-source and available under the MIT License.
