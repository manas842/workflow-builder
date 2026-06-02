import { createBackendClient, type BackendClient } from '@pipedream/sdk';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function pipedreamEnv(): 'development' | 'production' {
  const v = (process.env.PIPEDREAM_ENVIRONMENT || 'development').toLowerCase();
  return v === 'production' ? 'production' : 'development';
}

class PipedreamHelper {
  private client: BackendClient | null = null;

  private getClient(): BackendClient {
    if (!this.client) {
      this.client = createBackendClient({
        environment: pipedreamEnv(),
        credentials: {
          clientId: required('PIPEDREAM_CLIENT_ID'),
          clientSecret: required('PIPEDREAM_CLIENT_SECRET'),
        },
        projectId:
          process.env.PIPEDREAM_PROJECT_ID ||
          required('PIPEDREAM_WORKSPACE_ID'),
      });
    }
    return this.client;
  }

  async createConnectToken(externalUserId: string) {
    return this.getClient().createConnectToken({ external_user_id: externalUserId });
  }

  async getAccessToken(): Promise<string> {
    return this.getClient().rawAccessToken();
  }

  async listComponents(app: string, type: 'trigger' | 'action') {
    return this.getClient().getComponents({ app, componentType: type });
  }

  async getComponent(componentKey: string) {
    return this.getClient().getComponent({ key: componentKey });
  }

  buildMcpServerUrl(externalUserId: string, app: string): string {
    const projectId =
      process.env.PIPEDREAM_PROJECT_ID || process.env.PIPEDREAM_WORKSPACE_ID || '';
    const params = new URLSearchParams({
      projectId,
      environment: pipedreamEnv(),
      externalUserId,
      app,
    });
    return `https://remote.mcp.pipedream.net/v3?${params.toString()}`;
  }
}

export const pipedreamHelper = new PipedreamHelper();
