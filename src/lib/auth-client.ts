/**
 * Proxy over the auth backend.
 * Backend dev owns auth.ts / better-auth server config.
 * Until /api/auth/* routes exist, this falls back to a mock success
 * so sign-in/sign-up pages are demo able end-to-end.
 * When routes are live: only this file changes, nothing in components/forms.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  return callAuthEndpoint("/api/auth/sign-in", { email, password });
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  return callAuthEndpoint("/api/auth/sign-up", { name, email, password });
}

async function callAuthEndpoint(
  path: string,
  body: Record<string, string>,
): Promise<AuthResult> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // TODO: implement real return
    return mockSuccess(body);
  }
  if (response.status === 404) {
    console.warn(
      `[auth-client] ${path} not implemented yet - using mock success`,
    );
    return mockSuccess(body);
  }
  if (!response.ok) {
    const data = await response.json().catch(returnEmptyObject);
    return { success: false, error: data.error || "Authentication failed" };
  }
  const data = await response.json();
  return { success: true, user: data.user };
}

function returnEmptyObject() {
  return {};
}
function mockSuccess(body: Record<string, string>): AuthResult {
  return {
    success: true,
    user: {
      id: "mock-user-id",
      name: body.name || "Demo user",
      email: body.email,
    },
  };
}
