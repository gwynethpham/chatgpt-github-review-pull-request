import { getInput } from '@actions/core';
import fetch from 'node-fetch';
import errorsConfig, { ErrorMessage } from '../../config/errorsConfig';
import promptsConfig, { Prompt } from '../../config/promptsConfig';

const OPENAI_MODEL = getInput('model') || 'gpt-3.5-turbo';
const PROMPT = getInput('prompt') || promptsConfig[Prompt.IMPROVE_MENNT];
const LANGUAGE = getInput('language') || 'english';

const promptGenerateByLanguage = (patch: string) => {
  return `${PROMPT}, let's reply to me in ${LANGUAGE}: ${patch}`;
}

const getOpenAiSuggestions = async (patch: string): Promise<any> => {
  if (!patch) {
    throw new Error(
      errorsConfig[ErrorMessage.MISSING_PATCH_FOR_OPENAI_SUGGESTION],
    );
  }
  console.log("🚀 ~ getOpenAiSuggestions ~ promptGenerateByLanguage(patch):", promptGenerateByLanguage(patch))

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer  ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: promptsConfig[Prompt.SYSTEM_PROMPT] },
          { role: 'user', content: promptGenerateByLanguage(patch) },
        ],
      }),
    });

    if (!response.ok) throw new Error('Failed to post data.');

    const responseJson = (await response.json()) as any;

    const openAiSuggestion =
      responseJson.choices.shift()?.message?.content || '';

    console.log("========> 🚀 ~ openAiSuggestion:", openAiSuggestion)
    return openAiSuggestion;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export default getOpenAiSuggestions;
