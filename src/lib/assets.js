export const files = import.meta.glob("../assets/home/*", { eager: true, query: "?url", import: "default" });
export const img = (n) => files[`../assets/home/${n}`];
