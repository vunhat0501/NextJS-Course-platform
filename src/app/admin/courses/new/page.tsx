import { PageHeader } from '@/components/PageHeader';
import { ProductForm } from '@/features/products/components/ProductForm';


export default function NewCoursePage() {
    return (
        <div className="container my-6">
            <PageHeader title="New Product" />
            <ProductForm />
        </div>
    );
}
