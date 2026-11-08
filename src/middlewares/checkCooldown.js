const cooldowns = new Map();

export function checkCooldown(userId, command, duration = 3000) {
  const key = `${userId}:${command}`;
  const now = Date.now();
  const expiresAt = cooldowns.get(key);

  if (expiresAt && now < expiresAt) {
    return expiresAt - now;
  }

  cooldowns.set(key, now + duration);

  return 0;
}

export function cleanCooldowns() {
  const now = Date.now();

  for (const [key, expiresAt] of cooldowns) {
    if (expiresAt <= now) {
      cooldowns.delete(key);
    }
  }
}