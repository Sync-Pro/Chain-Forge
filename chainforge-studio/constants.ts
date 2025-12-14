export const CHAINFORGE_LOGO = `
   ______           _       ______                   
  / ____/___  ____ ( )___  / ____/___  _________ ____
 / /   / __ \\/ __ \\|// _ \\/ /_  / __ \\/ ___/ __ \`/ _ \\
/ /___/ / / / /_/ / /  __/ __/ / /_/ / /  / /_/ /  __/
\\____/_/ /_/\\____/  \\___/_/    \\____/_/   \\__, /\\___/ 
                                         /____/       
`;

export const CHAINFORGE_SOURCE_CODE = `import asyncio
import inspect
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, AsyncIterator, Type, Callable
from pydantic import BaseModel, Field, create_model

# ==========================================
# 1. Core Abstractions & Runnables
# ==========================================

class Runnable(ABC):
    """Base class for all chainable components."""

    @abstractmethod
    async def invoke(self, input: Any, config: Optional[Dict] = None) -> Any:
        pass

    async def stream(self, input: Any, config: Optional[Dict] = None) -> AsyncIterator[Any]:
        """Default stream implementation invokes and yields result."""
        yield await self.invoke(input, config)

    def __or__(self, other: Union["Runnable", Callable]) -> "RunnableSequence":
        """LCEL-style piping support: chain = a | b"""
        return RunnableSequence(self, other)

class RunnableSequence(Runnable):
    """Composes two runnables sequentially."""
    
    def __init__(self, first: Runnable, second: Union[Runnable, Callable]):
        self.first = first
        self.second = second if isinstance(second, Runnable) else RunnableLambda(second)

    async def invoke(self, input: Any, config: Optional[Dict] = None) -> Any:
        first_out = await self.first.invoke(input, config)
        return await self.second.invoke(first_out, config)

    async def stream(self, input: Any, config: Optional[Dict] = None) -> AsyncIterator[Any]:
        async for chunk in self.first.stream(input, config):
            # Simple chaining for stream: collect first, stream second
            # Real impl would be more streaming-friendly
            pass
        # Fallback to invoke for simplicity in this artifact
        result = await self.invoke(input, config)
        yield result

class RunnableLambda(Runnable):
    """Wraps a python function as a Runnable."""
    def __init__(self, func: Callable):
        self.func = func

    async def invoke(self, input: Any, config: Optional[Dict] = None) -> Any:
        if inspect.iscoroutinefunction(self.func):
            return await self.func(input)
        return self.func(input)

# ==========================================
# 2. LLM Interface
# ==========================================

class BaseLLM(Runnable):
    """Abstract base class for Language Models."""
    
    @abstractmethod
    async def agenerate(self, prompt: str) -> str:
        pass

    async def invoke(self, input: str, config: Optional[Dict] = None) -> str:
        return await self.agenerate(input)

class MockLLM(BaseLLM):
    """Mock LLM for testing without API keys."""
    
    async def agenerate(self, prompt: str) -> str:
        return f"Mock response to: {prompt}"

class OpenAILLM(BaseLLM):
    """Simple wrapper for OpenAI (requires openai package)."""
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        self.api_key = api_key
        self.model = model
        # from openai import AsyncOpenAI
        # self.client = AsyncOpenAI(api_key=api_key)

    async def agenerate(self, prompt: str) -> str:
        # Stub implementation
        return f"[OpenAI {self.model}] Response to: {prompt}"

# ==========================================
# 3. Tools
# ==========================================

class BaseTool(Runnable, BaseModel):
    name: str
    description: str
    args_schema: Type[BaseModel]

    @abstractmethod
    async def _run(self, **kwargs) -> Any:
        pass

    async def invoke(self, input: Union[str, Dict], config: Optional[Dict] = None) -> Any:
        if isinstance(input, str):
            # Simplistic parsing or single arg assumption
            return await self._run(query=input)
        return await self._run(**input)

def tool(name: str, desc: str):
    """Decorator to create tools from functions."""
    def decorator(func):
        # Infer schema from type hints (simplified)
        class DynamicTool(BaseTool):
            async def _run(self, **kwargs):
                if inspect.iscoroutinefunction(func):
                    return await func(**kwargs)
                return func(**kwargs)
        
        DynamicTool.__name__ = name
        return DynamicTool(name=name, description=desc, args_schema=BaseModel)
    return decorator

# ==========================================
# 4. Memory
# ==========================================

class BaseMemory(ABC):
    @abstractmethod
    def load_memory_variables(self) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def save_context(self, inputs: Dict, outputs: Dict):
        pass

class ConversationBufferMemory(BaseMemory):
    def __init__(self):
        self.chat_history = []

    def load_memory_variables(self) -> Dict[str, Any]:
        return {"history": "\\n".join(self.chat_history)}

    def save_context(self, inputs: Dict, outputs: Dict):
        input_str = next(iter(inputs.values()))
        output_str = next(iter(outputs.values()))
        self.chat_history.append(f"Human: {input_str}")
        self.chat_history.append(f"AI: {output_str}")

# ==========================================
# 5. Retrieval / RAG
# ==========================================

class Embeddings(ABC):
    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        pass

class VectorStore(ABC):
    @abstractmethod
    async def add_texts(self, texts: List[str]):
        pass
    
    @abstractmethod
    async def similarity_search(self, query: str, k: int = 4) -> List[str]:
        pass

class InMemoryVectorStore(VectorStore):
    def __init__(self, embedding_fn: Embeddings):
        self.embedding_fn = embedding_fn
        self.store = []  # List of (text, vector)

    async def add_texts(self, texts: List[str]):
        for text in texts:
            vec = await self.embedding_fn.embed_query(text)
            self.store.append((text, vec))

    async def similarity_search(self, query: str, k: int = 4) -> List[str]:
        # Mock cosine similarity stub
        return [doc[0] for doc in self.store[:k]]

# ==========================================
# 6. Agents (ReAct)
# ==========================================

class AgentExecutor(Runnable):
    def __init__(self, llm: BaseLLM, tools: List[BaseTool], memory: Optional[BaseMemory] = None):
        self.llm = llm
        self.tools = {t.name: t for t in tools}
        self.memory = memory or ConversationBufferMemory()
    
    async def invoke(self, input: str, config: Optional[Dict] = None) -> str:
        # Simplified ReAct Loop
        history = self.memory.load_memory_variables()["history"]
        prompt = (
            f"System: You are a helpful assistant. Tools: {list(self.tools.keys())}\\n"
            f"History:\\n{history}\\n"
            f"Human: {input}\\n"
            f"Thought:"
        )
        
        for _ in range(5): # Max steps
            response = await self.llm.invoke(prompt)
            prompt += response
            
            if "Final Answer:" in response:
                final = response.split("Final Answer:")[-1].strip()
                self.memory.save_context({"input": input}, {"output": final})
                return final
            
            if "Action:" in response:
                # Parse action (Mock parsing)
                action = "Calculator" # stub
                action_input = "2 + 2" # stub
                
                tool = self.tools.get(action)
                if tool:
                    observation = await tool.invoke(action_input)
                    prompt += f"\\nObservation: {observation}\\nThought:"
                else:
                    prompt += f"\\nObservation: Tool not found.\\nThought:"
        
        return "Agent stopped due to max iterations."

# ==========================================
# EXAMPLES
# ==========================================

async def main():
    # 1. Basic Chain
    prompt = RunnableLambda(lambda x: f"Tell me a joke about {x}")
    llm = MockLLM()
    chain = prompt | llm
    print("--- Basic Chain ---")
    print(await chain.invoke("Python"))

    # 2. RAG Pipeline
    embeddings = type("MockEmbeddings", (Embeddings,), {"embed_query": lambda s, t: [0.1]*10})()
    vectorstore = InMemoryVectorStore(embeddings)
    await vectorstore.add_texts(["Python is great.", "ChainForge is new."])
    
    retriever = RunnableLambda(lambda q: vectorstore.similarity_search(q))
    rag_chain = retriever | (lambda docs: "\\n".join(docs)) | llm
    print("\\n--- RAG Chain ---")
    print(await rag_chain.invoke("What is ChainForge?"))

    # 3. Agent
    @tool("Calculator", "Math tool")
    def calculator(query: str):
        return eval(query)

    agent = AgentExecutor(llm, [calculator])
    print("\\n--- Agent ---")
    print(await agent.invoke("What is 2 + 2?"))

if __name__ == "__main__":
    asyncio.run(main())
`;

export const GEMINI_SYSTEM_PROMPT = `
You are the simulation engine for "ChainForge", a Python framework for LLMs.
The user is interacting with a "Live Playground" of this framework.
Your goal is to simulate the verbose console output of a ChainForge Agent.

The format should look like a terminal log.
Include:
- [CHAINFORGE] System logs
- > Entering new AgentExecutor chain...
- Thought: ...
- Action: ...
- Observation: ...
- Final Answer: ...

Be creative but technical. If the user asks for code, generate Python code using the ChainForge class names (Runnable, AgentExecutor, BaseTool).
`;
