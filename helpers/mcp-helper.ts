/**
 * mcp-helper.ts
 * Analyzes the most recent Playwright failed test and sends a detailed diagnostic to OpenAI.
 * Includes the screenshot and trace.zip encoded in Base64 within the prompt.
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTestFailure(
  resultsPath = "reports/html/test-results.log"
) {
  try {
    if (!fs.existsSync(resultsPath)) {
      console.error(`❌ No se encontró el archivo: ${resultsPath}`);
      return;
    }

    // --- Read and sanitize JSON log content ---
    const raw = fs.readFileSync(resultsPath, "utf-8").trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("⚠️ No valid JSON structure detected in log file.");
      return;
    }

    const cleanJson = raw.slice(jsonStart, jsonEnd + 1);
    const report = JSON.parse(cleanJson);

    // --- Find the failed test ---
    const failedTest = findFailedTest(report);
    if (!failedTest) {
      console.log("✅ No failed tests found.");
      return;
    }

    // --- Attach related files if available ---
    const screenshotPath = findScreenshot();
    const tracePath = findTrace();

    const screenshotBase64 = screenshotPath
      ? truncateBase64(encodeFileBase64(screenshotPath), 20000)
      : "(no screenshot found)";
    const traceBase64 = tracePath
      ? truncateBase64(encodeFileBase64(tracePath), 20000)
      : "(no trace found)";

    // --- Build the AI analysis prompt ---
    const prompt = buildPrompt(failedTest, screenshotBase64, traceBase64);

    // --- Save prompt locally for debugging ---
    const outputDir = "reports/html";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, "last-prompt.txt");
    fs.writeFileSync(outputFile, prompt, "utf-8");

    console.log(`🧠 Prompt generated at: ${outputFile}`);
    console.log("🚀 Sending prompt to OpenAI...\n");

    // --- Send the prompt to OpenAI ---
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a QA Automation expert specialized in Playwright and TypeScript. Analyze the following test failure and suggest clear, actionable solutions.",
        },
        { role: "user", content: prompt },
      ],
    });

    const suggestion =
      completion.choices[0].message?.content || "(no response)";
    console.log("🤖 OpenAI Analysis:\n");
    console.log(suggestion);

    const analysisFile = path.join(outputDir, "last-analysis.txt");
    fs.writeFileSync(analysisFile, suggestion, "utf-8");
    console.log(`\n📁 Analysis saved at: ${analysisFile}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error in analyzeTestFailure:", err.message);
    } else {
      console.error("❌ Error in analyzeTestFailure:", String(err));
    }
  }
}

/**
 * Finds the first failed test inside the Playwright JSON report.
 */
function findFailedTest(report: any): any | null {
  if (report.suites) {
    for (const suite of report.suites) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            if (result.status === "failed") {
              return {
                title: spec.title,
                location: spec.location,
                error: result.error,
                stderr: result.stderr,
              };
            }
          }
        }
      }
    }
  }

  const containers = [report.entries, report.tests].filter(Boolean);
  for (const container of containers) {
    for (const t of container) {
      if (t.status === "failed" || t.errors?.length) {
        return {
          title: t.title?.join?.(" ") || t.title || "Unnamed test",
          location: t.location,
          error: t.errors?.[0] || t.error,
          stderr: t.stderr,
        };
      }
    }
  }

  return null;
}


/**
 * Builds the OpenAI prompt for the analysis, including screenshot and trace data.
 */
function buildPrompt(test: any, screenshot: string, trace: string): string {
  return `
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: >> ${test.title}
- Location: ${test.location?.file || "?"}:${test.location?.line || "?"}

# Stderr
\`\`\`
${Array.isArray(test.stderr) ? test.stderr.join("\n") : "(empty)"}
\`\`\`

# Error details
\`\`\`
${test.error?.message || "(no message)"}
\`\`\`

# Stacktrace
\`\`\`
${test.error?.stack || "(no stacktrace available)"}
\`\`\`

# Screenshot (Base64)
\`\`\`
${screenshot}
\`\`\`

# Trace file (Base64)
\`\`\`
${trace}
\`\`\`
  `.trim();
}

/**
 * Finds a failed test screenshot under the test-results directory.
 */
function findScreenshot(): string | null {
  const dir = "test-results";
  if (!fs.existsSync(dir)) return null;

  const entries = fs.readdirSync(dir, { recursive: true });
  const files = entries
    .map((f) => (typeof f === "string" ? f : f.toString()))
    .filter((f) => f.endsWith(".png") && f.includes("test-failed"));

  return files.length ? path.join(dir, files[0]) : null;
}

/**
 * Finds the most recent trace.zip file.
 */
function findTrace(): string | null {
  const dir = "test-results";
  if (!fs.existsSync(dir)) return null;

  const entries = fs.readdirSync(dir, { recursive: true });
  const files = entries
    .map((f) => (typeof f === "string" ? f : f.toString()))
    .filter((f) => f.endsWith("trace.zip"));

  return files.length ? path.join(dir, files[0]) : null;
}

/**
 * Encodes a given file in Base64 format.
 */
function encodeFileBase64(filePath: string): string {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString("base64");
  } catch {
    return "(error reading file)";
  }
}



if (require.main === module) {
  analyzeTestFailure();
}

/**
 * Truncates large Base64 data to prevent exceeding prompt length limits.
 */
function truncateBase64(data: string, maxLength: number): string {
  if (data.length > maxLength) {
    return (
      data.slice(0, maxLength) +
      `... [truncated ${data.length - maxLength} chars]`
    );
  }
  return data;
}
