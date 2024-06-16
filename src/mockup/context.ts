import { WebhookPayload } from '@actions/github/lib/interfaces';

export class Context {
  payload: WebhookPayload;
  eventName: string;
  sha: string;
  ref: string;
  workflow: string;
  action: string;
  actor: string;
  job: string;
  runNumber: number;
  runId: number;
  apiUrl: string;
  serverUrl: string;
  graphqlUrl: string;

  constructor() {
    // Hydrate from environment variables or use mock values for testing
    this.payload = {
      pull_request: {
        head: {
          ref: 'feat/socket_chat_feature',
        },
        base: {
          ref: 'develop',
        },
        number: 144,
      },
    } as WebhookPayload; // Mock WebhookPayload specific to your needs

    this.eventName = 'pull_request';
    this.sha = process.env.GITHUB_SHA || 'mock-sha';
    this.ref = process.env.GITHUB_REF || 'feat/socket_chat_feature';
    this.workflow = process.env.GITHUB_WORKFLOW || 'Mock Workflow';
    this.action = process.env.GITHUB_ACTION || 'Mock Action';
    this.actor = process.env.GITHUB_ACTOR || 'mock-actor';
    this.job = process.env.GITHUB_JOB || 'mock-job';
    this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '144', 10);
    this.runId = parseInt(process.env.GITHUB_RUN_ID || '1', 10);
    this.apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
    this.serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
    this.graphqlUrl =
      process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql';
  }

  get issue() {
    return {
      owner: this.payload.repository?.owner?.login || 'gwynethpham',
      repo: this.payload.repository?.name || 'hrcrm-api-nestjs',
      number: this.payload.pull_request?.number || 0,
    };
  }

  get repo() {
    return {
      owner: this.payload.repository?.owner?.login || 'gwynethpham',
      repo: this.payload.repository?.name || 'hrcrm-api-nestjs',
    };
  }
}
