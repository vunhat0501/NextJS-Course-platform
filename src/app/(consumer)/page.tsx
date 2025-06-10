import { database } from '@/drizzle/db';
import { ProductCard } from '@/features/products/components/ProductCard';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { ProductTable } from '@/drizzle/schema';
import { UserTable } from '@/drizzle/schema/user';
import { eq } from 'drizzle-orm';
import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess';
import { count } from 'drizzle-orm';
import HeroSlider from './HeroSlider';
import Link from 'next/link';

export default async function HomePage() {
    const products = await getPublicProducts();
    // Lấy instructor từ database: role là 'admin' hoặc 'instructor' (nếu có role instructor)
    const instructors = await database.query.UserTable.findMany({
        columns: { id: true, name: true, imageUrl: true },
        where: eq(UserTable.role, 'admin'),
    });
    // Đếm số lượng course đã mua/được gán cho từng instructor
    const accessCounts = await database
        .select({ userId: UserCourseAccessTable.userId, courseCount: count() })
        .from(UserCourseAccessTable)
        .groupBy(UserCourseAccessTable.userId);
    const accessMap = Object.fromEntries(
        accessCounts.map((a) => [a.userId, a.courseCount]),
    );
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
                        <Link href="/products">Start Learning</Link>
                    </button>
                </div>
                <HeroSlider />
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
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <Link
                        href="/products"
                        className="inline-block bg-teal-500 text-white px-4 py-2 rounded-md	hover:bg-green-700"
                    >
                        See All
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-10 px-6">
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    {[
                        {
                            icon: '🎓',
                            title: 'Reputable lecturer',
                            desc: 'Taught by leading experts',
                            color: 'from-purple-400 to-pink-400',
                        },
                        {
                            icon: '📝',
                            title: 'Proof just completed',
                            desc: 'Receive immediately upon completion of the course.',
                            color: 'from-blue-400 to-cyan-400',
                        },
                        {
                            icon: '📞',
                            title: '24/7 support',
                            desc: 'Support students anytime, anywhere.',
                            color: 'from-green-400 to-teal-400',
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center p-6 rounded-2xl shadow-xl bg-gradient-to-br ${f.color} text-white w-full max-w-xs transition-transform hover:scale-105 hover:shadow-2xl`}
                        >
                            <div className="text-4xl mb-3 drop-shadow">
                                {f.icon}
                            </div>
                            <div className="font-bold text-lg mb-1">
                                {f.title}
                            </div>
                            <div className="text-sm opacity-90 text-center">
                                {f.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Teachers */}
            <section className="py-10 px-6">
                <h2 className="text-2xl font-bold mb-4">
                    Featured Instructors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {instructors.map((instructor) => (
                        <div
                            key={instructor.id}
                            className="flex flex-col items-center p-4 border rounded-lg shadow bg-white"
                        >
                            <img
                                src={
                                    instructor.imageUrl &&
                                    instructor.imageUrl.trim() !== ''
                                        ? instructor.imageUrl
                                        : '/default-avatar.png'
                                }
                                alt={instructor.name}
                                className="w-20 h-20 rounded-full mb-2 object-cover border border-gray-200 bg-gray-100"
                            />
                            <h3 className="font-semibold text-gray-900">
                                {instructor.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Purchased {accessMap[instructor.id] || 0}{' '}
                                courses
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-10 px-6 flex justify-center">
                <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl p-10 max-w-3xl w-full text-center relative">
                    <div className="text-5xl text-purple-300 absolute left-6 top-2 select-none">
                        “
                    </div>
                    <p className="italic text-lg text-gray-700 z-10 relative">
                        The course here is great! The content is easy to
                        understand and the staff are dedicated and experienced.
                    </p>
                    <div className="mt-4 font-semibold text-purple-700">
                        - Petty
                    </div>
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
