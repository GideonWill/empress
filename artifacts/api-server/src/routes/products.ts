import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch products." });
  }
});

// POST /api/products
router.post("/products", async (req, res) => {
  try {
    const [newProduct] = await db
      .insert(productsTable)
      .values(req.body)
      .returning();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create product." });
  }
});

// PATCH /api/products/:id
router.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedProduct] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, id))
      .returning();
    
    if (!updatedProduct) {
      res.status(404).json({ error: "Product not found." });
      return;
    }
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update product." });
  }
});

// DELETE /api/products/:id
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    
    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found." });
      return;
    }
    res.json({ message: "Product deleted successfully.", product: deletedProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete product." });
  }
});

export default router;
