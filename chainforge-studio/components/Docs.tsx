import React from 'react';
import { Layers, Zap, Database, Terminal, Box } from 'lucide-react';

const Docs: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Documentation</h1>
        <p className="text-xl text-gray-400">
          Comprehensive guide to building production-ready LLM applications with ChainForge.
        </p>
      </div>

      {/* Concepts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
            <Layers size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Runnable Protocol</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            The core abstraction. Anything that implements <code>invoke</code> and <code>stream</code> is a Runnable. 
            Chain them together using the pipe <code>|</code> operator.
          </p>
        </div>

        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Agents</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Built-in ReAct agents that use a reasoning loop (Thought -> Action -> Observation) to solve complex tasks using tools.
          </p>
        </div>

        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4">
            <Box size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Tools</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Define tools easily using the <code>@tool</code> decorator. Pydantic integration ensures robust argument validation.
          </p>
        </div>

        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 mb-4">
            <Database size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">RAG</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            VectorStore abstractions and Retriever interfaces to easily build Retrieval Augmented Generation pipelines.
          </p>
        </div>
      </div>

      {/* Detailed Instructions */}
      <div className="space-y-12 border-t border-gray-800 pt-12">
        
        {/* 1. Installation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-emerald-500" /> 1. Installation
          </h2>
          <p className="text-gray-400">
            ChainForge is designed to be lightweight. You can install it via pip or simply drop the <code>chainforge.py</code> file into your project.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
             <code className="text-emerald-400 font-mono">pip install chainforge</code>
          </div>
        </section>

        {/* 2. Basic Chains */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-blue-500" /> 2. Building Chains
          </h2>
          <p className="text-gray-400">
            Compose prompts, models, and custom logic using the pipe <code>|</code> operator. This creates a <code>RunnableSequence</code>.
          </p>
          <CodeBlock title="basic_chain.py">
{`import asyncio
from chainforge import MockLLM, RunnableLambda

# 1. Define a Prompt template (using RunnableLambda for simplicity)
prompt = RunnableLambda(lambda topic: f"Tell me a fun fact about {topic}.")

# 2. Initialize Model (MockLLM for testing, OpenAILLM for production)
llm = MockLLM()

# 3. Create Chain (Prompt -> LLM)
chain = prompt | llm

# 4. Invoke
async def main():
    result = await chain.invoke("SpaceX")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())`}
          </CodeBlock>
        </section>

        {/* 3. Agents & Tools */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="text-yellow-500" /> 3. Agents & Tools
          </h2>
          <p className="text-gray-400">
            Agents use the "ReAct" pattern to reason about which tools to use. Use the <code>@tool</code> decorator to turn Python functions into tools.
          </p>
           <CodeBlock title="agent_with_tools.py">
{`from chainforge import AgentExecutor, MockLLM, tool
import asyncio

# 1. Define Tools
@tool("search", "Search the web for query")
def search_tool(query: str):
    return f"Results for {query}..."

@tool("calculator", "Calculate math expressions")
def calc_tool(expression: str):
    return eval(expression)

# 2. Setup Agent
llm = MockLLM()
tools = [search_tool, calc_tool]
agent = AgentExecutor(llm, tools)

# 3. Run
async def main():
    print("Thinking...")
    response = await agent.invoke("What is the square root of 144?")
    print(response)

if __name__ == "__main__":
    asyncio.run(main())`}
          </CodeBlock>
        </section>

         {/* 4. RAG */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="text-purple-500" /> 4. RAG Pipelines
          </h2>
          <p className="text-gray-400">
            Implement Retrieval Augmented Generation by combining a <code>VectorStore</code> with an LLM.
          </p>
           <CodeBlock title="rag_pipeline.py">
{`from chainforge import InMemoryVectorStore, Embeddings, MockLLM, RunnableLambda
import asyncio

# 1. Define Embeddings (Mock implementation)
class MockEmbeddings(Embeddings):
    async def embed_query(self, text: str):
        return [0.1] * 10  # Dummy vector

# 2. Setup Vector Store
embeddings = MockEmbeddings() 
store = InMemoryVectorStore(embeddings)

async def main():
    await store.add_texts([
        "ChainForge is a Python framework for LLMs.",
        "It supports async, typing, and is lightweight."
    ])

    # 3. Create Retriever
    retriever = RunnableLambda(lambda q: store.similarity_search(q))

    # 4. RAG Chain: Retriever -> Formatter -> LLM
    rag_chain = retriever | (lambda docs: "\\n".join(docs)) | MockLLM()

    result = await rag_chain.invoke("What features does ChainForge have?")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())`}
          </CodeBlock>
        </section>

      </div>
    </div>
  );
};

const CodeBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#0d1117]">
    <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-500 font-mono flex items-center justify-between">
      <span>{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/20" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
        <div className="w-2 h-2 rounded-full bg-green-500/20" />
      </div>
    </div>
    <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
      <code>{children}</code>
    </pre>
  </div>
);

export default Docs;