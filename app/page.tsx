import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"

// Custom TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Top Banner */}
      <div className="bg-black text-stone-50 py-2 text-center text-sm">
        <div className="container">
          <p>Find us at Myrtle Wombat (Fort Greene) and Marbled Meat Shop (Beacon)!</p>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b bg-stone-50/80 backdrop-blur-sm border-stone-200">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="charah logo" width={40} height={40} className="scale-110" />
            <span className="text-2xl uppercase" style={{ fontFamily: "var(--font-anton)", color: "#fb784f" }}>CHARAH</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="#product" className="text-sm font-medium text-stone-700 hover:text-red-700 transition-colors">
              Signature Sauces
            </Link>
            <Link href="#brand" className="text-sm font-medium text-stone-700 hover:text-red-700 transition-colors">
              Our Story
            </Link>
            <Link href="#contact" className="text-sm font-medium text-stone-700 hover:text-red-700 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 to-stone-900/40 z-10" />
          <div className="relative h-[60vw] md:h-screen w-full">
            <Image
              src="/headline.png"
              alt="Delicious char siu pork with charah sauce served over rice"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container">
              <div className="max-w-2xl space-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <Image src="/logo.png" alt="charah logo" width={60} height={60} className="scale-110" />
                  <h1 className="text-6xl md:text-7xl uppercase" style={{ fontFamily: "var(--font-anton)", color: "#fb784f" }}>CHARAH</h1>
                </div>
                <p className="text-xl text-stone-100 leading-relaxed">
                  Authentically Hong Kong. Reimagined in Brooklyn.
                </p>
                <p className="text-xl text-stone-100 leading-relaxed">Ready for the American Table.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="py-12" style={{ backgroundColor: "#faf3e6" }}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl text-stone-900 mb-6 tracking-wide"><span style={{ fontFamily: "var(--font-anton)", color: "#fb784f" }}>CHARAH</span> Original</h3>
                <p className="text-md text-stone-700 mb-8 leading-relaxed">
                Our flagship <strong>char siu BBQ marinade</strong> is a labor of love — five years in the making. While the world perfected sourdough during lockdown, we were perfecting <strong>Charah</strong> — the bold, sweet-savory marinade that brings Hong Kong to your kitchen.</p>
                <p className="text-md text-stone-700 mb-8 leading-relaxed"> Crafted with traditional soy sauce, fresh aromatics, and a carefully guarded blend of spices — including fermented tofu <em>(think cheese, but soy-based and funky in the best way)</em> — this marinade is our love letter to char siu.</p>
                <ul><li>✨ <strong>Best with pork.</strong> Great with chicken. Versatile with anything.</li>
                <li>🔥 Small-batch made, always.</li>
                <li>🥢 The perfect crowd-pleaser for your next BBQ.</li></ul>               
                <div className="space-y-4 mb-10">
                </div>
              </div>
              <div className="relative h-[500px] order-1 md:order-2">
                <Image
                  src="/sauce.png"
                  alt="charah Original Sauce bottle"
                  fill
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Divider */}
        <div className="h-px bg-stone-300/50" style={{ backgroundColor: "#faf3e6" }}>
          <div className="h-px bg-stone-300/30 mx-auto max-w-4xl"></div>
        </div>

        {/* Chili Oil Section */}
        <section className="py-12" style={{ backgroundColor: "#faf3e6" }}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] order-1 md:order-1">
                <Image
                  src="/chili-oil.png"
                  alt="charah Homemade Chili Oil bottle"
                  fill
                  className="object-contain mix-blend-multiply"
                />
              </div>
              <div className="order-2 md:order-2">
                <h3 className="text-3xl text-stone-900 mb-6 tracking-wide"><span style={{ fontFamily: "var(--font-anton)", color: "#fb784f" }}>CHARAH</span> Chili Oil</h3>
                <p className="text-md text-stone-700 mb-8 leading-relaxed">
                  Made with premium dried chilies, tongue-tingling peppercorns, and a secret blend of fragrant spices — it’s bold, aromatic, and just the right kind of dangerous.
                <br/><br/>
                We created our chili oil to bring a little kick to the deep, savory notes of our signature charah marinade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Section */}
        <section id="brand" className="py-16" style={{ backgroundColor: "#000000" }}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-serif text-stone-50 mb-8 tracking-wide">Our Story</h2>
                <p className="text-lg text-stone-100 mb-6 leading-relaxed">
                  We are Flora and Clara, the makers of Charah. We share deep roots in Hong Kong, were globally raised,
                  and now proudly rooted in Brooklyn, New York.
                </p>
                <p className="text-lg text-stone-100 leading-relaxed">
                  Caught between our identities as proud Hong Kongers and Americans, Charah is our way of honoring the
                  city that shaped and fueled us.
                </p>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/about-us.png"
                  alt="Flora and Clara, the makers of charah sauce"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16" style={{ backgroundColor: "#faf3e6" }}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-serif text-stone-900 mb-8 tracking-wide">Get in Touch</h2>
                <p className="text-lg text-stone-700 mb-10 leading-relaxed">
                  Have questions about our sauce or interested in wholesale orders? We'd love to hear from you!
                </p>
              </div>
              <div>
                <div className="space-y-6 mb-10">
                  <div>
                    <h3 className="text-lg font-serif text-stone-900 mb-2 tracking-wide">Email</h3>
                    <p className="text-stone-700">hello@chara-foods.com</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-stone-900 mb-4 tracking-wide">Follow Us</h3>
                  <div className="flex space-x-4">
                    <Link href="https://instagram.com/eat.charah" target="_blank" rel="noopener noreferrer" className="text-stone-700 hover:text-red-700 transition-colors">
                      <Instagram className="h-6 w-6" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-stone-700 hover:text-red-700 transition-colors">
                      <TikTokIcon className="h-6 w-6" />
                      <span className="sr-only">TikTok</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
      </main>
      <footer className="bg-stone-900 text-stone-50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="charah logo" width={32} height={32} className="scale-110" />
                <h3 className="text-lg font-serif tracking-wide">charah</h3>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Bringing authentic Asian barbecue flavors to your kitchen since 2018.
              </p>
              <br/>
              <p className="text-stone-400">&copy; {new Date().getFullYear()} chara. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4 tracking-wide">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Original Sauce
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Chili Oil
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4 tracking-wide">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif mb-4 tracking-wide">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-stone-400 hover:text-stone-50 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
