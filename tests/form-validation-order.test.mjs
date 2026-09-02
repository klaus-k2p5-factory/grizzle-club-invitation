import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('form validation prioritizes a missing email before the client-only registration acknowledgement', async () => {
  const script = await readFile(path.join(root, 'script.js'), 'utf8');
  const emailCheck = script.indexOf("const emailField = form.querySelector('input[type=\"email\"]');");
  const registrationCheck = script.indexOf('if (notRegistered && !notRegistered.checked)');
  assert.ok(emailCheck >= 0, 'the form needs an explicit email-first validation guard');
  assert.ok(registrationCheck >= 0, 'the client-only registration acknowledgement must remain required');
  assert.ok(emailCheck < registrationCheck, 'missing email must be handled before the registration acknowledgement');
});
