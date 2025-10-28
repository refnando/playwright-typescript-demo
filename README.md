# 🎭 Playwright TypeScript Demo

An **end-to-end automation framework** built with [Playwright](https://playwright.dev/) and [TypeScript](https://www.typescriptlang.org/), featuring clean Page Object Models (POM), environment configuration with `.env`, and an integrated **MCP (Model-Context Processor)** helper for AI-based test failure analysis.

---
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green)
![Automation](https://img.shields.io/badge/Framework-QA-orange)
![Build](https://img.shields.io/badge/Build-Yarn-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🧱 Project Structure

```
└── 📁playwright-typescript-demo
    └── 📁helpers
        ├── mcp-helper.ts
    └── 📁pages
        └── 📁HomePage
            ├── HomePage.ts
        └── 📁LoginPage
            ├── LoginPage.ts
    └── 📁playwright-report
        ├── index.html
    └── 📁reports
        └── 📁html
            └── 📁data
                ├── 4314910c9e8c4a2bc45cf975e2c17696830120e8.md
                ├── 538e78a7c411eabc35c17e203c5bb61a3aaaac15.png
            ├── index.html
            ├── last-analysis.txt
            ├── last-prompt.txt
            ├── test-results.log
    └── 📁test-results
        └── 📁home.test-Add-product-into-Shopping-cart-firefox
            ├── error-context.md
            ├── test-failed-1.png
        ├── .last-run.json
    └── 📁tests
        ├── home.test.spec.ts
    └── 📁utils
        └── 📁constants
            ├── values.ts
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── playwright.config.ts
    └── yarn.lock
```

### 🗂️ Folder Overview

| Folder | Description |
|---------|-------------|
| **helpers/** | Contains custom scripts like `mcp-helper.ts` for AI-assisted log analysis. |
| **pages/** | Page Object Models (POM) for different modules like `LoginPage` and `HomePage`. |
| **reports/** | Automatically generated HTML and Markdown reports. |
| **test-results/** | Raw Playwright test output, including screenshots and JSON logs. |
| **tests/** | Test specifications (`.spec.ts`) following Playwright’s test runner syntax. |
| **utils/** | Constants and reusable utility files for test data and configuration. |

---

## ⚙️ Environment Variables

The framework uses a `.env` file for environment configuration.  
You can copy the example template:

```bash
cp .env.example .env
```

### Example `.env`
```
export BASE_URL=https://www.saucedemo.com/v1/
export USER_NAME=standard_user
export PASSWORD=secret_sauce
OPENAI_API_KEY=(YOUR_OPEN_AI_API_KEY)
OPENAI_MODEL=gpt-4o-mini (gpt-5)
```

### Variable Usage

| Variable | Purpose |
|-----------|----------|
| `BASE_URL` | URL of the application under test |
| `USER_NAME` | Default test user for login |
| `PASSWORD` | Password for the test user |
| `OPENAI_API_KEY` | Open AI api key |
| `OPENAI_MODEL` | Target model |

These values are automatically injected into the Playwright config and page classes.

---

## 🚀 Installation

Install all dependencies using Yarn:

```bash
yarn install
```

If you prefer npm:

```bash
npm install
```

---

## 🧪 Running Tests

To execute all tests:

```bash
yarn test
```

Or specify a browser:

```bash
npx playwright test --project=firefox
```

After execution, Playwright will generate:

- A detailed HTML report → `reports/html/index.html`
- Test logs and screenshots → `reports/`

Open the HTML report in your browser:

```bash
npx playwright show-report
```

---

## 🧠 MCP Analysis (AI Log Processing)

The **MCP helper** reads Playwright logs and generates insights using AI analysis prompts.

### Run MCP manually

```bash
yarn mcp:analyze
```

This command executes:
```bash
ts-node --compiler-options '{"module":"CommonJS"}' helpers/mcp-helper.ts
```

The analysis output will be available at:
```
reports/html/last-analysis.txt
reports/html/last-prompt.txt
```

and includes details such as:
- Root cause of failed tests  
- Suggestions for selector stability or timing issues  
- Context extracted from Playwright logs  

---

## 📊 Reports

| Type | Location | Description |
|------|-----------|-------------|
| **AI Analysis Report** | `reports/html/last-analysis.txt` | Text summary of last MCP analysis |
| **Prompt Log** | `reports/html/last-prompt.txt` | Exact prompt sent for AI processing |
| **Playwright HTML Report / Screenshots / Error Context** | `reports/html/` | Visual evidence of failed tests |

---

## 🧰 Technologies Used

| Tool / Library | Purpose |
|----------------|----------|
| **Playwright** | E2E browser automation |
| **TypeScript** | Strongly typed scripting |
| **ts-node** | Run TypeScript files directly |
| **dotenv** | Environment variable management |
| **Yarn** | Dependency management |
| **MCP Helper** | AI-driven test log analyzer |

---

## 👨‍💻 Author

**Fernando Campos**  
QA Automation Engineer / SDET  
🇲🇽 Guadalajara, Mexico  
📧 *[hfer.cc@gmail.com]*  
🌐 *[GitHub: refnando](https://github.com/refnando)*

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute for educational or professional purposes.

---

> 💡 *Tip:* For better AI analysis integration, ensure your Playwright logs are always up-to-date and accessible under `reports/html/test-results.log`.
