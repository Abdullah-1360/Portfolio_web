# Future Implementations & Roadmap

## 🤖 Feature 1: "Talk with Abdullah AI" Chatbot Widget

### Overview
An interactive floating chat widget in the bottom-right corner trained on Abdullah Shahid's resume, technical skills, projects, and architecture specs. Allows recruiters, engineering managers, and clients to interview an AI twin of Abdullah in real time.

### Key Architecture & Specs
- **UI Component**: `FloatingAIChat.tsx` floating drawer with minimize/expand controls, typing animation indicator, and syntax-highlighted code response blocks.
- **Suggested Quick Prompts**:
  - *"What is Abdullah's experience with LangGraph and Multi-Agent workflows?"*
  - *"Explain the HR AI Agent architecture and multi-provider LLM fallback system."*
  - *"What results did Abdullah achieve at HostBreak?"*
  - *"Is Abdullah open for full-time or contract roles?"*
- **Backend / Integration Options**:
  - **Option A (Client-side edge / RAG)**: Pre-embedded system context vector with light client-side streaming response generator.
  - **Option B (Serverless API)**: Next.js API route (`/api/chat`) proxying requests to an LLM provider (OpenAI / DeepSeek / Claude / Groq) with prompt injection protection and system prompt grounding.

---

## Roadmap Tracker
- [ ] Implement `FloatingAIChat.tsx` UI layout
- [ ] Connect system prompt with `portfolio.ts` single source of truth
- [ ] Add streaming response token rendering
- [ ] Add rate limiting and session memory
