// src/utils/logger.ts
/* энгийн logger – console-г нэг газар төвлөрүүлэв */
type Lvl = "info"|"warn"|"error"|"debug";
const tag = (lvl: Lvl) => `[${new Date().toISOString()}] ${lvl.toUpperCase()}:`;

export const logger = {
  info:  (...args: any[]) => console.log(tag("info"),  ...args),
  warn:  (...args: any[]) => console.warn(tag("warn"),  ...args),
  error: (...args: any[]) => console.error(tag("error"), ...args),
  debug: (...args: any[]) => process.env.DEBUG ? console.log(tag("debug"), ...args) : null,
};
