import { database } from '@/drizzle/db';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductTable } from '@/features/products/components/ProductTable';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
// Mock data

const mockTeachers = [
    {
        id: 1,
        name: 'Vũ Long Nhật',
        role: 'Phát triển Web',
        avatar: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg',
    },
    {
        id: 2,
        name: 'Vũ Thái Quý Long',
        role: 'Thiết kế đồ họa',
        avatar: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg',
    },
    {
        id: 3,
        name: 'Tạ Đăng Quân',
        role: 'Khoa học Dữ liệu',
        avatar: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg',
    },
    {
        id: 4,
        name: 'Nguyễn Tiến Đạt',
        role: 'Trẻ em',
        avatar: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg',
    },
];

export default async function HomePage() {
    const products = await getPublicProducts();
    return (
        <div className="font-sans text-gray-800">
            {/* Hero */}
            <section className="bg-white py-10 px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-bold mb-4">
                        Explore high-quality online courses
                    </h1>
                    <p className="text-lg mb-4">
                        Online learning platform helps you develop skills
                        quickly and effectively.
                    </p>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-md">
                        <a href="/products">Start Learning</a>
                    </button>
                </div>
                <img
                    src="https://www.vikasconcept.com/wp-content/uploads/2024/01/Pros-and-Cons-of-Taking-Online-Courses.png"
                    alt="Learning illustration"
                    className="w-full md:w-1/2 mt-6 md:mt-0"
                />
            </section>

            {/* Courses */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-bold mb-4">Featured Coursed</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.slice(1, 5).map((product) => (
                        <div key={product.id}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                priceInDollars={product.priceInDollars}
                                imageUrl={product.image_url}
                                slot={product.slot}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <a
                        href="/products"
                        className="inline-block bg-teal-500 text-white px-4 py-2 rounded-md	hover:bg-green-700"
                    >
                        See All
                    </a>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-10 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                        <span className="bg-teal-500 text-white rounded-full p-3 mr-3">
                            🎓
                        </span>
                        <div>
                            <h4 className="font-semibold">
                                Reputable lecturer
                            </h4>
                            <p>Taught by leading experts</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="bg-teal-500 text-white rounded-full p-3 mr-3">
                            📜
                        </span>
                        <div>
                            <h4 className="font-semibold">
                                Proof just completed
                            </h4>
                            <p>
                                Receive immediately upon completion of the
                                course .
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="bg-teal-500 text-white rounded-full p-3 mr-3">
                            📞
                        </span>
                        <div>
                            <h4 className="font-semibold">24/7 support</h4>
                            <p>Support students anytime, anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Teachers */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-bold mb-4">Featured Instructor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex flex-col items-center p-4 border rounded-lg shadow"
                        >
                            <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-20 h-20 rounded-full mb-2 object-cover"
                            />
                            <h3 className="font-semibold">{teacher.name}</h3>
                            <p className="text-sm text-gray-600">
                                {teacher.role}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-100 py-10 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="italic">
                        "The course here is great! The content is easy to
                        understand and teach Dedicated and experienced staff."
                    </p>
                    <p className="mt-2 font-semibold">- Petty</p>
                </div>
            </section>
        </div>
    );
}
async function getPublicProducts() {
    'use cache';
    cacheTag(getProductGlobalTag());

    return database.query.ProductTable.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            image_url: true,
            slot: true,
        },
        where: wherePublicProducts,
        orderBy: asc(ProductTable.name),
    });
}
