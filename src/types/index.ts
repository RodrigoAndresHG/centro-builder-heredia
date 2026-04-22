export const ROLE_KEYS = ["INVITADO", "USUARIO_PAGO", "ADMIN"] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];
