# chatgpt-github-review-pull-request

GitHub action that adds ChatGPT code review comments to pull requests. This service uses the GitHub REST API and the OpenAI API to generate suggestions for pull request changes.

### Getting Started

To use this github action, you will need to have a GitHub account and an OpenAI API key. Also you will need to configure a GitHub action workflow.

1. Visit https://platform.openai.com/account/api-keys to generate a new OpenAI API key.
2. Add new key with a name `OPENAI_API_KEY` as described [here](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). As a value set generated OpenAi Api key from the step 1
3. In a repository you want to run this action, create a file: `.github/workflows/chatgpt-code-reviewer.yml` with the next content:

   ```yml
   name: ChatGPT Review
   run-name: chatgpt-github-review-pull-request
   on:
    pull_request:
      types: [opened, reopened, synchronize]
   jobs:
     chatgpt-code-reviewer:
       runs-on: ubuntu-latest
       steps:
         - name: ChatGPT Review
           uses: gwynethpham/chatgpt-github-review-pull-request@main
           with:
            model: gpt-4-turbo
            max_tokens: 4096
            language: english
            prompt: I want you to act as a Senior developer. Below is a code patch, please help review for clarity, performance, security, and adherence to best practices. Please feel free to highlight issues and proposal improvements.
           env:
             GITHUB_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
             OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
   ```

   ### Parameters

   | Parameter  | Description  | Required | Default Value |
   | ---------- | ------------ | -------- | ------------- |
   | model      | OpenAI model | false    | gpt-4-turbo   |
   | max_tokens | OpenAI TPM   | false    | 4096          |
   | language   |    n/a       | false    | english       |
   | prompt     |    n/a       | false    | I want you to act as a Senior developer. Below is a code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome  |

   ### Environment Variables
   | Variable       | Description                                                               | Required | Default Value |
   | -------------- | ------------------------------------------------------------------------- | -------- | ------------- |
   | GITHUB_TOKEN   | provided to you automatically by GitHub, used to send out review comments | true     | ""            |
   | OPENAI_API_KEY | API key used to invoke OpenAI                                             | true     | ""            |