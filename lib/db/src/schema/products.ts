import { pgTable, text, boolean, integer, real } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  image: text("image").notNull(),
  images: text("images").array().notNull(),
  category: text("category").notNull(),
  onSale: boolean("on_sale").default(false).notNull(),
  colors: text("colors").array().notNull(),
  sizes: text("sizes").array().notNull(),
  description: text("description").notNull(),
  details: text("details").array().notNull(),
  rating: real("rating").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  stock: integer("stock").default(10).notNull(),
});

export type InsertProduct = typeof productsTable.$inferInsert;
export type Product = typeof productsTable.$inferSelect;
