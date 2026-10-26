import { z } from "zod";
import { apiError } from "../utils/apiError";

// Шлюз omniroute OpenAI-совместимый: POST {baseUrl}/chat/completions.
// Вызывается только отсюда, ключ и адрес не уходят в клиент.
const DEFAULT_BASE_URL = "http://localhost:20128/v1";
const REQUEST_TIMEOUT_MS = 90_000;
const TEMPERATURE = 0.2;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Ответ шлюза тоже проходит через zod: доверять его форме нельзя
const chatResponseSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string().nullable() }) }))
    .min(1),
});

const readConfig = () => {
  const apiKey = process.env.OMNIROUTE_API_KEY;
  const model = process.env.OMNIROUTE_MODEL;

  if (!apiKey || !model) {
    console.error("OMNIROUTE_API_KEY или OMNIROUTE_MODEL не заданы в .env");
    throw apiError.serverError(
      "ИИ не настроен на сервере: задайте OMNIROUTE_API_KEY и OMNIROUTE_MODEL в server/.env",
    );
  }

  const baseUrl = (process.env.OMNIROUTE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

  return { apiKey, model, baseUrl };
};

const chat = async (messages: ChatMessage[]): Promise<string> => {
  const { apiKey, model, baseUrl } = readConfig();

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, temperature: TEMPERATURE, messages }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw apiError.gatewayTimeout("ИИ слишком долго отвечает. Попробуйте ещё раз.");
    }
    console.error("omniroute недоступен:", err);
    throw apiError.badGateway("Не удалось связаться с ИИ. Проверьте, что omniroute запущен.");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`omniroute вернул ${response.status}:`, body.slice(0, 500));

    if (response.status === 401 || response.status === 403) {
      throw apiError.badGateway("ИИ отклонил запрос: проверьте OMNIROUTE_API_KEY.");
    }
    if (response.status === 429) {
      throw apiError.tooManyRequests("Слишком много запросов к ИИ. Подождите и повторите.");
    }
    throw apiError.badGateway(`Сбой на стороне ИИ (код ${response.status}). Попробуйте позже.`);
  }

  const parsed = chatResponseSchema.safeParse(await response.json().catch(() => null));
  const content = parsed.success ? parsed.data.choices[0]?.message.content : null;

  if (!content?.trim()) {
    throw apiError.badGateway("ИИ вернул пустой ответ. Попробуйте ещё раз.");
  }

  return content;
};

// Модели любят оборачивать JSON в ```json или добавлять текст вокруг
const extractJson = (content: string): unknown => {
  const text = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end <= start) return undefined;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return undefined;
  }
};

// Просит у модели JSON и проверяет его схемой. При неверном формате один повтор
// с подсказкой, что именно не так; после второй неудачи ошибка, ничего не сохраняем.
export const askJson = async <S extends z.ZodType>(
  schema: S,
  messages: ChatMessage[],
): Promise<z.output<S>> => {
  let conversation = messages;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const content = await chat(conversation);
    const parsed = schema.safeParse(extractJson(content));

    if (parsed.success) return parsed.data;

    console.error(`Невалидный ответ модели (попытка ${attempt}):`, content.slice(0, 500));

    conversation = [
      ...messages,
      { role: "assistant", content },
      {
        role: "user",
        content:
          "Ответ не прошёл проверку формата. Верни только JSON без markdown строго в заданном формате.",
      },
    ];
  }

  throw apiError.badGateway("ИИ вернул ответ в неверном формате. Попробуйте ещё раз.");
};
