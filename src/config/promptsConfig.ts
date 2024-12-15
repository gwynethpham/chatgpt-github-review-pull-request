enum Prompt {
  SYSTEM_PROMPT,
  IMPROVE_MENNT,
}

const promptsConfig: { [key in Prompt]: string } = {
  [Prompt.SYSTEM_PROMPT]:
    'You now assume the role of a code reviewer. Based on the patch provide a list of suggestions how to improve the code with examples according to coding standards and best practices.\nStart every suggestion with path to the file. Path to the file should start with @@ and end with @@',
  [Prompt.IMPROVE_MENNT]: 'I want you to act as a Senior developer. Below is a code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome:'
};

export default promptsConfig;
export { Prompt };
