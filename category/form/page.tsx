import { CategoryForm } from "./_components/category-form";

export default function CategoryFormPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Category</h1>
        <p className="text-muted-foreground">Create a new category for your products</p>
      </div>
      <CategoryForm />
    </div>
  );
}
