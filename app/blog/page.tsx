import { BlogCard } from "@/components/cards/blog-card";
import { blogPosts } from "@/lib/data";

export default function BlogPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-3xl">
          <p className="section-kicker">Blog du lịch</p>
          <h1 className="section-title">
            Kinh nghiệm đi Đà Lạt cho chuyến cuối tuần và kỳ nghỉ dài.
          </h1>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
