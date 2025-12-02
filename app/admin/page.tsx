export default function AdminDashboard() {
  const items = [
    { title: "Organização", href: "/admin/organize", color: "from-purple-500 to-pink-500" },
    { title: "Produtos", href: "/admin/products", color: "from-blue-500 to-cyan-500" },
    { title: "Blog", href: "/admin/blog", color: "from-emerald-500 to-teal-500" },
    { title: "SEO & Marketing", href: "/admin/seo", color: "from-yellow-500 to-orange-500" },
    { title: "Tarefas", href: "/admin/tarefas", color: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Painel Administrativo — Sheidbox
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="p-6 rounded-2xl bg-gradient-to-br shadow-xl hover:scale-[1.02] transition-transform cursor-pointer
                       text-white font-bold text-xl text-center"
          >
            <div className={`bg-gradient-to-br ${item.color} p-6 rounded-xl`}>
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
