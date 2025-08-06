import { ProductForm } from "./_components/product-form";

export default function ProductFormPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your catalog</p>
      </div>
      <ProductForm />
    </div>
  );
}
